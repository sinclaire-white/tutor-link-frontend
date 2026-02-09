"use client";

import React from 'react';

export default function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  const pages = [];
  for (let i = 1; i <= total; i++) pages.push(i);

  return (
    <div className="flex items-center gap-2">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)} className="px-3 py-1 rounded border">Prev</button>
      {pages.map((p) => (
        <button key={p} onClick={() => onChange(p)} className={`px-3 py-1 rounded ${p === page ? 'bg-primary text-white' : 'border'}`}>{p}</button>
      ))}
      <button disabled={page >= total} onClick={() => onChange(page + 1)} className="px-3 py-1 rounded border">Next</button>
    </div>
  );
}
