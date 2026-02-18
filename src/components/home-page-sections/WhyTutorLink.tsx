import { ShieldCheck, Clock, Lock, Target, TrendingUp, Headphones } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    title: "Verified & Qualified Tutors",
    description: "Every tutor passes identity verification and subject expertise checks.",
    icon: ShieldCheck,
    color: "text-green-600",
    bgColor: "bg-green-600/10",
  },
  {
    title: "Flexible Scheduling",
    description: "Book sessions that fit your timezone and availability — 24/7.",
    icon: Clock,
    color: "text-blue-600",
    bgColor: "bg-blue-600/10",
  },
  {
    title: "Secure Payments",
    description: "Pay only after the session. Money held until you're satisfied.",
    icon: Lock,
    color: "text-purple-600",
    bgColor: "bg-purple-600/10",
  },
  {
    title: "Personalized Matching",
    description: "Smart recommendations based on learning style, goals & level.",
    icon: Target,
    color: "text-orange-600",
    bgColor: "bg-orange-600/10",
  },
  {
    title: "Progress Tracking",
    description: "Session notes, homework & improvement analytics in one place.",
    icon: TrendingUp,
    color: "text-emerald-600",
    bgColor: "bg-emerald-600/10",
  },
  {
    title: "24/7 Support",
    description: "Friendly team ready to help with bookings, issues or questions.",
    icon: Headphones,
    color: "text-pink-600",
    bgColor: "bg-pink-600/10",
  },
];

export function WhyTutorLink() {
  return (
    <section className="py-16 md:py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Why Students Choose TutorLink
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Experience the difference with our premium tutoring platform
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card
              key={feature.title}
              className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.bgColor} mb-4`}>
                <Icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}