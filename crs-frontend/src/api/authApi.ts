// path: crs-frontend/src/api/authApi.ts
// purpose: ham goi POST /api/auth/login qua Gateway

import axiosClient from './axiosClient';
import type { LoginRequest, LoginResponse } from '../types/auth';

export const login = (payload: LoginRequest) => {
  return axiosClient.post<LoginResponse>('/api/auth/login', payload);
};
