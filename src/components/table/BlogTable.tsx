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
import {
  BlogContentAdminFindAll,
  ActiveContentByID,
  SoftDeleteContent,
} from "@/apis/managecontent";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { TbEditCircle } from "react-icons/tb";
import { RiDeleteBin5Line } from "react-icons/ri";
import { SwalCenter } from "@/utils/sweetAlertCenter";
import DeleteModal from "../Modal/DeleteContent";
import { IoSearch } from "react-icons/io5";
import { MdKeyboardArrowDown } from "react-icons/md";

type Props = {};

export default function BlogsTable({}: Props) {
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
      FindAllBlogsData();
    } else {
      handleSearch(searchValue);
    }
  }, [searchValue]);

  const handleSearch = async (value: string) => {
    try {
      setLoading(true);
      await FindAllBlogsData();
      setFilteredData((currentData) => {
        return currentData.filter(
          (blog: {
            title: string | string[];
            description: string | string[];
            tags: string | string[];
          }) =>
            (typeof blog.title === "string" && blog.title.includes(value)) ||
            (typeof blog.description === "string" &&
              blog.description.includes(value)) ||
            (Array.isArray(blog.tags) &&
              blog.tags.some(
                (tag) => typeof tag === "string" && tag.includes(value)
              ))
        );
      });
    } catch (error) {
      console.error("Error searching:", error);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: any) => {
    navigation.BlogEdit(id);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      align: "center" as const,
      render: (text: string, record: any, index: number) => index + 1,
    },
    {
      title: "Cover Image",
      dataIndex: "images",
      key: "images",
      align: "center" as const,
      render: (images: any[]) => {
        const coverImage = images.find((img) => img.isCover === true);
        return coverImage ? (
          <Image
            src={coverImage.url}
            alt="Cover Image"
            style={{ width: "100%", height: "auto", objectFit: "cover" }}
            className="!w-16 !h-16 rounded-lg"
          />
        ) : (
          <Image
            className="!w-16 !h-16 aspect-square object-cover rounded-lg bg-gray-200"
            fallback="data:image/png;base64,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"
          />
        );
      },
    },
    {
      title: (
        <span className="text-center flex justify-center">Title Blog</span>
      ),
      dataIndex: "title",
      key: "title",
      align: "left" as const,
      render: (title: string) => (
        <span className="whitespace-nowrap">{title}</span>
      ),
    },
    {
      title: (
        <span className="text-center flex justify-center">Description</span>
      ),
      dataIndex: "description",
      key: "description",
      align: "left" as const,
      render: (description: string) => (
        <Tooltip title={description}>
          <span
            className="whitespace-nowrap overflow-hidden text-ellipsis"
            style={{ maxWidth: "200px", display: "inline-block" }}
          >
            {description.length > 20
              ? `${description.slice(0, 20)}...`
              : description}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      align: "center" as const,
      render: (tags: { name: string }[]) => (
        <div className="flex flex-col justify-center items-center gap-2">
          {tags && tags.length > 0 ? (
            tags.map((tag, index) => (
              <p
                key={index}
                className="p-2 m-0 text-xs mx-auto whitespace-nowrap w-fit bg-amber-100 rounded-md text-amber-700"
              >
                {tag.name}
              </p>
            ))
          ) : (
            <p className="p-2 m-0 text-red-400 mx-auto whitespace-nowrap w-fit">
              ยังไม่ได้เพิ่มแท็ก
            </p>
          )}
        </div>
      ),
    },
    {
      title: "Status Publish",
      key: "isPublish",
      filters: [
        {
          text: "Publish",
          value: "true",
        },
        {
          text: "Disable",
          value: "false",
        },
      ],
      onFilter: (value: any, record: any) => {
        const isChecked = switchStatus[record.id] ?? record.isPublish;
        return (
          (value === "true" && isChecked) || (value === "false" && !isChecked)
        );
      },
      render: (text: any, record: any) => {
        const isChecked = switchStatus[record.id] ?? record.isPublish;
        const tooltipTitle = isChecked
          ? "Disable"
          : "Publish";
        const tooltipColor = isChecked ? customColors[0] : customColors[1];

        return (
          <Space size="middle">
            <Tooltip title={tooltipTitle} color={tooltipColor}>
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                checked={switchStatus[record.id] ?? record.isPublish}
                onChange={async (checked) => {
                  setSwitchStatus((prevState) => ({
                    ...prevState,
                    [record.id]: checked,
                  }));
                  await ToggleActiveContent(record.id, checked);
                }}
              />
            </Tooltip>
          </Space>
        );
      },
      align: "center" as const,
      showLoading: false,
    },
    {
      title: "Manage",
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

  const MobileColumns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      align: "center" as const,
      render: (text: string, record: any, index: number) => index + 1,
    },
    {
      title: (
        <span className="text-center flex justify-center">Title Blog</span>
      ),
      dataIndex: "title",
      key: "title",
      align: "left" as const,
      render: (title: string) => (
        <Tooltip title={title}>
          <span
            className="whitespace-nowrap overflow-hidden text-ellipsis"
            style={{ maxWidth: "200px", display: "inline-block" }}
          >
            {title.length > 18 ? `${title.slice(0, 18)}...` : title}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Manage",
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

  const FindAllBlogsData = async () => {
    setLoading(true);
    try {
      const response = await BlogContentAdminFindAll();
      console.log("response data", response);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FindAllBlogsData();
  }, []);

  const ToggleActiveContent = async (contentId: number, newStatus: boolean) => {
    setLoading(true);
    try {
      // const response = await ActiveContentByID(contentId);
      // console.log("response toggle data", response);

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
      // await SoftDeleteContent(deleteItemId);
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
          className={`flex w-full items-center sm:items-center justify-between sm:pt-4 sm:gap-2 gap-4`}
        >
          <Input
            placeholder="Search blogs"
            suffix={<IoSearch style={{ color: "rgba(0,0,0,.45)" }} />}
            onChange={(e) => onSearchChange(e.target.value)}
            className="!h-min p-2 w-[200px] sm:w-fit rounded-lg flex gap-2 items-center"
          />
          <Button
            type="primary"
            className="!h-min p-2 rounded-lg flex items-center"
            onClick={() => navigation.BlogCreate()}
          >
            + Create Blog
          </Button>
        </div>
        <div className="bg-white rounded-lg">
          {/* ตาราง */}
          <Table
            columns={mobileScreen ? MobileColumns : columns}
            // loading={loading}
            dataSource={FilteredData}
            rowKey={"id"}
            locale={{ emptyText: "Data not found" }}
            expandable={
              mobileScreen
                ? {
                    expandedRowRender: (record) => {
                      const isChecked =
                        switchStatus[record.id] ?? record.isPublish;
                      const tooltipTitle = isChecked
                        ? "Disable"
                        : "Publish";
                      const tooltipColor = isChecked
                        ? customColors[0]
                        : customColors[1];

                      return (
                        <div className="w-full flex flex-col">
                          <p className="text-lg text-[#eab308] font-semibold mb-2">
                            รายละเอียดเพิ่มเติม
                          </p>
                          <div className="w-full flex flex-col gap-4">
                            <div className="w-full flex flex-col">
                              <p className="text-slate-800 font-bold p-0 m-0">
                                ชื่อบทความ:
                              </p>
                              <p className="pt-2 pb-0 m-0 text-slate-500">
                                {record.title}
                              </p>
                            </div>
                            <div className="w-full flex flex-col">
                              <p className="text-slate-800 font-bold p-0 m-0">
                                รายละเอียด:
                              </p>
                              <p className="pt-2 pb-0 m-0 text-slate-500">
                                {record.description}
                              </p>
                            </div>
                            <div className="flex w-full gap-4">
                              <div className="w-1/2">
                                <p className="text-slate-800 font-bold p-0 m-0">
                                  สถานะการเผยแพร่:
                                </p>
                                <div className="pt-2 pb-0 m-0 flex items-center gap-2">
                                  <span className="text-slate-500">
                                    {isChecked
                                      ? "เผยแพร่แล้ว"
                                      : "ยังไม่เผยแพร่"}
                                  </span>
                                  <Tooltip
                                    title={tooltipTitle}
                                    color={tooltipColor}
                                  >
                                    <Switch
                                      checkedChildren={<CheckOutlined />}
                                      unCheckedChildren={<CloseOutlined />}
                                      checked={isChecked}
                                      onChange={async (checked) => {
                                        setSwitchStatus((prevState) => ({
                                          ...prevState,
                                          [record.id]: checked,
                                        }));
                                        await ToggleActiveContent(
                                          record.id,
                                          checked
                                        );
                                      }}
                                    />
                                  </Tooltip>
                                </div>
                              </div>
                              <div className="w-1/2">
                                <p className="text-slate-800 font-bold p-0 m-0">
                                  วันที่เผยแพร่:
                                </p>
                                <p className="pt-2 pb-0 m-0 text-slate-500">
                                  {new Date(record.publishedAt).toLocaleString(
                                    "th-TH",
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="w-full">
                              <p className="text-slate-800 font-bold p-0 m-0 mb-2">
                                แท็ก:
                              </p>
                              <div className="flex gap-2">
                                {record.tags && record.tags.length > 0 ? (
                                  record.tags.map((tag: any, index: any) => (
                                    <p
                                      key={index}
                                      className="p-2 m-0 text-xs whitespace-nowrap w-fit bg-amber-100 rounded-md text-amber-700"
                                    >
                                      {tag.name}
                                    </p>
                                  ))
                                ) : (
                                  <p className="p-2 m-0 text-red-400 whitespace-nowrap w-fit">
                                    ยังไม่ได้เพิ่มแท็ก
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    },

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
                          color="#eab308"
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
              locale: { items_per_page: " / Page" },
              showTotal: (total, range) =>
                `Show ${range[0]}-${range[1]} From ${total} Items`,
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
      <Tooltip title={"แก้ไขข้อมูล"} color={"#eab308"}>
        <div className="cursor-pointer" onClick={onClickFn}>
          <TbEditCircle size={28} color="#eab308" />
        </div>
      </Tooltip>
    </Space>
  );
}

function DeleteButton({ onClickFn }: { onClickFn: (id: any) => void }) {
  return (
    <Space wrap>
      <Tooltip title="ลบ" color="#EE6A4A">
        <div className="cursor-pointer" onClick={onClickFn}>
          <RiDeleteBin5Line color="#EE6A4A" size={28} />
        </div>
      </Tooltip>
    </Space>
  );
}
