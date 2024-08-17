'use client';

import React, { useState, useEffect } from 'react';
import {
  message,
  Input,
  Button,
  Upload,
  UploadFile,
  Image,
  Space,
  Radio,
  Select,
  UploadProps,
} from 'antd';
import { SwalCenter } from '@/utils/sweetAlertCenter';
import Loading from '@/components/loading';
import { useNavigate } from '@/utils/navigation';
import {
  CreateContent,
  ListTagPublicFindAll,
  UploadImages,
} from '@/apis/managecontent';
import { LuUploadCloud } from 'react-icons/lu';
import { MdDateRange } from 'react-icons/md';
import { format } from 'date-fns';
import { CiSquarePlus } from 'react-icons/ci';

type Props = {};
const { Dragger } = Upload;

export default function CreateBlog({}: Props) {
  const navigation = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [Titlename, setTitleName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [tags, setTags] = useState<{ value: string; label: string }[]>([]);
  const [selectedTags, setSelectedTags] = useState<
    { value: string; label: string }[]
  >([]);
  const [newTag, setNewTag] = useState<string>('');
  const [allTags, setAllTags] = useState<{ value: string; label: string }[]>(
    []
  );
  const [videoUrl, setVideoUrl] = useState<string>('');
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
  const currentDate = format(new Date(), 'dd/MM/yyyy');

  const truncateTitle = (title: string, maxLength: number) => {
    if (title.length <= maxLength) return title;

    let truncated = title.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > 0) {
      truncated = truncated.slice(0, lastSpace);
    }
    return truncated + '.....';
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

  const customRequest: UploadProps['customRequest'] = ({
    file,
    onSuccess,
    onError,
  }) => {
    const formData = new FormData();
    formData.append('file', file as File);

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
    name: 'file',
    multiple: true,
    accept: 'image/*',
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
      if (latestFile.status === 'done') {
        message.success(`เพิ่ม ${latestFile.name} สำเร็จ`);
      } else if (latestFile.status === 'error') {
        message.error(`เพิ่ม ${latestFile.name} ไม่สำเร็จ`);
      } else if (latestFile.status === 'removed') {
        setUploadedImages((prevImages) =>
          prevImages.filter((img) => img.url !== latestFile.url)
        );
      }

      console.log('Current file list:', info.fileList);
      setFileList(info.fileList);
      console.log('fileList:', fileList);
    },
  };

  const handleRadioChange = (fileId: string) => {
    setUploadedImages((prevImages) =>
      prevImages.map((img) => ({
        ...img,
        isCover: img.id === fileId,
      }))
    );
  };

  const handleCancel = () => {
    navigation.Back();
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      console.log('uploadedImageUrls:', uploadedImages);
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
        language: 'en',
        publish: false,
        publishedAt: formattedDate,
        contentType: 'content',
        tags: tagNames,
        videoUrl,
        images: formattedImages,
      };

      console.log('body send api:', body);

      const response = await CreateContent(body);
      console.log('Response:', response);

      SwalCenter(response.data.messageTH, 'success', undefined, () =>
        navigation.Blog()
      );
    } catch (error: any) {
      SwalCenter(error.data.message_th, 'error', undefined, undefined);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddParagraph = () => {
    const newParagraph = { order: paragraphs.length + 1, description: '' };
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

  const handleTagChange = (value: any) => {
    setSelectedTags(value);
  };

  const FindAllTagsData = async () => {
    try {
      const response = await ListTagPublicFindAll();
      console.log('API response:', response);
      const data = response.data;
      console.log('Data ListTagPublicFindAll from API:', data);

      const formattedTags = data.map((tag: any) => ({
        value: tag.name,
        label: `${tag.name}`,
      }));

      setTags(formattedTags);
      setAllTags(formattedTags);
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    FindAllTagsData();
  }, []);

  const handleAddTag = () => {
    if (newTag.trim() !== '') {
      const newTagObj = { value: newTag, label: newTag };
      setAllTags([...allTags, newTagObj]);
      setSelectedTags([...selectedTags, newTagObj]);
      setNewTag('');
    }
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value);
  };

  const getCoverImageUrl = () => {
    const coverImage = uploadedImages.find((img) => img.isCover === true);
    return coverImage ? coverImage.url : '/img/notfound-images.png';
  };

  return (
    <main className="w-full flex flex-col">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex sm:flex-col w-full justify-between gap-8 sm:pt-4">
          <div className="flex flex-col w-full gap-4 justify-start">
            <div className="flex flex-col gap-2">
              <label className="text-white text-[14px] text-start font-semibold">
                Title Blog<span className="text-[#f43f5e]"> *</span>
              </label>
              <Input
                className="w-full"
                size="large"
                placeholder="Title Blog"
                value={Titlename}
                onChange={(event) => setTitleName(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-white text-[14px] text-start font-semibold">
                Description
              </label>
              <Input.TextArea
                className="w-full"
                size="large"
                placeholder="Description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-white text-[14px] text-start font-semibold">
                Tags
              </label>
              <div className="flex sm:flex-col sm:items-start gap-3">
                <Select
                  mode="multiple"
                  labelInValue
                  size="large"
                  style={{ width: '100%' }}
                  value={selectedTags}
                  onChange={handleTagChange}
                  placeholder="Please select tags"
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
                    placeholder="Add new tag"
                    value={newTag}
                    onChange={handleTagInputChange}
                  />
                  <Button
                    type="primary"
                    size="large"
                    className="sm:w-full w-min"
                    onClick={handleAddTag}
                    icon={<CiSquarePlus />}
                  >
                    Add +
                  </Button>
                </form>
              </div>
            </div>
            <div className="w-full flex flex-col gap-4">
              <label className="text-white text-[14px] text-start font-semibold">
                Paragraph
              </label>
              {paragraphs.map((paragraph, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <Input.TextArea
                    size="large"
                    className="w-full"
                    placeholder={`Paragraph ${paragraph.order}`}
                    value={paragraph.description}
                    onChange={(event) =>
                      handleParagraphChange(index, event.target.value)
                    }
                  />
                  <Button danger onClick={() => handleRemoveParagraph(index)}>
                    Delete
                  </Button>
                </div>
              ))}
              <div className="flex">
                <Button
                  size="large"
                  type="primary"
                  onClick={handleAddParagraph}
                >
                  Add Paragraph
                </Button>
              </div>
            </div>
            <div className="w-full">
              <div className="flex w-full flex-col">
                <label className="text-white text-[14px] text-start font-semibold pb-2">
                  Upload images blog{' '}
                  <span className="text-slate-200">
                    (Recommended image size: 1200 x 600 pixels)
                  </span>
                </label>
                <Dragger
                  {...props}
                  listType="picture"
                  className="w-full"
                  itemRender={(originNode, file, fileList) => (
                    <div className="flex justify-between w-full items-center">
                      <div className="w-1/4">
                        <Radio.Group
                          onChange={() => handleRadioChange(file.uid)}
                          value={
                            uploadedImages.find((img) => img.id === file.uid)
                              ?.isCover
                          }
                        >
                          <Space direction="vertical">
                            <Radio value={true}>Set as cover image</Radio>
                          </Space>
                        </Radio.Group>
                      </div>
                      <div className="w-3/4">{originNode}</div>
                    </div>
                  )}
                >
                  <div className="flex flex-col gap-2 items-center justify-center">
                    <LuUploadCloud size={55} color="#fff" />
                    <div className="flex flex-col">
                      <p className="text-slate-500 font-bold text-md">
                        Click to add an image file, or drag and drop an image
                        file here
                      </p>
                      <p className="text-slate-200 text-xs">
                        Only PNG, JPG, SVG, JPEG, AVIF, and WEBP files are
                        supported.
                      </p>
                    </div>
                  </div>
                </Dragger>
              </div>
            </div>
            <div className="w-full flex sm:hidden">
              <Space>
                <Button danger size="large" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  size="large"
                  type="primary"
                  onClick={handleSubmit}
                  disabled={!Titlename}
                >
                  Submit
                </Button>
              </Space>
            </div>
          </div>
          <div className="flex flex-col w-fullgap-8 justify-start">
            <div className="flex flex-col">
              <label className="text-white text-[24px] text-center font-bold">
                Preview of the news reading page on the website
              </label>
              <div className="z-10 w-full mt-4 flex justify-center items-center">
                <div className="z-10 w-full flex justify-center items-center">
                  <div className="bg-white shadow-xl flex w-full mx-44 sm:mx-0 flex-col justify-between h-full rounded-[24px]">
                    <div className="w-full rounded-t-[24px]">
                      <img
                        src={
                          uploadedImages.find((img) => img.isCover === true)
                            ?.url || '/img/notfound-images.png'
                        }
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
                        Title Blog:{truncateTitle(Titlename, 15)}
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
                          Readmore
                        </p>
                      </div>
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
                    {paragraph.description || ''}
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
