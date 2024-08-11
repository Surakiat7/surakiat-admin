"use client";

import {
  Table,
  Space,
  PaginationProps,
  Tooltip,
  Button,
  Modal,
  Form,
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
import {
  CategoryFindAll,
  CreateCategory,
  UpdateCategory,
  DeleteCategory,
} from "@/apis/managecategory";
import Loading from "../loading";
import CategoryForm from "../Form/CategoryForm";

type Props = {};

export default function CategoryTable({}: Props) {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const { mobileScreen } = useAuth();
  const [searchValue, setSearchValue] = useState<string>("");
  const [skip, setSkip] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [FilteredData, setFilteredData] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newrecordlabelName, setNewrecordlabelName] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const handleOpenEditModal = (record: any) => {
    setEditingCategory({ id: record.id, name: record.name });
    setIsEditModalVisible(true);
    editForm.setFieldsValue({ name: record.name });
  };

  const handleCancelEditModal = () => {
    setIsEditModalVisible(false);
    setEditingCategory(null);
    editForm.resetFields();
  };

  const handleEditFormChange = (changedValues: any, allValues: any) => {
    setEditingCategory((prev: any) => ({ ...prev, ...changedValues }));
  };

  const handleCreateFormChange = (changedValues: any, allValues: any) => {
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewrecordlabelName(e.target.value);
  };

  const handleOpenModal = () => {
    setIsModalVisible(true);
    addForm.resetFields();
  };

  const handleCancelModal = () => {
    setNewrecordlabelName("");
    setIsModalVisible(false);
    addForm.resetFields();
  };

  const handleOkEditModal = async () => {
    try {
      const values = await editForm.validateFields();
      if (editingCategory) {
        const body = { name: values.name };
        const response = await UpdateCategory(editingCategory.id, body);
        console.log("Response:", response);

        SwalCenter(response.data.messageTh, "success", undefined);
        FindAllCategoryData();
      }
    } catch (error: any) {
      SwalCenter(
        error?.response?.data?.messageTh || "An error occurred",
        "error",
        undefined,
        undefined
      );
      console.error("Error:", error);
    } finally {
      setIsEditModalVisible(false);
      setEditingCategory(null);
      editForm.resetFields();
    }
  };

  const handleOkModal = async () => {
    if (newrecordlabelName.trim()) {
      try {
        const body = { name: newrecordlabelName };
        const response = await CreateCategory(body);
        console.log("Response:", response);

        SwalCenter(response.data.messageTh, "success", undefined);
        FindAllCategoryData();
      } catch (error: any) {
        SwalCenter(
          error?.messageTh || "An error occurred",
          "error",
          undefined,
          undefined
        );
        console.error("Error:", error);
      } finally {
        setIsModalVisible(false);
        setNewrecordlabelName("");
      }
    } else {
      SwalCenter(
        "กรุณากรอกชื่อหมวดหมู่ค่ายเพลง",
        "warning",
        undefined,
        undefined
      );
    }
  };

  const onSearchChange = (value: string) => {
    setSearchValue(value);
  };

  useEffect(() => {
    if (searchValue.trim() === "") {
      FindAllCategoryData();
    } else {
      handleSearch(searchValue);
    }
  }, [searchValue]);

  const handleSearch = async (value: string) => {
    try {
      setLoading(true);
      await CategoryFindAll();
      const searchValue = value.toLowerCase();

      setFilteredData((currentData) => {
        return currentData.filter((category: { name: string | string[] }) => {
          if (typeof category.name === "string") {
            return category.name.toLowerCase().includes(searchValue);
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

  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "index",
      key: "index",
      align: "center" as const,
      render: (text: string, record: any, index: number) => {
        const globalIndex = Math.floor(skip / size) * size + index + 1;
        return (
          <span>
            {globalIndex}
          </span>
        );
      },
    },
    {
      title: "ชื่อหมวดหมู่ค่ายเพลง",
      dataIndex: "name",
      key: "name",
      align: "center" as const,
    },
    {
      title: <span className="text-center flex justify-center">จำนวนเพลง</span>,
      dataIndex: "totalsong",
      key: "totalsong",
      align: "center" as const,
      render: (text: string | number | undefined) =>
        text !== undefined && text !== null ? text : "-",
    },
    {
      title: "จัดการ",
      key: "action",
      align: "center" as const,
      render: (text: any, record: any) => (
        <Space size="middle">
          <EditButton record={record} />
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

  const FindAllCategoryData = async () => {
    setLoading(true);
    try {
      const response = await CategoryFindAll();
      console.log("response data", response);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FindAllCategoryData();
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
      await DeleteCategory(deleteItemId);
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

  const EditButton = ({ record }: { record: any }) => (
    <Space wrap>
      <Tooltip title={"แก้ไขข้อมูล"} color={"#383A48"}>
        <div
          className="cursor-pointer"
          onClick={() => handleOpenEditModal(record)}
        >
          <TbEditCircle size={28} color="#383A48" />
        </div>
      </Tooltip>
    </Space>
  );

  return (
    <>
      <DeleteModal
        visible={deleteModalVisible}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
      <Modal
        title="แก้ไขหมวดหมู่ค่ายเพลง"
        visible={isEditModalVisible}
        onOk={handleOkEditModal}
        centered
        onCancel={handleCancelEditModal}
        okText="บันทึก"
        cancelText="ยกเลิก"
      >
        <CategoryForm
          form={editForm}
          initialValues={editingCategory || { name: "" }}
          onValuesChange={handleEditFormChange}
        />
      </Modal>
      <Modal
        title="เพิ่มหมวดหมู่ค่ายเพลงใหม่"
        visible={isModalVisible}
        onOk={handleOkModal}
        centered
        onCancel={handleCancelModal}
        okText="เพิ่ม"
        cancelText="ยกเลิก"
      >
        <CategoryForm
          form={addForm}
          initialValues={{ name: newrecordlabelName }}
          value={newrecordlabelName}
          onValuesChange={handleCreateFormChange}
          onChange={handleInputChange}
        />
      </Modal>
      <div className="flex flex-col justify-center gap-4 w-full">
        {loading ? (
          <Loading />
        ) : (
          <>
            <div
              className={`flex sm:flex-col w-full items-center justify-between sm:items-start sm:justify-between sm:gap-2 gap-4`}
            >
              <Input
                placeholder="ค้นหาหมวดหมู่ค่ายเพลงในระบบ"
                suffix={<IoSearch style={{ color: "rgba(0,0,0,.45)" }} />}
                onChange={(e) => onSearchChange(e.target.value)}
                className="!h-min p-2 w-1/4 sm:w-full rounded-lg flex gap-2 items-center"
              />
              <div className="flex gap-4 items-center">
                <Button
                  type="primary"
                  className="!h-min p-2 rounded-lg flex text-white items-center"
                  onClick={handleOpenModal}
                >
                  + เพิ่มหมวดหมู่ค่ายเพลงในระบบ
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
          </>
        )}
      </div>
    </>
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
