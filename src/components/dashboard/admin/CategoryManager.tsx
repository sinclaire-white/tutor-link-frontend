"use client";

import { useState } from 'react';

export default function CategoryManager({ initial }: { initial?: string[] }) {
  const [items, setItems] = useState<string[]>(initial || ['Math', 'Physics', 'English']);
  const [value, setValue] = useState('');

  function add() {
    if (!value.trim()) return;
    setItems((s) => [...s, value.trim()]);
    setValue('');
  }

  function remove(i: number) {
    setItems((s) => s.filter((_, idx) => idx !== i));
  }

  return (
    <div className="max-w-lg">
      <div className="flex gap-2">
        <input className="flex-1 border rounded px-2 py-1" value={value} onChange={(e) => setValue(e.target.value)} />
        <button className="px-3 py-1 bg-primary text-white rounded" onClick={add}>Add</button>
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((c, i) => (
          <li key={c} className="flex justify-between items-center p-2 border rounded">
            <span>{c}</span>
            <button className="text-red-600" onClick={() => remove(i)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
