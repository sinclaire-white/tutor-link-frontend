"use client";

export default function StatsCards({ stats }: { stats?: any }) {
  const data = stats || { users: 124, bookings: 342, revenue: 12345 };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-4 border rounded">
        <div className="text-sm text-muted-foreground">Users</div>
        <div className="text-2xl font-semibold">{data.users}</div>
      </div>
      <div className="p-4 border rounded">
        <div className="text-sm text-muted-foreground">Bookings</div>
        <div className="text-2xl font-semibold">{data.bookings}</div>
      </div>
      <div className="p-4 border rounded">
        <div className="text-sm text-muted-foreground">Revenue</div>
        <div className="text-2xl font-semibold">${data.revenue}</div>
      </div>
    </div>
  );
}
