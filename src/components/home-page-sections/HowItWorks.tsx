
const steps = [
  { number: 1, title: 'Search & Filter', desc: 'Find tutors by subject, price, rating and availability.' },
  { number: 2, title: 'Book Instantly', desc: 'Choose time slot and confirm booking in seconds.' },
  { number: 3, title: 'Learn & Grow', desc: 'Attend sessions online or in-person and track progress.' },
  { number: 4, title: 'Review & Repeat', desc: 'Share feedback and book your next session easily.' },
]

export function HowItWorks() {
  return (
    <section>
      <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
      <div className="grid md:grid-cols-4 gap-8">
        {steps.map((step) => (
          <div key={step.number} className="text-center">
            <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-6">
              {step.number}
            </div>
            <h3 className="font-semibold mb-3">{step.title}</h3>
            <p className="text-muted-foreground text-sm">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}