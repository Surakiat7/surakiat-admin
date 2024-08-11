import { apiEndPoint } from "@/const/api";
import { axiosAuthen } from "@/utils/axios/axiosRefresh";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/const/api";
import axios from "axios";

export const UserFindAll = async (): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axiosAuthen.get(
      `${apiEndPoint}/api/v1/admin/findall`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching video content:", error);
    throw error.response?.data || error;
  }
};

export const UserFindByID = async (
  UserId: string
): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axiosAuthen.get(
      `${apiEndPoint}/api/v1/admin/findone/${UserId}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching blog content:", error);
    throw error.response?.data || error;
  }
};

export const CreateUser = async (
  data: any
): Promise<AxiosResponse<ApiResponse>> => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response: AxiosResponse<ApiResponse> = await axiosAuthen.post(
      `${apiEndPoint}/api/v1/admin/create`,
      data,
      { headers }
    );
    return response;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw {
        statusCode: 500,
        messageEn: "An unknown error occurred",
        messageTh: "เกิดข้อผิดพลาดที่ไม่รู้จัก",
      };
    }
  }
};

export const UpdateUser = async (
  UserId: string,
  data: any
): Promise<AxiosResponse<ApiResponse>> => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response: AxiosResponse<ApiResponse> = await axiosAuthen.patch(
      `${apiEndPoint}/api/v1/admin/update/${UserId}`,
      data,
      { headers }
    );
    return response;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const DeleteUser = async (
  UserId: any
): Promise<AxiosResponse<ApiResponse>> => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response: AxiosResponse<ApiResponse> = await axiosAuthen.delete(
      `${apiEndPoint}/api/v1/admin/remove/${UserId}`,
      { headers }
    );
    return response;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const ActiveUserByID = async (UserId: number) => {
  try {
    const response = await axiosAuthen.patch(
      `${apiEndPoint}/api/v1/content/${UserId}/toggle-publish`
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
