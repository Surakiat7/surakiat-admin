"use client";

import React, { useState, useEffect } from "react";
import {
  message,
  Input,
  Button,
  Upload,
  UploadFile,
  Space,
  Radio,
  Modal,
  Select,
  Table,
  UploadProps,
} from "antd";
import { SwalCenter } from "@/utils/sweetAlertCenter";
import Loading from "@/components/loading";
import { useNavigate } from "@/utils/navigation";
import { CreateSong, ImportFileXlxs } from "@/apis/managesong";
import { LuUploadCloud } from "react-icons/lu";
import type { RadioChangeEvent } from "antd";
import { CategoryFindAll } from "@/apis/managecategory";
import * as XLSX from "xlsx";
import { GoDotFill } from "react-icons/go";
import DownloadTemplateExcelButton from "@/components/Button/DownloadTemplateExcelButton";

type Props = {};
const { Dragger } = Upload;
const { Option } = Select;

const columns = [
  {
    title: "ลำดับ",
    dataIndex: "index",
    key: "index",
    render: (text: number, record: any) => (
      <span
        className={
          record.isError
            ? "text-red-500"
            : record.isSuccess
            ? "text-green-500"
            : ""
        }
      >
        {text}
      </span>
    ),
  },
  {
    title: "รายชื่อเพลง",
    dataIndex: "songName",
    key: "songName",
    render: (text: string, record: any) => (
      <span
        className={
          record.isError
            ? "text-red-500"
            : record.isSuccess
            ? "text-green-500"
            : ""
        }
      >
        {text}
      </span>
    ),
  },
  {
    title: "ศิลปิน / นักร้อง",
    dataIndex: "artist",
    key: "artist",
    render: (text: string, record: any) => (
      <span
        className={
          record.isError
            ? "text-red-500"
            : record.isSuccess
            ? "text-green-500"
            : ""
        }
      >
        {text}
      </span>
    ),
  },
  {
    title: "ค่ายเพลง",
    dataIndex: "label",
    key: "label",
    render: (text: string, record: any) => (
      <span
        className={
          record.isError
            ? "text-red-500"
            : record.isSuccess
            ? "text-green-500"
            : ""
        }
      >
        {text}
      </span>
    ),
  },
  {
    title: "รหัสเพลง",
    dataIndex: "code",
    key: "code",
    render: (text: string, record: any) => (
      <span
        className={
          record.isError
            ? "text-red-500"
            : record.isSuccess
            ? "text-green-500"
            : ""
        }
      >
        {text}
      </span>
    ),
  },
];

