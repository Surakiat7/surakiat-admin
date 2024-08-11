import { apiEndPoint } from "@/const/api";
import { axiosAuthen } from "@/utils/axios/axiosRefresh";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/const/api";
import axios from "axios";

export const CategoryFindAll = async (): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axiosAuthen.get(
      `${apiEndPoint}/api/v1/recordlabel/findall`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching blog content:", error);
    throw error.response?.data || error;
  }
};

export const CreateCategory = async (
  data: any
): Promise<AxiosResponse<ApiResponse>> => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response: AxiosResponse<ApiResponse> = await axiosAuthen.post(
      `${apiEndPoint}/api/v1/recordlabel/create`,
      data,
      { headers }
    );
    return response;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const UpdateCategory = async (
  CategoryId: string,
  data: any
): Promise<AxiosResponse<ApiResponse>> => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response: AxiosResponse<ApiResponse> = await axiosAuthen.patch(
      `${apiEndPoint}/api/v1/recordlabel/update/${CategoryId}`,
      data,
      { headers }
    );
    return response;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const DeleteCategory = async (
  CategoryId: any
): Promise<AxiosResponse<ApiResponse>> => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response: AxiosResponse<ApiResponse> = await axiosAuthen.delete(
      `${apiEndPoint}/api/v1/recordlabel/remove/${CategoryId}`,
      { headers }
    );
    return response;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const ActiveCategoryByID = async (CategoryId: number) => {
  try {
    const response = await axiosAuthen.patch(
      `${apiEndPoint}/api/v1/content/${CategoryId}/toggle-publish`
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const UploadImages = async (
  data: FormData
): Promise<AxiosResponse<ApiResponse>> => {
  const headers = {
    "Content-Type": "multipart/form-data",
  };

  try {
    const response: AxiosResponse<ApiResponse> = await axiosAuthen.post(
      `${apiEndPoint}/api/v1/content/image/upload`,
      data,
      { headers }
    );
    return response;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};
