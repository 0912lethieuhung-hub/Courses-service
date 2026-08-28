// path: crs-frontend/src/components/CourseList.tsx
// purpose: hien thi danh sach mon hoc, xu ly du 4 trang thai Loading/Success/Empty/Error

import type { Course } from '../types/course';
import type { LoadState } from '../api/useCourses';

interface CourseListProps {
  courses: Course[];
  state: LoadState;
  errorMessage: string;
  onRetry: () => void;
}

export default function CourseList({
  courses,
  state,
  errorMessage,
  onRetry,
}: CourseListProps) {
  if (state === 'loading') {
    return <p>Dang tai danh sach mon hoc...</p>;
  }

  if (state === 'error') {
    return (
      <div style={{ color: '#b91c1c' }}>
        <p>{errorMessage}</p>
        <button onClick={onRetry}>Thu lai</button>
      </div>
    );
  }

  if (state === 'empty') {
    return <p>Khong tim thay mon hoc nao phu hop.</p>;
  }

  // state === 'success'
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ textAlign: 'left', borderBottom: '2px solid #333' }}>
          <th>Ten mon hoc</th>
          <th>So tin chi</th>
          <th>So cho con lai</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course) => (
          <tr key={course.id} style={{ borderBottom: '1px solid #eee' }}>
            <td>{course.tenMonHoc}</td>
            <td>{course.soTinChi}</td>
            <td
              style={{
                color: course.soChoConLai === 0 ? '#b91c1c' : 'inherit',
              }}
            >
              {course.soChoConLai} / {course.soChoToiDa}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
