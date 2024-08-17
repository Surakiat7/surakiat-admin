import { apiEndPoint, ApiResponse } from '@/const/api'
import { axiosAuthen } from '@/utils/axios/axiosRefresh'
import { getRefreshToken, setAccessToken } from '@/utils/token'
import axios, { AxiosResponse } from 'axios'

type RefreshTokenResponse = {
   accessToken: string
}

export const AuthenApi = {
   login: async (email: string, password: string): Promise<AxiosResponse<ApiResponse>> => {
      const body = {
         email,
         password
      }

      try {
         const response = await axios.post(`${apiEndPoint}/api/v1/auth/email/login`, body)
         return response
      } catch (error: any) {
         throw error.response
      }
   },

   getUser: async (): Promise<AxiosResponse<ApiResponse>> => {
      try {
         const response = await axiosAuthen.get(`${apiEndPoint}/api/v1/auth/profile`)
         return response
      } catch (error: any) {
         throw error.response
      }
   },

   refreshToken: async (): Promise<RefreshTokenResponse> => {
      const refreshToken = await getRefreshToken()
      try {
         const response = await axios.post(`${apiEndPoint}/api/v1/auth/refresh`, { refreshToken })
         const accessToken = response.data.data.accessToken
         await setAccessToken(accessToken)
         return accessToken
      } catch (error: any) {
         throw error.response
      }
   },
}
