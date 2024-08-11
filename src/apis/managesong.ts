import { apiEndPoint } from "@/const/api";
import { axiosAuthen } from "@/utils/axios/axiosRefresh";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/const/api";
import axios from "axios";

export const ListSongFindAll = async (): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axiosAuthen.get(
      `${apiEndPoint}/api/v1/song/findall`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching video content:", error);
    throw error.response?.data || error;
  }
};

export const SongFindByID = async (SongId: string): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axiosAuthen.get(
      `${apiEndPoint}/api/v1/song/findone/${SongId}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching blog content:", error);
    throw error.response?.data || error;
  }
};

export const CreateSong = async (
  data: any
): Promise<AxiosResponse<ApiResponse>> => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response: AxiosResponse<ApiResponse> = await axiosAuthen.post(
      `${apiEndPoint}/api/v1/song/create`,
      data,
      { headers }
    );
    return response;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const UpdateSong = async (
  SongId: string,
  data: any
): Promise<AxiosResponse<ApiResponse>> => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response: AxiosResponse<ApiResponse> = await axiosAuthen.patch(
      `${apiEndPoint}/api/v1/song/update/${SongId}`,
      data,
      { headers }
    );
    return response;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const DeleteSong = async (
  SongId: any
): Promise<AxiosResponse<ApiResponse>> => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response: AxiosResponse<ApiResponse> = await axiosAuthen.delete(
      `${apiEndPoint}/api/v1/song/remove/${SongId}`,
      { headers }
    );
    return response;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const ActiveSongByID = async (SongId: number) => {
  try {
    const response = await axiosAuthen.patch(
      `${apiEndPoint}/api/v1/content/${SongId}/toggle-publish`
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const ImportFileXlxs = async (
  data: FormData
): Promise<AxiosResponse<ApiResponse>> => {
  const headers = {
    "Content-Type": "multipart/form-data",
  };

  try {
    const response: AxiosResponse<ApiResponse> = await axiosAuthen.post(
      `${apiEndPoint}/api/v1/song/file-import`,
      data,
      { headers }
    );
    console.log("ImportFileXlxs response:", response);
    return response;
  } catch (error: any) {
    console.error("ImportFileXlxs error:", error);
    throw error.response?.data || error;
  }
};
