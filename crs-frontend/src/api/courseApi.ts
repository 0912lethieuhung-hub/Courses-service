import axiosClient from './axiosClient';
import type { Course, PagedResponse, CourseFormValues } from '../types/course';

export const getCourses = (keyword?: string, page = 0, size = 10) => {
  return axiosClient.get<PagedResponse<Course>>('/api/courses', {
    params: { keyword, page, size },
  });
};

const toPayload = (values: CourseFormValues) => ({
  tenMonHoc: values.tenMonHoc.trim(),
  soTinChi: Number(values.soTinChi),
  soChoToiDa: Number(values.soChoToiDa),
});

export const createCourse = (values: CourseFormValues) => {
  return axiosClient.post<Course>('/api/courses', toPayload(values));
};

export const updateCourse = (id: number, values: CourseFormValues) => {
  return axiosClient.put<Course>(`/api/courses/${id}`, toPayload(values));
};

export const deleteCourse = (id: number) => {
  return axiosClient.delete(`/api/courses/${id}`);
};
