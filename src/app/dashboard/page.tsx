import Link from 'next/link';

export default function DashboardIndex() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Choose Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <Link href="/dashboard/student" className="p-6 border rounded hover:shadow">Student Dashboard</Link>
        <Link href="/dashboard/tutor" className="p-6 border rounded hover:shadow">Tutor Dashboard</Link>
        <Link href="/dashboard/admin" className="p-6 border rounded hover:shadow">Admin Dashboard</Link>
      </div>
    </div>
  );
}
