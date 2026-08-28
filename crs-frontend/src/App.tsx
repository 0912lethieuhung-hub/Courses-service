// path: crs-frontend/src/App.tsx
// purpose: trang danh sach mon hoc hoan chinh, thay the component test tam cua Buoi 5,
// phoi hop SearchBox + CourseList + Pagination + useCourses

import { useState } from 'react';
import { useCourses } from './api/useCourses';
import SearchBox from './components/SearchBox';
import CourseList from './components/CourseList';
import Pagination from './components/Pagination';

function App() {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const { courses, totalPages, state, errorMessage, refetch } = useCourses(
    keyword,
    page
  );

  const handleSearch = (newKeyword: string) => {
    setKeyword(newKeyword);
    setPage(0); // moi lan tim kiem moi, luon quay ve trang dau
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

export default App;
