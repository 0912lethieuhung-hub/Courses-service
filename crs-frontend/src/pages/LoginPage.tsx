// path: crs-frontend/src/pages/LoginPage.tsx
// purpose: trang dang nhap, goi POST /api/auth/login, luu vao AuthContext roi dieu huong

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { login as loginApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import type { ApiErrorResponse } from '../types/apiError';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await loginApi({ username, password });
      login(res.data);
      navigate('/courses');
    } catch (err) {
      if (
        axios.isAxiosError<ApiErrorResponse>(err) &&
        err.response?.data?.message
      ) {
        setError(err.response.data.message);
      } else {
        setError('Dang nhap that bai, vui long thu lai.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 360,
        margin: '80px auto',
        padding: 24,
        border: '1px solid #ddd',
        borderRadius: 8,
      }}
    >
      <h2>Dang nhap he thong CRS</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Ten dang nhap</label>
          <br />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Mat khau</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          style={{ width: '100%' }}
        >
          {submitting ? 'Dang xu ly...' : 'Dang nhap'}
        </button>
      </form>
    </div>
  );
}
