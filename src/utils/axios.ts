// src/utils/axios.ts
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

// 요청 인터셉터 설정
axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default axiosInstance
