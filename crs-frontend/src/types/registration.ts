// path: crs-frontend/src/types/registration.ts
// purpose: interface khop voi Registration entity ben registration service (Buoi 3)

export interface Registration {
  id: number;
  studentId: number;
  courseId: number;
  trangThai: 'DA_DANG_KY' | 'DA_HUY';
  ngayDangKy: string; // ISO date string tu backend, se format lai khi hien thi
}

export interface RegistrationRequest {
  studentId: number;
  courseId: number;
}