export default function CreateSongs({}: Props) {
  const navigation = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [songname, setSongname] = useState<string>("");
  const [artist, setArtist] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [songCode, setSongCode] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [UploadedFile, setUploadedFile] = useState<
    {
      id: string;
      url: string;
      order: number;
      isCover: boolean;
    }[]
  >([]);
  const [radioValue, setRadioValue] = useState(1);
  const [categoryFindAllData, setCategoryFindAllData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [importSuccessCount, setImportSuccessCount] = useState<number>(0);
  const [importErrorCount, setImportErrorCount] = useState<number>(0);

  const RadioonChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setRadioValue(e.target.value);
  };

  const customRequest: UploadProps["customRequest"] = ({
    file,
    onSuccess,
    onError,
    onProgress,
  }) => {
    const formData = new FormData();
    formData.append("file", file as File);

    ImportFileXlxs(formData)
      .then((response: any) => {
        console.log("API Response:", response);

        const reader = new FileReader();
        reader.onload = (e: any) => {
          const binaryStr = e.target.result;
          const workbook = XLSX.read(binaryStr, { type: "binary" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // Skip the first two rows (headers)
          const rows = json.slice(2).map((row: any, index: number) => ({
            id: row[0],
            songName: row[1],
            artist: row[2],
            label: row[3],
            code: row[4],
            index: index + 2, // Adjust for the index after skipping rows
          }));

          // Ensure that response.data.data contains arrError and arrSuccess
          const { arrError = [], arrSuccess = [] } = response.data.data || {};

          const updatedRows = rows
            .filter(
              (row) =>
                row.id && row.songName && row.artist && row.label && row.code
            )
            .map((row) => ({
              ...row,
              isError: arrError.includes(row.index - 2),
              isSuccess: arrSuccess.includes(row.index - 2),
            }));

          setTableData(updatedRows);
          setImportSuccessCount(arrSuccess.length);
          setImportErrorCount(arrError.length);
          setIsModalVisible(true);
        };
        reader.readAsBinaryString(file as File);

        if (response.status === 200 && response.data.statusCode === 200) {
          if (response.data.data.arrError.length === 0) {
            onSuccess?.(response.data.data);
            message.success(
              `เพิ่มข้อมูลสำเร็จ ${response.data.data.arrSuccess.length} รายการ`
            );
          } else {
            const errorMsg = `พบข้อผิดพลาดในแถวที่: ${response.data.data.arrError.join(
              ", "
            )}`;
            console.error(errorMsg);
            onError?.(new Error(errorMsg));
            message.error(errorMsg);
          }
        } else {
          const errorMsg = response.data.messageEn || "Upload failed";
          console.error(errorMsg);
          onError?.(new Error(errorMsg));
          message.error(errorMsg);
        }
      })
      .catch((error) => {
        console.error("Upload Error:", error);
        onError?.(error);
        message.error("เกิดข้อผิดพลาดในการอัปโหลด");
      });
  };

  const props: UploadProps = {
    name: "file",
    multiple: false,
    accept: ".xlsx",
    showUploadList: true,
    fileList: fileList,
    customRequest: customRequest,
    beforeUpload(file) {
      console.log("Before upload - File type:", file.type);
      const isExcel =
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      if (!isExcel) {
        message.error("ไฟล์ที่อัปโหลดต้องเป็นไฟล์ Excel (.xlsx)");
      }
      return isExcel || Upload.LIST_IGNORE;
    },
    onChange(info) {
      const { file, fileList } = info;

      console.log("File status:", file.status);
      console.log("File data:", file);

      if (file.status === "done") {
        setFileList([file]);
      } else if (file.status === "error") {
        setFileList([]);
      } else {
        setFileList(fileList);
      }

      console.log("Current file list:", fileList);
    },
  };

  const FindAllCategoryData = async () => {
    setIsLoading(true);
    try {
      const response = await CategoryFindAll();
      console.log("response data", response);
      setCategoryFindAllData(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    FindAllCategoryData();
  }, []);

  const handleCancel = () => {
    navigation.Back();
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const body = {
        songname,
        artist,
        record_labelId: category,
        songcode: songCode,
        note,
      };

      const response = await CreateSong(body);
      console.log("Response:", response);

      SwalCenter("เพิ่มเพลงสำเร็จ", "success", undefined, () =>
        navigation.ManageSong()
      );
    } catch (error: any) {
      const messageTh = error?.messageTh || "An error occurred";
      SwalCenter(messageTh, "error", undefined, undefined);
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
    navigation.ManageSong();
  };

  return (
    <main className="w-full flex flex-col">
      <Modal
        title={`ผลการนำเข้าข้อมูลเพลงสำเร็จ ${importSuccessCount} เพลง ไม่สำเร็จ ${importErrorCount} เพลง`}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="ok" type="primary" onClick={handleOk}>
            ตกลง
          </Button>
        ]}
      >
        <div className="flex flex-col w-full gap-2">
          {importErrorCount && (
            <p className="text-md font-base">
              เพลงที่นำเข้าไม่สำเร็จ กรุณาตรวจสอบข้อมูลรหัสเพลงเพลงอาจจะซ้ำกัน
              หรือหมวดหมู่ค่ายเพลงไม่มีในระบบ
            </p>
          )}
          <div className="flex w-full items-center gap-2">
            <div className="flex items-center gap-1">
              <GoDotFill color="#10b981" />
              <p className="text-[#10b981] text-sm p-0 m-0 sm:whitespace-nowrap">
                เพลงที่เพิ่มมาใหม่สำเร็จ
              </p>
            </div>
            <div className="flex items-center sm:w-full gap-1">
              <GoDotFill color="#ef4444" />
              <p className="text-red-500 text-sm p-0 m-0 sm:whitespace-nowrap">
                เพลงที่เพิ่มไม่สำเร็จ
              </p>
            </div>
          </div>
        </div>
        <Table columns={columns} dataSource={tableData} rowKey="id" />
      </Modal>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col w-full justify-between gap-8 sm:pt-4">
          <div className="flex flex-col w-full gap-4 justify-start">
            <div className="flex flex-col gap-2">
              <label className="text-[#323257] text-[14px] text-start font-semibold">
                เพิ่มเพลงในระบบ
              </label>
              <Radio.Group onChange={RadioonChange} value={radioValue}>
                <Radio value={1}>อัปโหลดไฟล์หลายเพลง</Radio>
                <Radio value={2}>เพิ่มทีละเพลง</Radio>
              </Radio.Group>
            </div>
            {radioValue === 1 && (
              <div className="w-full">
                <div className="flex w-full flex-col">
                  <label className="text-[#323257] text-[14px] text-start font-semibold pb-2">
                    เทมเพลตเพิ่มเพลง
                  </label>
                  <div className="sm:w-full pb-4">
                    <DownloadTemplateExcelButton />
                  </div>
                  <label className="text-[#323257] text-[14px] text-start font-semibold pb-2">
                    อัปโหลดไฟล์ excel ตามเทมเพลตแนะนำ{" "}
                    <span className="text-[#FD7573]"> *</span>
                  </label>
                  <Dragger {...props} listType="picture" className="w-full">
                    <div className="flex justify-center">
                      <LuUploadCloud size={55} />
                    </div>
                    <p className="ant-upload-text">
                      ลากวางหรือคลิกเพื่อเพิ่มไฟล์ Excel
                    </p>
                    <p className="ant-upload-hint">
                      รองรับไฟล์ประเภท Excel เท่านั้น: XLSX
                    </p>
                  </Dragger>
                </div>
              </div>
            )}
            {radioValue === 2 && (
              <>
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
              </>
            )}
          </div>
          {/* {radioValue === 1 && tableData.length > 0 && (
            <div className="w-full">
              <Table
                columns={columns}
                dataSource={tableData}
                rowKey="id"
                pagination={false}
              />
            </div>
          )} */}
          <div className="w-full sm:flex">
            <Space>
              <Button size="large" onClick={handleCancel}>
                ยกเลิก
              </Button>
              {radioValue === 2 && (
                <Button
                  size="large"
                  type="primary"
                  onClick={handleSubmit}
                  disabled={!songname || !songCode || !category || !artist}
                >
                  ยืนยัน
                </Button>
              )}
            </Space>
          </div>
        </div>
      )}
    </main>
  );
}
