// path: crs-frontend/src/App.tsx
// purpose: khai bao toan bo Router cua ung dung, thay the noi dung App.tsx cu cua Buoi 6-7

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import CoursesPage from './pages/CoursesPage';
import AdminCoursesPage from './pages/AdminCoursesPage';
import RegisterCoursePage from './pages/RegisterCoursePage';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/courses" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminCoursesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register-course"
            element={
              <ProtectedRoute requiredRole="STUDENT">
                <RegisterCoursePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;


