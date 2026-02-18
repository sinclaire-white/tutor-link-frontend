import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Ayesha Rahman",
    role: "HSC Student",
    rating: 5,
    text: "Found the perfect physics tutor in less than 10 minutes. Classes are super interactive and my grades improved dramatically in just one month!",
  },
  {
    name: "Rahat Khan",
    role: "University Student",
    rating: 5,
    text: "The best platform for programming help. My Python tutor explains concepts so clearly — finally understood OOP after struggling for semesters.",
  },
  {
    name: "Fatima Islam",
    role: "IELTS Aspirant",
    rating: 5,
    text: "Got Band 8 in first attempt thanks to my dedicated English tutor. Flexible timings and detailed feedback made all the difference.",
  },
];

export function Testimonials() {
  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          What Students Are Saying
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Real experiences from students who achieved their goals
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <Card
            key={review.name}
            className="p-6 relative hover:shadow-lg transition-shadow"
          >
            <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />
            
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-12 w-12 border-2 border-primary/10">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                  {review.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold">{review.name}</h4>
                <p className="text-sm text-muted-foreground">{review.role}</p>
              </div>
            </div>

            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < review.rating
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>

            <p className="text-muted-foreground leading-relaxed text-sm">
              &quot;{review.text}&quot;
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}