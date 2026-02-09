"use client";

import React from 'react';

export default function BookingCard({ booking, onAction }: { booking: any; onAction?: (id: string, status: string) => void }) {
  const { id, date, status, studentName, tutorName } = booking || {};

  return (
    <div className="p-3 border rounded flex justify-between items-center">
      <div>
        <div className="font-medium">{studentName || tutorName || 'Unknown'}</div>
        <div className="text-sm text-muted-foreground">{date || 'No date'}</div>
        <div className="text-xs text-muted-foreground">Status: {status || 'pending'}</div>
      </div>
      <div className="flex gap-2">
        {status !== 'approved' && (
          <button
            className="px-3 py-1 rounded bg-emerald-600 text-white text-sm"
            onClick={() => onAction && onAction(id, 'approved')}
          >
            Accept
          </button>
        )}
        {status !== 'declined' && (
          <button
            className="px-3 py-1 rounded bg-red-600 text-white text-sm"
            onClick={() => onAction && onAction(id, 'declined')}
          >
            Decline
          </button>
        )}
      </div>
    </div>
  );
}
