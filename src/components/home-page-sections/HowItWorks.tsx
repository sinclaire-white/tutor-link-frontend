import { Search, Calendar, GraduationCap, Star } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Search & Filter",
    desc: "Find tutors by subject, price, rating and availability.",
    icon: Search,
  },
  {
    number: 2,
    title: "Book Instantly",
    desc: "Choose time slot and confirm booking in seconds.",
    icon: Calendar,
  },
  {
    number: 3,
    title: "Learn & Grow",
    desc: "Attend sessions online or in-person and track progress.",
    icon: GraduationCap,
  },
  {
    number: 4,
    title: "Review & Repeat",
    desc: "Share feedback and book your next session easily.",
    icon: Star,
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 md:py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">How It Works</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Get started in four simple steps
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.number} className="relative text-center group">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
              )}
              
              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Icon className="h-7 w-7" />
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center text-xs font-bold text-primary">
                  {step.number}
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}