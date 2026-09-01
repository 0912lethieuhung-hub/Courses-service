// path: crs-frontend/src/types/course.ts
// purpose: interface khop voi CourseDTO ben course-service (Buoi 2- 3)

export interface Course {
  id: number;
  tenMonHoc: string;
  soTinChi: number;
  soChoToiDa: number;
  soChoConLai: number;
}

// Khop voi cau truc Page<CourseDTO> ma Spring Data JPA tra ve (Buoi 3, muc A)
export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // trang hien tai (bat dau tu 0)
  size: number;
}

export interface CourseFormValues {
  tenMonHoc: string;
  soTinChi: string; // dung string trong form de de kiem soat input rong, se parseInt khi gui di
  soChoToiDa: string;
}

export const emptyCourseForm: CourseFormValues = {
  tenMonHoc: '',
  soTinChi: '',
  soChoToiDa: '',
};
