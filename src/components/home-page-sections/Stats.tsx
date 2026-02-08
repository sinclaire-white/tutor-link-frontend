
const stats = [
  { value: "520+", label: "Verified Tutors" },
  { value: "4.9/5", label: "Average Rating" },
  { value: "12k+", label: "Sessions Completed" },
  { value: "28", label: "Countries Represented" },
];

export function Stats() {
  return (
    <section className="bg-primary text-primary-foreground py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
              <p className="text-primary-foreground/80 text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}