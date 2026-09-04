// path: crs-frontend/src/components/Navbar.tsx
// purpose: thanh dieu huong, hien thi menu khac nhau tuy theo trang thai dang nhap va role

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      style={{
        display: 'flex',
        gap: 16,
        padding: 12,
        borderBottom: '1px solid #ddd',
        alignItems: 'center',
      }}
    >
      <Link to="/courses">Danh sach mon hoc</Link>

      {isAuthenticated && user?.role === 'ADMIN' && (
        <>
          <Link to="/admin/courses">Quan tri mon hoc</Link>
          <Link to="/admin/api-keys">Quan ly API Key</Link>
        </>
      )}

      {isAuthenticated && user?.role === 'STUDENT' && (
        <>
          <Link to="/register-course">Dang ky hoc phan</Link>
          <Link to="/my-registrations">Mon hoc da dang ky</Link>
        </>
      )}

      <div style={{ marginLeft: 'auto' }}>
        {isAuthenticated ? (
          <>
            <span style={{ marginRight: 12 }}>
              Xin chao, {user?.username} ({user?.role})
            </span>
            <button onClick={handleLogout}>Dang xuat</button>
          </>
        ) : (
          <Link to="/login">Dang nhap</Link>
        )}
      </div>
    </nav>
  );
}
