
const features = [
  {
    title: "Verified & Qualified Tutors",
    description: "Every tutor passes identity verification and subject expertise checks.",
    icon: "✓",
  },
  {
    title: "Flexible Scheduling",
    description: "Book sessions that fit your timezone and availability — 24/7.",
    icon: "🕒",
  },
  {
    title: "Secure Payments",
    description: "Pay only after the session. Money held until you're satisfied.",
    icon: "🔒",
  },
  {
    title: "Personalized Matching",
    description: "Smart recommendations based on learning style, goals & level.",
    icon: "🎯",
  },
  {
    title: "Progress Tracking",
    description: "Session notes, homework & improvement analytics in one place.",
    icon: "📈",
  },
  {
    title: "24/7 Support",
    description: "Friendly team ready to help with bookings, issues or questions.",
    icon: "🛟",
  },
];

export function WhyTutorLink() {
  return (
    <section className="bg-muted/30 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why Students Choose TutorLink
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-card rounded-xl p-6 border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-4xl mb-4 text-primary">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}