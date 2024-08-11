"use client"

import React, { useState, useEffect } from "react";
import { Input, Button, Select, Space } from "antd";
import { SwalCenter } from "@/utils/sweetAlertCenter";
import Loading from "@/components/loading";
import { useNavigate } from "@/utils/navigation";
import { useParams } from "next/navigation";
import { CreateSong, SongFindByID, UpdateSong } from "@/apis/managesong";
import { CategoryFindAll, UpdateCategory } from "@/apis/managecategory";

type Props = {};
const { Option } = Select;

export default function EditSongsByID({}: Props) {
  const navigation = useNavigate();
  const params = useParams();
  const id = params.id as string;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [songname, setSongname] = useState<string>("");
  const [artist, setArtist] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [songCode, setSongCode] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [categoryFindAllData, setCategoryFindAllData] = useState<any[]>([]);

  const handleCancel = () => {
    navigation.Back();
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const body = {
        songname,
        artist,
        record_labelId: category,
        songcode: songCode,
        note,
      };

      const response = await UpdateSong(id, body);
      console.log("Response:", response);

      SwalCenter("อัปเดตเพลงสำเร็จ", "success", undefined, () =>
        navigation.ManageSong()
      );
    } catch (error: any) {
      SwalCenter(
        error.data?.messageTh || "เกิดข้อผิดพลาด",
        "error",
        undefined,
        undefined
      );
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const FindAllCategoryData = async () => {
    setIsLoading(true);
    try {
      const response = await CategoryFindAll();
      console.log("response data", response);
      setCategoryFindAllData(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    FindAllCategoryData();
  }, []);

  const FindSongDataById = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await SongFindByID(id);
      console.log("API response:", response);
      const data = response.data;

      if (data) {
        setSongname(data.songname || "");
        setArtist(data.artist || "");
        setSongCode(data.songcode || "");
        setNote(data.note || "");
        setCategory(data.record_labelId || "");
      } else {
        console.error("No data found");
      }
    } catch (error) {
      console.error("Error fetching song:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      FindSongDataById(id);
    }
  }, [id]);

  return (
    <main className="w-full flex flex-col">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col w-full justify-between gap-8 sm:pt-4">
          <div className="flex flex-col w-full gap-4 justify-start">
            <div className="flex flex-col gap-2">
              <label className="text-[#323257] text-[24px] text-start font-semibold">
                แก้ไขเพลง{" "}{songname}
              </label>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#323257] text-[14px] text-start font-semibold">
                ชื่อเพลง<span className="text-[#FD7573]"> *</span>
              </label>
              <Input
                className="w-full"
                size="large"
                placeholder="ชื่อเพลง"
                value={songname}
                onChange={(event) => setSongname(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#323257] text-[14px] text-start font-semibold">
                ศิลปิน / นักร้อง
              </label>
              <Input
                className="w-full"
                size="large"
                placeholder="ศิลปิน / นักร้อง"
                value={artist}
                onChange={(event) => setArtist(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#323257] text-[14px] text-start font-semibold">
                หมวดหมู่ค่ายเพลง
              </label>
              <Select
                placeholder="เลือกหมวดหมู่"
                value={category || undefined}
                onChange={(value) => setCategory(value)}
                className="w-full"
              >
                {categoryFindAllData.map((option) => (
                  <Option key={option.id} value={option.id}>
                    {option.name}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#323257] text-[14px] text-start font-semibold">
                รหัสเพลง
              </label>
              <Input
                className="w-full"
                size="large"
                placeholder="รหัสเพลง"
                value={songCode}
                onChange={(event) => setSongCode(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#323257] text-[14px] text-start font-semibold">
                หมายเหตุ
              </label>
              <Input.TextArea
                className="w-full"
                size="large"
                placeholder="หมายเหตุ"
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
            </div>
          </div>
          <div className="w-full sm:flex">
            <Space>
              <Button size="large" onClick={handleCancel}>
                ยกเลิก
              </Button>
              <Button
                size="large"
                type="primary"
                onClick={handleUpdate}
                disabled={!songname}
              >
                ยืนยัน
              </Button>
            </Space>
          </div>
        </div>
      )}
    </main>
  );
}
