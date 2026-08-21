// path: crs-frontend/src/api/courseApi.ts
// purpose: cac ham goi API lien quan Course, dung chung axiosClient da cau hinh o muc B.2

import axiosClient from './axiosClient';
import type { Course, PagedResponse } from '../types/course';

export const getCourses = (keyword?: string, page = 0, size = 10) => {
  return axiosClient.get<PagedResponse<Course>>('/api/courses', {
    params: { keyword, page, size },
  });
};
