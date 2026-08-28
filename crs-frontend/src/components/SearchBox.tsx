// path: crs-frontend/src/components/SearchBox.tsx
// purpose: o nhap tim kiem mon hoc, co debounce de tranh goi API lien tuc khi go phim

import { useState, useEffect } from 'react';

interface SearchBoxProps {
  onSearch: (keyword: string) => void;
  placeholder?: string;
}

export default function SearchBox({ onSearch, placeholder }: SearchBoxProps) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(inputValue.trim());
    }, 400);

    return () => clearTimeout(timer); // huy timer cu moi lan inputValue thay doi
  }, [inputValue, onSearch]);

  return (
    <input
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder={placeholder ?? 'Tim kiem theo ten mon hoc...'}
      style={{
        width: '100%',
        maxWidth: 400,
        padding: '8px 12px',
        fontSize: 14,
        border: '1px solid #ccc',
        borderRadius: 6,
      }}
    />
  );
}
