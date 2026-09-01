// path: crs-frontend/src/pages/RegisterCoursePage.tsx
// purpose: trang Dang ky hoc phan hoan chinh - thay the khung trang tam cua Buoi 8

import { useState } from 'react';
import axios from 'axios';
import { useCourses } from '../api/useCourses';
import { registerCourse } from '../api/registrationApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import SearchBox from '../components/SearchBox';
import CourseList from '../components/CourseList';
import Pagination from '../components/Pagination';
import Toast from '../components/Toast';
import type { Course } from '../types/course';
import type { ApiErrorResponse } from '../types/apiError';

export default function RegisterCoursePage() {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [registeringId, setRegisteringId] = useState<number | null>(null);

  const { user } = useAuth();
  const { toast, showToast, clearToast } = useToast();
  const { courses, totalPages, state, errorMessage, refetch } = useCourses(keyword, page);

  const handleSearch = (newKeyword: string) => {
    setKeyword(newKeyword);
    setPage(0);
  };

  const handleRegister = async (course: Course) => {
    if (!user) return;
    setRegisteringId(course.id);
    try {
      await registerCourse({ studentId: user.id, courseId: course.id });
      showToast(`Dang ky thanh cong mon "${course.tenMonHoc}"`, 'success');
      refetch(); // tai lai danh sach de cap nhat so cho con lai moi nhat
    } catch (err) {
      // LUU Y: loi co the den tu registration-service (vi du "da dang ky roi")
      // hoac lan truyen tu course-service (vi du "het cho") - Frontend KHONG can
      // phan biet nguon goc, chi can doc dung truong "message" trong JSON tra ve.
      let message = 'Dang ky khong thanh cong, vui long thu lai.';
      if (axios.isAxiosError<ApiErrorResponse>(err) && err.response?.data?.message) {
        message = err.response.data.message;
      }
      showToast(message, 'error');
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h1>Dang ky hoc phan</h1>
      <SearchBox onSearch={handleSearch} />
      <div style={{ marginTop: 16 }}>
        <CourseList
          courses={courses}
          state={state}
          errorMessage={errorMessage}
          onRetry={refetch}
          onRegister={handleRegister}
          registeringId={registeringId}
        />
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={clearToast}
        />
      )}
    </div>
  );
}
