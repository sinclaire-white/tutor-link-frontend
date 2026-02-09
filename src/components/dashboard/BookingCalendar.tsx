"use client";

import React, { useMemo } from 'react';

function getMonthDays(year: number, month: number) {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export default function BookingCalendar({ bookings, year, month }: { bookings?: any[]; year?: number; month?: number }) {
  const now = new Date();
  const y = year ?? now.getFullYear();
  const m = typeof month === 'number' ? month : now.getMonth();

  const days = useMemo(() => getMonthDays(y, m), [y, m]);

  const byDate = useMemo(() => {
    const map: Record<string, any[]> = {};
    (bookings || []).forEach((b) => {
      const d = b.date ? new Date(b.date).toISOString().slice(0, 10) : 'unknown';
      map[d] = map[d] || [];
      map[d].push(b);
    });
    return map;
  }, [bookings]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-2">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className="text-center font-medium">{d}</div>
        ))}
        {days.map((d) => {
          const key = d.toISOString().slice(0,10);
          const list = byDate[key] || [];
          return (
            <div key={key} className="min-h-[80px] border p-2 rounded">
              <div className="text-xs font-semibold">{d.getDate()}</div>
              <div className="mt-1 space-y-1">
                {list.slice(0,3).map(b => (
                  <div key={b.id} className="text-[11px] bg-muted/30 rounded px-1">{b.tutorName || b.studentName || 'Booking'}</div>
                ))}
                {list.length > 3 && <div className="text-[11px] text-muted-foreground">+{list.length-3} more</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
