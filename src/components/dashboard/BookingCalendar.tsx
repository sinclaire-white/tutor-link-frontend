"use client";

import React, { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Booking {
  id: string;
  scheduledAt?: string;
  date?: string; // fallback
  tutor?: { name: string };
  student?: { name: string };
  status?: string;
}

function getMonthDays(year: number, month: number) {
  const date = new Date(year, month, 1);
  const days: Date[] = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export default function BookingCalendar({ bookings, year, month }: { bookings?: Booking[]; year?: number; month?: number }) {
  const now = new Date();
  const [currentDate, setCurrentDate] = useState(
    new Date(year ?? now.getFullYear(), typeof month === 'number' ? month : now.getMonth(), 1)
  );

  const daysInMonth = useMemo(() => getMonthDays(currentDate.getFullYear(), currentDate.getMonth()), [currentDate]);

  // 0 (Sun) - 6 (Sat)
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const paddingDays = Array.from({ length: firstDayOfMonth });

  const byDate = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    (bookings || []).forEach((b) => {
      // Handle both scheduledAt (db) and date (legacy/mock)
      const dateStr = b.scheduledAt || b.date;
      if (!dateStr) return;
      
      try {
        const d = new Date(dateStr).toISOString().slice(0, 10);
        map[d] = map[d] || [];
        map[d].push(b);
      } catch (e) {
        console.warn('Invalid date in booking:', b);
      }
    });
    return map;
  }, [bookings]);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const getStatusStyle = (status?: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
           {monthName}
        </h3>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2">{d}</div>
        ))}
        
        {/* Empty cells for start of month */}
        {paddingDays.map((_, i) => (
          <div key={`padding-${i}`} className="min-h-[80px] sm:min-h-[100px] border border-transparent rounded-lg p-1 sm:p-2 bg-muted/5 opacity-50" />
        ))}
        
        {daysInMonth.map((d) => {
          const dateKey = d.toISOString().slice(0,10);
          const list = byDate[dateKey] || [];
          const isToday = new Date().toISOString().slice(0,10) === dateKey;
          
          return (
            <div 
              key={dateKey} 
              className={cn(
                "min-h-[80px] sm:min-h-[100px] border rounded-lg p-1 sm:p-2 flex flex-col transition-all hover:shadow-xs",
                isToday ? "bg-primary/5 border-primary/30" : "bg-card"
              )}
            >
              <div className={cn(
                "text-xs font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full transition-colors",
                isToday ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              )}>
                {d.getDate()}
              </div>
              
              <div className="flex-1 space-y-1 overflow-y-auto max-h-[80px] scrollbar-none">
                {list.slice(0, 3).map(b => (
                  <div 
                    key={b.id} 
                    className={cn(
                      "text-[10px] sm:text-xs rounded px-1.5 py-1 border truncate font-medium flex items-center gap-1",
                      getStatusStyle(b.status)
                    )}
                    title={`${b.tutor?.name || b.student?.name || 'Session'} (${b.status})`}
                  >
                    <Clock className="w-3 h-3 flex-shrink-0 opacity-70" />
                    <span className="truncate">
                      {b.scheduledAt ? new Date(b.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                    </span>
                  </div>
                ))}
                
                {list.length > 3 && (
                  <div className="text-[10px] text-muted-foreground font-medium pl-1">
                    +{list.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
