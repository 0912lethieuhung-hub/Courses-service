// path: crs-frontend/src/App.tsx
// purpose: rap CourseForm + CourseList + Pagination + SearchBox, xu ly Them/Sua/Xoa
// va dong bo lai danh sach (refetch) sau moi thao tac thanh cong

import { useState } from 'react';
import axios from 'axios';
import { useCourses } from './api/useCourses';
import { createCourse, updateCourse, deleteCourse } from './api/courseApi';
import SearchBox from './components/SearchBox';
import CourseList from './components/CourseList';
import Pagination from './components/Pagination';
import CourseForm from './components/CourseForm';
import type { Course, CourseFormValues } from './types/course';
import type { ApiErrorResponse } from './types/apiError';

function App() {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { courses, totalPages, state, errorMessage, refetch } = useCourses(
    keyword,
    page
  );

  const handleSearch = (newKeyword: string) => {
    setKeyword(newKeyword);
    setPage(0); // moi lan tim kiem moi, luon quay ve trang dau
  };

  const extractErrorMessage = (err: unknown): string => {
    if (axios.isAxiosError<ApiErrorResponse>(err)) {
      const data = err.response?.data;
      if (data?.message) return data.message;
      // Truong hop loi validation server tra ve dang { tenMonHoc: "...", soTinChi: "..." }
      if (data) {
        const firstFieldError = Object.values(data).find(
          (v) => typeof v === 'string'
        );
        if (firstFieldError) return firstFieldError;
      }
    }
    return 'Da xay ra loi, vui long thu lai.';
  };

  const handleFormSubmit = async (values: CourseFormValues) => {
    setSubmitting(true);
    setFormError(null);
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, values);
      } else {
        await createCourse(values);
      }
      setEditingCourse(null);
      refetch(); // dong bo lai danh sach ngay sau khi luu thanh cong
    } catch (err) {
      setFormError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (course: Course) => {
    if (!window.confirm(`Xoa mon hoc "${course.tenMonHoc}"?`)) return;
    try {
      await deleteCourse(course.id);
      refetch();
    } catch (err) {
      alert(extractErrorMessage(err));
    }
  };

  return (
    <div
      style={{
        padding: 24,
        fontFamily: 'sans-serif',
        maxWidth: 800,
        margin: '0 auto',
      }}
    >
      <h1>Quan ly mon hoc (Admin)</h1>
      <CourseForm
        editingCourse={editingCourse}
        onSubmit={handleFormSubmit}
        onCancel={() => setEditingCourse(null)}
        submitting={submitting}
        serverError={formError}
      />
      <SearchBox onSearch={handleSearch} />
      <div style={{ marginTop: 16 }}>
        <CourseList
          courses={courses}
          state={state}
          errorMessage={errorMessage}
          onRetry={refetch}
          onEdit={setEditingCourse}
          onDelete={handleDelete}
        />
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

export default App;

