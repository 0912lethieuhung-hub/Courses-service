// path: crs-frontend/src/api/apiKeyApi.ts
// purpose: cac ham goi API quan ly API Key qua Gateway

import axiosClient from './axiosClient';
import type { ApiKey, ApiKeyCreateRequest } from '../types/apiKey';

export const getApiKeys = () => axiosClient.get<ApiKey[]>('/api/api-keys');

export const createApiKey = (payload: ApiKeyCreateRequest) =>
  axiosClient.post<ApiKey>('/api/api-keys', payload);

export const revokeApiKey = (id: number) =>
  axiosClient.delete(`/api/api-keys/${id}`);
