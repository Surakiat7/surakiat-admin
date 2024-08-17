import { apiEndPoint } from "@/const/api";
import { axiosAuthen } from "@/utils/axios/axiosRefresh";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/const/api";
import axios from "axios";

export const VideoContentPublicFindAll = async (): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axiosAuthen.get(
      `${apiEndPoint}/api/v1/con/public?type=video`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching video content:", error);
    throw error.response?.data || error;
  }
};

export const BlogContentPublicFindAll = async (): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axiosAuthen.get(
      `${apiEndPoint}/api/v1/con/public?type=content`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching blog content:", error);
    throw error.response?.data || error;
  }
};

export const ListTagPublicFindAll = async (): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axiosAuthen.get(
      `${apiEndPoint}/api/v1/tag/available`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching blog content:", error);
    throw error.response?.data || error;
  }
};

export const VideoContentAdminFindAll = async (): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axiosAuthen.get(
      `${apiEndPoint}/api/v1/con?type=video`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching video content:", error);
    throw error.response?.data || error;
  }
};

export const BlogContentAdminFindAll = async (): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axiosAuthen.get(
      `${apiEndPoint}/api/v1/con?type=content`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching blog content:", error);
    throw error.response?.data || error;
  }
};

export const ContentAdminFindByID = async (
  contentId: string
): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axiosAuthen.get(
      `${apiEndPoint}/api/v1/con/${contentId}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching blog content:", error);
    throw error.response?.data || error;
  }
};

export const CreateContent = async (
  data: any
): Promise<AxiosResponse<ApiResponse>> => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response: AxiosResponse<ApiResponse> = await axiosAuthen.post(
      `${apiEndPoint}/api/v1/con`,
      data,
      { headers }
    );
    return response;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const UpdateContent = async (
  contentId: string,
  data: any
): Promise<AxiosResponse<ApiResponse>> => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response: AxiosResponse<ApiResponse> = await axiosAuthen.put(
      `${apiEndPoint}/api/v1/con/${contentId}`,
      data,
      { headers }
    );
    return response;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const SoftDeleteContent = async (
  contentId: any
): Promise<AxiosResponse<ApiResponse>> => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response: AxiosResponse<ApiResponse> = await axiosAuthen.delete(
      `${apiEndPoint}/api/v1/con/${contentId}`,
      { headers }
    );
    return response;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const ActiveContentByID = async (contentId: number) => {
  try {
    const response = await axiosAuthen.patch(
      `${apiEndPoint}/api/v1/con/${contentId}/toggle-publish`
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
      `${apiEndPoint}/api/v1/con/image/upload`,
      data,
      { headers }
    );
    return response;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};
