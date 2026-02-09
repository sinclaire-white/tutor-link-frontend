"use client";

import { useSearchParams, useRouter } from 'next/navigation';

type Tab = { key: string; label: string };

export default function TopTabs({ tabs }: { tabs: Tab[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const active = searchParams?.get('tab') || tabs[0]?.key;

  return (
    <div className="flex items-center gap-2 border-b pb-3">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => router.push(`?tab=${t.key}`)}
          className={`px-4 py-2 rounded ${active === t.key ? 'bg-primary text-white' : 'bg-transparent'}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
