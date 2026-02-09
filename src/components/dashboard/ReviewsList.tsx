"use client";

export default function ReviewsList({ reviews }: { reviews?: any[] }) {
  const list = reviews || [
    { id: 'r1', title: 'Great tutor', body: 'Helped me a lot', rating: 5 },
    { id: 'r2', title: 'Good session', body: 'Clear explanations', rating: 4 },
  ];

  return (
    <div className="space-y-3">
      {list.map((r) => (
        <div key={r.id} className="p-3 border rounded">
          <div className="font-medium">{r.title} — {r.rating}/5</div>
          <div className="text-sm text-muted-foreground">{r.body}</div>
        </div>
      ))}
    </div>
  );
}
