import { apiEndPoint } from "@/const/api";
import { axiosAuthen } from "@/utils/axios/axiosRefresh";
import axios, { AxiosResponse } from "axios";
import { ApiResponse } from "@/const/api";

export const OverviewFindAll = async (): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axiosAuthen.get(
      `${apiEndPoint}/api/v1/setting/public`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching:", error);
    throw error.response?.data || error;
  }
};
