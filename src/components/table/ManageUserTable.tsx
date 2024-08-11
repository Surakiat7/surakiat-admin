"use client";

import {
  Table,
  Space,
  PaginationProps,
  Tooltip,
  Image,
  Button,
  Switch,
  Input,
} from "antd";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/authContext";
import { useNavigate } from "@/utils/navigation";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { TbEditCircle } from "react-icons/tb";
import { RiDeleteBin5Line } from "react-icons/ri";
import { SwalCenter } from "@/utils/sweetAlertCenter";
import DeleteModal from "../Modal/DeleteContent";
import { IoSearch } from "react-icons/io5";
import { MdKeyboardArrowDown } from "react-icons/md";
import { ActiveUserByID, DeleteUser, UserFindAll } from "@/apis/manageuser";

type Props = {};

export default function UsersTable({}: Props) {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const { mobileScreen } = useAuth();
  const [searchValue, setSearchValue] = useState<string>("");
  const [expanded, setExpanded] = useState(false);
  const [expandedRecord, setExpandedRecord] = useState<any | null>(null);
  const [skip, setSkip] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [FilteredData, setFilteredData] = useState<any[]>([]);
  const customColors = ["#9ca3af", "#eab308"];
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

  const onSearchChange = (value: string) => {
    setSearchValue(value);
  };

  useEffect(() => {
    if (searchValue.trim() === "") {
      FindAllUserData();
    } else {
      handleSearch(searchValue);
    }
  }, [searchValue]);

  const handleSearch = async (value: string) => {
    try {
      setLoading(true);
      await UserFindAll();
      const searchValue = value.toLowerCase();
      setFilteredData((currentData) => {
        return currentData.filter((user: { fullname: string | string[] }) => {
          if (typeof user.fullname === "string") {
            return user.fullname.toLowerCase().includes(searchValue);
          }
          return false;
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
    navigation.ManageUserEdit(id);
  };

  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "index",
      key: "index",
      align: "center" as const,
      render: (text: string, record: any, index: number) => {
        const globalIndex = Math.floor(skip / size) * size + index + 1;
        return <span>{globalIndex}</span>;
      },
    },
    {
      title: "ชื่อ-นามสกุล",
      dataIndex: "fullname",
      key: "fullname",
      align: "center" as const,
    },
    {
      title: "ระดับการใช้งาน",
      dataIndex: "admin_permission",
      key: "admin_permission",
      align: "center" as const,
    },
    {
      title: "สถานะบัญชี",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
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

  const onPaginationChange: PaginationProps["onChange"] = (
    page: number,
    pageSize: number
  ) => {
    const newSkip = (page - 1) * pageSize;
    setSkip(newSkip);
    setSize(pageSize);
  };

  const FindAllUserData = async () => {
    setLoading(true);
    try {
      const response = await UserFindAll();
      console.log("response data", response);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FindAllUserData();
  }, []);

  const ToggleActiveUser = async (contentId: number, newStatus: boolean) => {
    setLoading(true);
    try {
      const response = await ActiveUserByID(contentId);
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
      await DeleteUser(deleteItemId);
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
          className={`flex sm:flex-col w-full items-center justify-between sm:items-start sm:justify-between sm:pt-4 sm:gap-2 gap-4`}
        >
          <Input
            placeholder="ค้นหาบัญชีผู้ใช้งาน"
            suffix={<IoSearch style={{ color: "rgba(0,0,0,.45)" }} />}
            onChange={(e) => onSearchChange(e.target.value)}
            className="!h-min p-2 w-[200px] sm:w-full rounded-lg flex gap-2 items-center"
          />
          <div className="flex gap-4 items-center">
            <Button
              type="primary"
              className="!h-min p-2 rounded-lg flex text-white items-center"
              onClick={() => navigation.ManageUserCreate()}
            >
              + เพิ่มบัญชีผู้ใช้งาน
            </Button>
          </div>
        </div>
        <div className="bg-white rounded-lg">
          {/* ตาราง */}
          <Table
            columns={columns}
            loading={loading}
            dataSource={FilteredData}
            rowKey={"id"}
            locale={{ emptyText: "ไม่พบข้อมูล" }}
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
