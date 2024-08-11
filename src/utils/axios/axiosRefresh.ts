import axios from "axios";
import { getAccessToken } from "../token";
import { AuthenApi } from "@/apis/authen";
import { apiEndPoint } from "@/const/api";

const axiosHeader = {
  baseURL: apiEndPoint,
  timeOut: 120000,
};

const instance = axios.create(axiosHeader);

instance.interceptors.request.use(async (config) => {
  const accessToken = await getAccessToken();
  if (config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

instance.interceptors.response.use(
  async (response) => response,
  async (error) => {
    const errorResponse = error?.response;
    if (errorResponse.status === 401 || errorResponse.status === 403) {
      try {
        const newAccessToken = await AuthenApi.refreshToken();
        errorResponse.config.headers.Authorization = `Bearer ${newAccessToken}`;
        errorResponse.config.__isRetryRequest = true;
        return await axios(errorResponse.config);
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export { instance as axiosAuthen };
