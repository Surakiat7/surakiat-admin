"use client";

import React, { useState, useEffect } from "react";
import {
  message,
  Input,
  Button,
  Upload,
  UploadFile,
  Image,
  Radio,
  Select,
  Space,
  Divider,
  UploadProps,
} from "antd";
import { SwalCenter } from "@/utils/sweetAlertCenter";
import Loading from "@/components/loading";
import { useNavigate } from "@/utils/navigation";
import { useParams } from "next/navigation";
import {
  ContentAdminFindByID,
  CreateContent,
  ListTagPublicFindAll,
  UpdateContent,
  UploadImages,
} from "@/apis/managecontent";
import { LuUploadCloud } from "react-icons/lu";
import { MdDateRange } from "react-icons/md";
import { format } from "date-fns";
import { CiSquarePlus } from "react-icons/ci";

type Props = {};
const { Dragger } = Upload;

export default function ManageBlogParam({}: Props) {
  const navigation = useNavigate();
  const params = useParams();
  const id = params.id as string;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [Titlename, setTitleName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<{ value: string; label: string }[]>([]);
  const [selectedTags, setSelectedTags] = useState<
    { value: string; label: string }[]
  >([]);
  const [newTag, setNewTag] = useState<string>("");
  const [allTags, setAllTags] = useState<{ value: string; label: string }[]>(
    []
  );
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [paragraphs, setParagraphs] = useState<
    { order: number; description: string }[]
  >([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadedImages, setUploadedImages] = useState<
    {
      id: string;
      url: string;
      order: number;
      isCover: boolean;
    }[]
  >([]);
  const currentDate = format(new Date(), "dd/MM/yyyy");
  const [contentDataByID, setContentDataByID] = useState<any>(null);

  const truncateTitle = (title: string, maxLength: number) => {
    if (title.length <= maxLength) return title;

    let truncated = title.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");
    if (lastSpace > 0) {
      truncated = truncated.slice(0, lastSpace);
    }
    return truncated + ".....";
  };

  const handleRemoveFile = (file: UploadFile) => {
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);

    setUploadedImages((prevImages) => {
      const removedImage = prevImages.find((img) => img.url === file.url);
      const newImages = prevImages.filter((img) => img.url !== file.url);

      if (removedImage && removedImage.isCover && newImages.length > 0) {
        return newImages.map((img, index) => ({
          ...img,
          isCover: index === 0,
        }));
      }

      return newImages;
    });
  };

  useEffect(() => {
    const newFileList: any = uploadedImages.map((img: any) => ({
      name: img.name,
      order: img.order,
      url: img.url,
    }));
    setFileList(newFileList);

    if (
      uploadedImages.length > 0 &&
      !uploadedImages.some((img) => img.isCover)
    ) {
      setUploadedImages((prevImages) =>
        prevImages.map((img, index) => ({
          ...img,
          isCover: index === 0,
        }))
      );
    }
  }, [uploadedImages]);

  const customRequest: UploadProps["customRequest"] = ({
    file,
    onSuccess,
    onError,
  }) => {
    const formData = new FormData();
    formData.append("file", file as File);

    UploadImages(formData)
      .then((response: any) => {
        if (onSuccess) {
          onSuccess(response.data);
        }
        setUploadedImages((prevImages) => [
          ...prevImages,
          ...response.data.data,
        ]);
      })
      .catch((error) => {
        if (onError) {
          onError(error);
        }
      });
  };

  const props: UploadProps = {
    name: "file",
    multiple: true,
    accept: "image/*",
    showUploadList: true,
    fileList: fileList,
    onRemove: handleRemoveFile,
    customRequest: customRequest,
    onChange(info) {
      let newFileList = [...info.fileList];

      newFileList = newFileList.map((file) => {
        if (file.response && file.response.data) {
          const uploadedFile = file.response.data[0];
          file.url = uploadedFile.url;
          file.uid = uploadedFile.id;
        }
        return file;
      });

      setFileList(newFileList);

      const latestFile = info.file;
      if (latestFile.status === "done") {
        message.success(`เพิ่ม ${latestFile.name} สำเร็จ`);
      } else if (latestFile.status === "error") {
        message.error(`เพิ่ม ${latestFile.name} ไม่สำเร็จ`);
      } else if (latestFile.status === "removed") {
        setUploadedImages((prevImages) =>
          prevImages.filter((img) => img.url !== latestFile.url)
        );
      }

      console.log("Current file list:", info.fileList);
      setFileList(info.fileList);
      console.log("fileList:", fileList);
    },
  };

  const handleRadioChange = (fileUrl: any) => {
    setUploadedImages((prevImages) =>
      prevImages.map((img) => ({
        ...img,
        isCover: img.url === fileUrl,
      }))
    );
  };

  const handleCancel = () => {
    navigation.Back();
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      console.log("uploadedImageUrls:", uploadedImages);
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString();

      const formattedImages = uploadedImages.map((img, index) => ({
        url: img.url,
        order: index + 1,
        isCover: img.isCover,
      }));

      const tagNames = selectedTags.map((tag: { value: string }) => tag.value);

      const body = {
        title: Titlename,
        description,
        paragraphs,
        language: "en",
        publish: false,
        publishedAt: formattedDate,
        contentType: "content",
        tags: tagNames,
        videoUrl,
        images: formattedImages,
      };

      console.log("Body:", body);

      const response = await UpdateContent(id, body);
      console.log("Response:", response);

      SwalCenter(response.data.messageTH, "success", undefined, () =>
        navigation.ManageBlog()
      );
    } catch (error: any) {
      SwalCenter(error.data.message_th, "error", undefined, undefined);
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddParagraph = () => {
    const newParagraph = { order: paragraphs.length + 1, description: "" };
    setParagraphs([...paragraphs, newParagraph]);
  };

  const handleParagraphChange = (index: number, value: string) => {
    const updatedParagraphs = [...paragraphs];
    updatedParagraphs[index].description = value;
    setParagraphs(updatedParagraphs);
  };

  const handleRemoveParagraph = (index: number) => {
    const updatedParagraphs = paragraphs.filter((_, idx) => idx !== index);
    setParagraphs(updatedParagraphs);
  };

  const FindOneBlogDataById = async (id: string) => {
    try {
      const response = await ContentAdminFindByID(id);
      console.log("API response:", response);
      const data = response.data;
      console.log("Data from API:", data);

      if (data) {
        setTitleName(data.title || "");
        setDescription(data.description || "");
        setVideoUrl(
          data.video && data.video.length > 0 ? data.video[0].url : ""
        );
        setParagraphs(data.paragraphs || []);

        const formattedTags = data.tags.map((tag: any) => ({
          value: tag.name,
          label: tag.name,
        }));
        setSelectedTags(formattedTags);

        console.log("Images from API:", data.images);
        const mappedImages = data.images.map((img: any, index: number) => ({
          id: `image-${index}`,
          name: img.name,
          url: img.url,
          order: img.order,
          isCover: img.isCover,
        }));
        setUploadedImages(mappedImages);

        const newFileList = mappedImages.map((img: any) => ({
          uid: img.id,
          name: img.name,
          status: "done",
          url: img.url,
          isCover: img.isCover,
        }));
        setFileList(newFileList);
      } else {
        console.error("No data received from API");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    if (id) {
      FindOneBlogDataById(id);
    }
  }, [id]);

  const handleTagChange = (value: any) => {
    setSelectedTags(value);
  };

  const FindAllTagsData = async () => {
    try {
      const response = await ListTagPublicFindAll();
      console.log("API response:", response);
      const data = response.data;
      console.log("Data ListTagPublicFindAll from API:", data);

      const formattedTags = data.map((tag: any) => ({
        value: tag.name,
        label: `${tag.name}`,
      }));

      setTags(formattedTags);
      setAllTags(formattedTags);
    } catch (error) {
      console.error("Error fetching tags:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    FindAllTagsData();
  }, []);

  const getCoverImageUrl = () => {
    const coverImage = uploadedImages.find((img) => img.isCover === true);
    return coverImage ? coverImage.url : "/img/notfound-images.png";
  };

  const handleAddTag = () => {
    if (newTag.trim() !== "") {
      const newTagObj = { value: newTag, label: newTag };
      setAllTags([...allTags, newTagObj]);
      setSelectedTags([...selectedTags, newTagObj]);
      setNewTag("");
    }
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value);
  };

  return (
    <main className="w-full flex flex-col">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex sm:flex-col w-full justify-between gap-8">
          <div className="flex flex-col w-full gap-4 justify-start sm:pt-4">
            <div className="flex w-full flex-col gap-2">
              <label className="text-white text-[14px] text-start font-semibold">
                ชื่อหัวข้อข่าว<span className="text-[#f43f5e]"> *</span>
              </label>
              <Input
                className="w-full"
                size="large"
                placeholder="ชื่อหัวข้อข่าว"
                value={Titlename}
                onChange={(event) => setTitleName(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-white text-[14px] text-start font-semibold">
                รายละเอียด
              </label>
              <Input.TextArea
                className="w-full"
                size="large"
                placeholder="รายละเอียด"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-white text-[14px] text-start font-semibold">
                แท็ก
              </label>
              <div className="flex w-full sm:flex-col sm:items-start gap-3">
                <Select
                  mode="multiple"
                  labelInValue
                  size="large"
                  style={{ width: "100%" }}
                  value={selectedTags}
                  onChange={handleTagChange}
                  placeholder="กรุณาเลือกแท็ก"
                  options={allTags}
                />
                <form
                  onSubmit={handleAddTag}
                  className="flex sm:w-full items-center gap-2"
                >
                  <Input
                    type="text"
                    size="large"
                    className="w-min sm:w-full"
                    placeholder="เพิ่มแท็กใหม่"
                    value={newTag}
                    onChange={handleTagInputChange}
                  />
                  <Button
                    type="primary"
                    size="large"
                    className="sm:w-full w-min"
                    onClick={handleAddTag}
                    icon={<CiSquarePlus size={18} />}
                  >
                    เพิ่ม
                  </Button>
                </form>
              </div>
            </div>
            <div className="w-full flex flex-col gap-4">
              <label className="text-white text-[14px] text-start font-semibold">
                ย่อหน้า
              </label>
              {paragraphs.map((paragraph, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <Input.TextArea
                    size="large"
                    className="w-full"
                    placeholder={`รายละเอียดย่อหน้าที่ ${paragraph.order}`}
                    value={paragraph.description}
                    onChange={(event) =>
                      handleParagraphChange(index, event.target.value)
                    }
                  />
                  <Button onClick={() => handleRemoveParagraph(index)}>
                    ลบ
                  </Button>
                </div>
              ))}
              <div className="flex">
                <Button type="primary" onClick={handleAddParagraph}>
                  เพิ่มย่อหน้า
                </Button>
              </div>
            </div>
            <div className="w-full flex">
              <div className="flex w-full flex-col">
                <label className="text-white text-[14px] text-start font-semibold pb-2">
                  อัปโหลดไฟล์รูปภาพบทความ{" "}
                  <span className="text-slate-400">
                    (ขนาดรูปภาพแนะนำ 400 x 200 พิกเซล อัปโหลดได้มากกว่า 1 รูป)
                  </span>
                </label>
                <Dragger
                  {...props}
                  listType="picture"
                  className="w-full"
                  fileList={fileList}
                  itemRender={(originNode, file, fileList) => {
                    const uploadedImage = uploadedImages.find(
                      (img) => img.url === file.url
                    );
                    return (
                      <div className="flex justify-between w-full items-center">
                        <div className="w-1/4">
                          <Radio.Group
                            onChange={() => handleRadioChange(file.url)}
                            value={uploadedImage?.isCover || false}
                          >
                            <Space direction="vertical">
                              <Radio value={true}>ตั้งเป็นภาพปก</Radio>
                            </Space>
                          </Radio.Group>
                        </div>
                        <div className="w-3/4">{originNode}</div>
                      </div>
                    );
                  }}
                >
                  <div className="flex justify-center">
                    <LuUploadCloud size={55} />
                  </div>
                  <p className="ant-upload-text">
                    คลิกเพิ่มไฟล์รูปภาพ หรือลากแล้ววางไฟล์รูปภาพ
                  </p>
                  <p className="ant-upload-hint">
                    รองรับไฟล์ประเภท PNG, JPG, SVG, JPEG, AVIF และ WWBP
                    เท่านั้น.
                  </p>
                </Dragger>
              </div>
            </div>
            <div className="w-full flex sm:hidden">
              <Space>
                <Button size="large" onClick={handleCancel}>
                  ยกเลิก
                </Button>
                <Button
                  size="large"
                  type="primary"
                  onClick={handleSubmit}
                  disabled={!Titlename}
                >
                  ยืนยัน
                </Button>
              </Space>
            </div>
          </div>
          <div className="flex gap-8 flex-col w-full justify-start sm:w-full bg-white">
            <div className="flex flex-col w-full gap-2">
              <label className="text-white text-[20px] sm:text-[16px] text-center font-bold">
                ตัวอย่าง Preview การ์ดหน้าแรกของข่าวบนเว็บไซต์
              </label>
              <div className="w-full flex justify-center items-center">
                <div className="bg-white shadow-xl flex w-full mx-44 sm:mx-0 flex-col justify-between h-full rounded-[24px]">
                  <div className="w-full flex rounded-t-[24px]">
                    <img
                      src={getCoverImageUrl()}
                      alt="blog-Image"
                      width="100%"
                      className="object-cover w-full h-[150px] rounded-t-[24px]"
                      loading="lazy"
                    />
                  </div>
                  <div className="px-6 py-4">
                    <h1
                      className={`font-bold text-[18px] p-0 m-0 text-md text-gray-900`}
                    >
                      ชื่อปกข่าว:{truncateTitle(Titlename, 15)}
                    </h1>
                  </div>
                  <div className="px-6 pb-8">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-1 items-center">
                        <MdDateRange size={26} color="#1F2937" />
                        <p className={`font-bold text-gray-800 text-xs`}>
                          {currentDate}
                        </p>
                      </div>
                      <p className="text-gray-800 hover:text-yellow-600">
                        อ่านต่อ
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full gap-2">
              <label className="text-white text-[20px] sm:text-[16px] text-center font-bold">
                ตัวอย่าง Preview ของหน้าอ่านข่าวบนเว็บไซต์
              </label>
              <h1 className={`font-medium text-[16px] text-white p-0 m-0`}>
                {Titlename}
              </h1>
              <div className="flex flex-col gap-4">
                <div className="w-full flex rounded-t-[24px]">
                  <img
                    src={getCoverImageUrl()}
                    alt="img blog"
                    className="w-full h-[310px] object-cover rounded-xl"
                    loading="lazy"
                  />
                </div>
                <div className="grid w-fit grid-cols-4 sm:grid-cols-2 gap-4 sm:gap-2">
                  {uploadedImages.map((url, index) => (
                    <img
                      key={index}
                      src={url.url}
                      alt={`img blog ${index + 1}`}
                      className="w-full h-[80px] object-cover rounded-xl"
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>
              <div className="flex w-fit flex-col gap-2 pt-4 sm:pt-2">
                {paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-md p-0 m-0 text-gray-700">
                    {paragraph.description || ""}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full sm:flex hidden">
            <Space>
              <Button size="large" onClick={handleCancel}>
                ยกเลิก
              </Button>
              <Button
                size="large"
                type="primary"
                onClick={handleSubmit}
                disabled={!Titlename}
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
