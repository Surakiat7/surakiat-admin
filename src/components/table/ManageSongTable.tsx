"use client";

import {
  Table,
  Space,
  PaginationProps,
  Tooltip,
  Image,
  Button,
  Select,
  Switch,
  Input,
} from "antd";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/authContext";
import { useNavigate } from "@/utils/navigation";
import { TbEditCircle } from "react-icons/tb";
import { RiDeleteBin5Line } from "react-icons/ri";
import { SwalCenter } from "@/utils/sweetAlertCenter";
import DeleteModal from "../Modal/DeleteContent";
import { IoSearch } from "react-icons/io5";
import { MdKeyboardArrowDown } from "react-icons/md";
import { ListSongFindAll, DeleteSong, ActiveSongByID } from "@/apis/managesong";
import { ColumnType } from "antd/es/table";
import DownloadTemplateExcelButton from "../Button/DownloadTemplateExcelButton";
import { GoDotFill } from "react-icons/go";
import { CategoryFindAll } from "@/apis/managecategory";

type Props = {};

interface FilterDropdownProps {
  setSelectedKeys: (selectedKeys: React.Key[]) => void;
  selectedKeys: React.Key[];
  confirm: () => void;
  clearFilters: () => void;
}

export default function SongsTable({}: Props) {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const { mobileScreen } = useAuth();
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedLabel, setSelectedLabel] = useState<string>("All");
  const [expanded, setExpanded] = useState(false);
  const [expandedRecord, setExpandedRecord] = useState<any | null>(null);
  const [skip, setSkip] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [FilteredData, setFilteredData] = useState<any[]>([]);
  const [recordLabels, setRecordLabels] = useState<any[]>([]);
  const [switchStatus, setSwitchStatus] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  const toggleExpanded = (record: any) => {
    setExpandedRecord((prevRecord: any) =>
      prevRecord === record ? null : record
    );
  };

  const onLabelChange = (value: string) => {
    setSelectedLabel(value);
  };

  const onSearchChange = (value: string) => {
    setSearchValue(value);
  };

  useEffect(() => {
    if (searchValue.trim() === "") {
      FindAllSongData();
    } else {
      handleSearch(searchValue);
    }
  }, [searchValue]);

  useEffect(() => {
    handleSearch(searchValue);
  }, [searchValue, selectedLabel]);

  const handleSearch = async (value: string) => {
    try {
      setLoading(true);
      const response = await ListSongFindAll();
      const data = response.data;
      const searchValue = value.toLowerCase();

      setFilteredData(() => {
        return data.filter((song: any) => {
          const songName =
            typeof song.songname === "string"
              ? song.songname.toLowerCase()
              : "";
          const artist =
            typeof song.artist === "string" ? song.artist.toLowerCase() : "";
          const recordLabel =
            typeof song.recordlabel === "string"
              ? song.recordlabel.toLowerCase()
              : "";

          const matchesSearch =
            songName.includes(searchValue) ||
            artist.includes(searchValue) ||
            recordLabel.includes(searchValue);

          const matchesLabel =
            selectedLabel === "All" ||
            recordLabel === selectedLabel.toLowerCase();

          return matchesSearch && matchesLabel;
        });
      });
    } catch (error) {
      console.error("Error searching:", error);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: any) => {
    navigation.ManageSongEdit(id);
  };

  const columns: ColumnType<any>[] = [
    {
      title: "ลำดับ",
      dataIndex: "index",
      key: "index",
      align: "center" as const,
      render: (text: string, record: any, index: number) => {
        const globalIndex = Math.floor(skip / size) * size + index + 1;
        return (
          <span className={record.newsong ? "text-[#10b981]" : ""}>
            {globalIndex}
          </span>
        );
      },
    },
    {
      title: "ชื่อเพลง",
      dataIndex: "songname",
      key: "songname",
      align: "center" as const,
      render: (text: string, record: any) => (
        <div className="flex items-center justify-center">
          <span className={`${record.newsong ? "text-[#10b981]" : ""}`}>
            {text}
          </span>
          {/* {record.isnewsong && <MdOutlineKeyboardArrowDown color="#10b981" />} */}
        </div>
      ),
    },
    {
      title: (
        <span className="text-center flex justify-center">ศิลปิน/นักร้อง</span>
      ),
      dataIndex: "artist",
      key: "artist",
      align: "center" as const,
      render: (text: string, record: any) => (
        <span className={record.newsong ? "text-[#10b981]" : ""}>{text}</span>
      ),
    },
    {
      title: (
        <span className="text-center flex justify-center">
          หมวดหมู่ค่ายเพลง
        </span>
      ),
      dataIndex: "recordlabel",
      key: "recordlabel",
      filters: recordLabels.map((label) => ({
        text: label.name,
        value: label.name,
      })),
      onFilter: (value: React.Key | boolean, record: any) =>
        record.recordlabel.toLowerCase() === String(value).toLowerCase(),
      align: "center" as const,
      render: (text: string, record: any) => (
        <span className={record.newsong ? "text-[#10b981]" : ""}>{text}</span>
      ),
    },
    {
      title: "รหัสเพลง",
      dataIndex: "songcode",
      key: "songcode",
      align: "center" as const,
      render: (text: string, record: any) => (
        <span className={record.newsong ? "text-[#10b981]" : ""}>{text}</span>
      ),
    },
    {
      title: "หมายเหตุ",
      dataIndex: "note",
      key: "note",
      align: "center" as const,
      render: (text: string, record: any) => (
        <span className={record.newsong ? "text-[#10b981]" : ""}>
          {text || "-"}
        </span>
      ),
    },
    {
      title: "จัดการ",
      key: "action",
      align: "center" as const,
      render: (text: any, record: any, key: any) => (
        <Space size="middle">
          <EditButton onClickFn={() => handleEdit(record.id)} />
          <DeleteButton onClickFn={() => handleOpenDeleteModal(record)} />
        </Space>
      ),
    },
  ];

  const MobileColumns: ColumnType<any>[] = [
    {
      title: "ลำดับ",
      dataIndex: "index",
      key: "index",
      align: "center" as const,
      render: (text: string, record: any, index: number) => (
        <span className={record.isnewsong ? "text-[#10b981]" : ""}>
          {index + 1}
        </span>
      ),
    },
    {
      title: "ชื่อเพลง",
      dataIndex: "songname",
      key: "songname",
      align: "center" as const,
      render: (text: string, record: any) => (
        <div className="flex items-center justify-center">
          <span className={`${record.isnewsong ? "text-[#10b981]" : ""}`}>
            {text}
          </span>
          {/* {record.isnewsong && <MdOutlineKeyboardArrowDown color="#10b981" />} */}
        </div>
      ),
    },
    {
      title: (
        <span className="text-center flex justify-center">
          หมวดหมู่ค่ายเพลง
        </span>
      ),
      dataIndex: "recordlabel",
      key: "recordlabel",
      filters: recordLabels.map((label) => ({
        text: label.name,
        value: label.name,
      })),
      onFilter: (value: React.Key | boolean, record: any) =>
        record.recordlabel.toLowerCase() === String(value).toLowerCase(),
      align: "center" as const,
      render: (text: string, record: any) => (
        <span className={record.isnewsong ? "text-[#10b981]" : ""}>{text}</span>
      ),
    },
  ];

  const onPaginationChange: PaginationProps["onChange"] = (
    page: number,
    pageSize: number
  ) => {
    const newSkip = (page - 1) * pageSize;
    setSkip(newSkip);
    setSize(pageSize);
  };

  const ToggleActiveSong = async (contentId: number, newStatus: boolean) => {
    setLoading(true);
    try {
      const response = await ActiveSongByID(contentId);
      console.log("response toggle data", response);

      setFilteredData((prevData) =>
        prevData.map((content) =>
          content.id === contentId
            ? { ...content, isPublish: newStatus }
            : content
        )
      );
      setSwitchStatus((prevState) => ({
        ...prevState,
        [contentId]: newStatus,
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("FilteredData", FilteredData);
    if (FilteredData) {
      const initialSwitchStatus = FilteredData.reduce(
        (acc, content) => ({
          ...acc,
          [content.id]: content.isPublish,
        }),
        {}
      );
      setSwitchStatus(initialSwitchStatus);
    }
  }, [FilteredData]);

  const FindAllSongData = async () => {
    setLoading(true);
    try {
      const response = await ListSongFindAll();
      console.log("response data", response);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const RecordRabelFindAll = async () => {
    setLoading(true);
    try {
      const response = await CategoryFindAll();
      console.log("response data", response);
      setRecordLabels(response.data);
    } catch (error) {
      console.error("Error fetching record labels:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    RecordRabelFindAll();
    FindAllSongData();
  }, []);

  const handleOpenDeleteModal = (record: any) => {
    setDeleteItemId(record.id);
    setDeleteModalVisible(true);
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setDeleteItemId(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await DeleteSong(deleteItemId);
      SwalCenter("ลบข้อมูลสำเร็จ", "success", undefined, undefined);
      setFilteredData((previousResponse: any[]) =>
        previousResponse.filter((item: { id: any }) => item.id !== deleteItemId)
      );
    } catch (error: any) {
      SwalCenter(error.data.message_th, "error", undefined, undefined);
      console.error(error);
    } finally {
      setDeleteModalVisible(false);
      setDeleteItemId(null);
      setLoading(false);
    }
  };

  return (
    <>
      <DeleteModal
        visible={deleteModalVisible}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
      <div className="flex flex-col justify-center gap-4 w-full">
        <div
          className={`flex sm:flex-col md:flex-col md:items-start sm:items-start w-full items-center justify-between sm:justify-between sm:gap-2 gap-4`}
        >
          <div className="flex sm:flex-col gap-4 w-fit">
            <Space.Compact className="w-full my-select-container">
              <Select
                className="!h-12 w-2/4 rounded-full text-[16px]"
                defaultValue="All"
                onChange={onLabelChange}
                options={[
                  { value: "All", label: "All" },
                  ...recordLabels.map((label) => ({
                    value: label.name,
                    label: label.name,
                  })),
                ]}
              />
              <Input
                placeholder="ค้นหาเพลงในระบบ"
                suffix={<IoSearch style={{ color: "rgba(0,0,0,.45)" }} />}
                onChange={(e) => onSearchChange(e.target.value)}
                className="!h-12 p-2 w-[200px] sm:w-full rounded-lg flex gap-2 items-center"
              />
            </Space.Compact>
            <div className="flex w-full items-center gap-2">
              <div className="flex items-center gap-1">
                <GoDotFill color="#10b981" />
                <p className="text-[#10b981] text-sm p-0 m-0 sm:whitespace-nowrap">
                  เพลงที่เพิ่มเข้ามาใหม่
                </p>
              </div>
              <div className="flex items-center sm:w-full gap-1">
                <GoDotFill color="#000000" />
                <p className="text-[#000000] text-sm p-0 m-0 sm:whitespace-nowrap">
                  เพลงเดิมในระบบ
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-4 sm:gap-2 sm:w-full items-center">
            <div className="sm:w-full">
              <DownloadTemplateExcelButton />
            </div>
            <Button
              type="primary"
              className="!h-min sm:w-full p-2 rounded-lg flex text-white items-center"
              onClick={() => navigation.ManageSongCreate()}
            >
              + เพิ่มเพลงในระบบ
            </Button>
          </div>
        </div>
        <div className="bg-white rounded-lg overflow-y-auto">
          {/* ตาราง */}
          <Table
            columns={mobileScreen ? MobileColumns : columns}
            loading={loading}
            dataSource={FilteredData}
            rowKey={"id"}
            locale={{ emptyText: "ไม่พบข้อมูล" }}
            expandable={
              mobileScreen
                ? {
                    expandedRowRender: (record) => (
                      <div className="w-full">
                        <p className="text-lg text-[#1e293b] font-semibold mb-2">
                          รายละเอียดเพิ่มเติม
                        </p>
                        <div className="w-full flex flex-col gap-2">
                          <div className="grid grid-cols-2 w-full gap-4">
                            <div>
                              <p className="text-slate-800 font-bold p-0 m-0">
                                รหัสเพลง:
                              </p>
                              <p className="pt-2 pb-0 m-0 text-slate-500">
                                {record.songcode}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-800 font-bold p-0 m-0">
                                หมายเหตุ:
                              </p>
                              <p className="pt-2 pb-0 m-0 text-slate-500">
                                {record.note}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-800 font-bold p-0 m-0">
                                จัดการ:
                              </p>
                              <Space size="middle">
                                <EditButton
                                  onClickFn={() => handleEdit(record.id)}
                                />
                                <DeleteButton
                                  onClickFn={() =>
                                    handleOpenDeleteModal(record)
                                  }
                                />
                              </Space>
                            </div>
                          </div>
                        </div>
                      </div>
                    ),

                    expandIcon: ({ expanded, onExpand, record }) => (
                      <div
                        className="text-center"
                        onClick={(e) => {
                          onExpand(record, e);
                          toggleExpanded(record);
                          setExpanded(!expanded);
                        }}
                      >
                        <MdKeyboardArrowDown
                          size={22}
                          color={record.isnewsong ? "#10b981" : "#000000"}
                          className={`icon-rotate ${
                            expanded ? "rotate-up" : ""
                          }`}
                        />
                      </div>
                    ),
                  }
                : undefined
            }
            pagination={{
              onChange: onPaginationChange,
              total: FilteredData?.length,
              current: skip / size + 1,
              pageSize: size,
              simple: mobileScreen,
              pageSizeOptions: [
                "10",
                "20",
                "50",
                "100",
                String(FilteredData?.length),
              ],
              locale: { items_per_page: " / หน้า" },
              showTotal: (total, range) =>
                `แสดง ${range[0]}-${range[1]} จาก ${total} รายการ`,
            }}
          />
        </div>
      </div>
    </>
  );
}

function EditButton({ onClickFn }: { onClickFn: (id: any) => void }) {
  return (
    <Space wrap>
      <Tooltip title={"แก้ไขข้อมูล"} color={"#383A48"}>
        <div className="cursor-pointer" onClick={onClickFn}>
          <TbEditCircle size={28} color="#383A48" />
        </div>
      </Tooltip>
    </Space>
  );
}

function DeleteButton({ onClickFn }: { onClickFn: (id: any) => void }) {
  return (
    <Space wrap>
      <Tooltip title="ลบ" color="#F92728">
        <div className="cursor-pointer" onClick={onClickFn}>
          <RiDeleteBin5Line color="#F92728" size={28} />
        </div>
      </Tooltip>
    </Space>
  );
}
