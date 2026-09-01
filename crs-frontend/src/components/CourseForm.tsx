// path: crs-frontend/src/components/CourseForm.tsx
// purpose: form dung chung cho Them va Sua mon hoc, validate phia client truoc khi goi API

import { useState, useEffect } from 'react';
import type { Course, CourseFormValues } from '../types/course';
import { emptyCourseForm } from '../types/course';

interface CourseFormProps {
  editingCourse: Course | null; // null = dang o che do Them; co gia tri = dang Sua
  onSubmit: (values: CourseFormValues) => Promise<void>;
  onCancel: () => void;
  submitting: boolean;
  serverError: string | null;
}

export default function CourseForm({
  editingCourse,
  onSubmit,
  onCancel,
  submitting,
  serverError,
}: CourseFormProps) {
  const [values, setValues] = useState<CourseFormValues>(emptyCourseForm);
  const [clientErrors, setClientErrors] = useState<Partial<CourseFormValues>>({});

  // Moi lan editingCourse thay doi (bam nut Sua tren 1 dong khac), mo lai du lieu vao form
  useEffect(() => {
    if (editingCourse) {
      setValues({
        tenMonHoc: editingCourse.tenMonHoc,
        soTinChi: String(editingCourse.soTinChi),
        soChoToiDa: String(editingCourse.soChoToiDa),
      });
    } else {
      setValues(emptyCourseForm);
    }
    setClientErrors({});
  }, [editingCourse]);

  const validate = (): boolean => {
    const errors: Partial<CourseFormValues> = {};

    if (!values.tenMonHoc.trim()) {
      errors.tenMonHoc = 'Ten mon hoc khong duoc de trong';
    }

    const soTinChi = Number(values.soTinChi);
    if (!values.soTinChi || isNaN(soTinChi) || soTinChi <= 0) {
      errors.soTinChi = 'So tin chi phai la so lon hon 0';
    }

    const soChoToiDa = Number(values.soChoToiDa);
    if (!values.soChoToiDa || isNaN(soChoToiDa) || soChoToiDa <= 0) {
      errors.soChoToiDa = 'So cho toi da phai la so lon hon 0';
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: '1px solid #ddd',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
      }}
    >
      <h3>{editingCourse ? 'Sua mon hoc' : 'Them mon hoc moi'}</h3>

      <div style={{ marginBottom: 8 }}>
        <label>Ten mon hoc</label>
        <br />
        <input
          type="text"
          value={values.tenMonHoc}
          onChange={(e) =>
            setValues({ ...values, tenMonHoc: e.target.value })
          }
        />
        {clientErrors.tenMonHoc && (
          <p style={{ color: '#b91c1c', margin: 0 }}>
            {clientErrors.tenMonHoc}
          </p>
        )}
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>So tin chi</label>
        <br />
        <input
          type="number"
          value={values.soTinChi}
          onChange={(e) =>
            setValues({ ...values, soTinChi: e.target.value })
          }
        />
        {clientErrors.soTinChi && (
          <p style={{ color: '#b91c1c', margin: 0 }}>
            {clientErrors.soTinChi}
          </p>
        )}
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>So cho toi da</label>
        <br />
        <input
          type="number"
          value={values.soChoToiDa}
          onChange={(e) =>
            setValues({ ...values, soChoToiDa: e.target.value })
          }
        />
        {clientErrors.soChoToiDa && (
          <p style={{ color: '#b91c1c', margin: 0 }}>
            {clientErrors.soChoToiDa}
          </p>
        )}
      </div>

      {serverError && <p style={{ color: '#b91c1c' }}>{serverError}</p>}

      <button type="submit" disabled={submitting}>
        {submitting
          ? 'Dang luu...'
          : editingCourse
          ? 'Cap nhat'
          : 'Them moi'}
      </button>
      {editingCourse && (
        <button
          type="button"
          onClick={onCancel}
          style={{ marginLeft: 8 }}
        >
          Huy
        </button>
      )}
    </form>
  );
}
