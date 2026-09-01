// path: crs-frontend/src/pages/MyRegistrationsPage.tsx
// purpose: trang "Mon hoc da dang ky" - lay danh sach dang ky roi tu ghep them ten mon hoc,
// cho phep huy dang ky

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { getMyRegistrations, cancelRegistration } from '../api/registrationApi';
import { getCourseById } from '../api/courseApi';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import type { Registration } from '../types/registration';
import type { Course } from '../types/course';
import type { ApiErrorResponse } from '../types/apiError';

interface RegistrationRow extends Registration {
  courseName: string;
}

export default function MyRegistrationsPage() {
  const [rows, setRows] = useState<RegistrationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const { toast, showToast, clearToast } = useToast();

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await getMyRegistrations();
      const activeRegistrations = res.data.filter((r) => r.trangThai === 'DA_DANG_KY');

      // Ghep ten mon hoc cho tung dong - goi song song bang Promise.all cho nhanh
      const enriched = await Promise.all(
        activeRegistrations.map(async (reg) => {
          try {
            const courseRes = await getCourseById(reg.courseId);
            return { ...reg, courseName: (courseRes.data as Course).tenMonHoc };
          } catch {
            // Neu khong lay duoc ten mon (vi du mon da bi Admin xoa), van hien dong nay
            // voi ten mac dinh, khong lam vo ca trang
            return { ...reg, courseName: `Mon hoc #${reg.courseId} (khong tim thay thong tin)` };
          }
        })
      );
      setRows(enriched);
    } catch (err) {
      let message = 'Khong tai duoc danh sach dang ky.';
      if (axios.isAxiosError<ApiErrorResponse>(err) && err.response?.data?.message) {
        message = err.response.data.message;
      }
      setLoadError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCancel = async (row: RegistrationRow) => {
    if (!window.confirm(`Huy dang ky mon "${row.courseName}"?`)) return;
    setCancellingId(row.id);
    try {
      await cancelRegistration(row.id);
      showToast(`Da huy dang ky mon "${row.courseName}"`, 'success');
      loadData(); // tai lai danh sach
    } catch (err) {
      let message = 'Huy dang ky khong thanh cong.';
      if (axios.isAxiosError<ApiErrorResponse>(err) && err.response?.data?.message) {
        message = err.response.data.message;
      }
      showToast(message, 'error');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h1>Mon hoc da dang ky</h1>
      {loading && <p>Dang tai...</p>}
      {!loading && loadError && <p style={{ color: '#b91c1c' }}>{loadError}</p>}
      {!loading && !loadError && rows.length === 0 && <p>Ban chua dang ky mon hoc nao.</p>}
      {!loading && !loadError && rows.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #333' }}>
              <th>Ten mon hoc</th>
              <th>Ngay dang ky</th>
              <th>Thao tac</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} style={{ borderBottom: '1px solid #eee' }}>
                <td>{row.courseName}</td>
                <td>{new Date(row.ngayDangKy).toLocaleString('vi-VN')}</td>
                <td>
                  <button
                    onClick={() => handleCancel(row)}
                    disabled={cancellingId === row.id}
                  >
                    {cancellingId === row.id ? 'Dang huy...' : 'Huy dang ky'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
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
