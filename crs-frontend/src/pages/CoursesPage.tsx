// path: crs-frontend/src/pages/CoursesPage.tsx
// purpose: trang xem danh sach mon hoc cong khai, chuyen tu App.tsx cua Buoi 6 sang,
// KHONG co Form Them/Sua/Xoa (danh cho ca ADMIN va STUDENT xem)

import { useState } from 'react';
import { useCourses } from '../api/useCourses';
import SearchBox from '../components/SearchBox';
import CourseList from '../components/CourseList';
import Pagination from '../components/Pagination';

export default function CoursesPage() {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const { courses, totalPages, state, errorMessage, refetch } = useCourses(
    keyword,
    page
  );

  const handleSearch = (newKeyword: string) => {
    setKeyword(newKeyword);
    setPage(0);
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h1>Danh sach mon hoc</h1>
      <SearchBox onSearch={handleSearch} />
      <div style={{ marginTop: 16 }}>
        <CourseList
          courses={courses}
          state={state}
          errorMessage={errorMessage}
          onRetry={refetch}
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
