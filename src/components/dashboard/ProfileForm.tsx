"use client";

import { useState } from 'react';

export default function ProfileForm({ initial }: { initial?: any }) {
  const [form, setForm] = useState({ name: initial?.name || '', email: initial?.email || '', bio: initial?.bio || '' });
  const [status, setStatus] = useState<string>('');
  const apiBase = process.env.NEXT_PUBLIC_API_URL || '';

  async function save() {
    setStatus('saving');
    try {
      if (!apiBase) throw new Error('no api');
      const res = await fetch(`${apiBase}/users/me`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('save failed');
      setStatus('saved');
    } catch (e) {
      setStatus('error');
    }
  }

  return (
    <div className="space-y-2 max-w-lg">
      <label className="block">
        <div className="text-sm font-medium">Name</div>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full border rounded px-2 py-1" />
      </label>
      <label className="block">
        <div className="text-sm font-medium">Email</div>
        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full border rounded px-2 py-1" />
      </label>
      <label className="block">
        <div className="text-sm font-medium">Bio</div>
        <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="mt-1 w-full border rounded px-2 py-1" />
      </label>
      <div className="flex items-center gap-3">
        <button onClick={save} className="px-4 py-2 rounded bg-primary text-white">Save</button>
        {status === 'saving' && <span className="text-sm text-muted-foreground">Saving…</span>}
        {status === 'saved' && <span className="text-sm text-emerald-600">Saved</span>}
        {status === 'error' && <span className="text-sm text-red-600">Error</span>}
      </div>
    </div>
  );
}
