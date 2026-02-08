
const reviews = [
  {
    name: "Ayesha Rahman",
    role: "HSC Student",
    avatar: "/avatars/ayesha.jpg",
    rating: 5,
    text: "Found the perfect physics tutor in less than 10 minutes. Classes are super interactive and my grades improved dramatically in just one month!",
  },
  {
    name: "Rahat Khan",
    role: "University Student",
    avatar: "/avatars/rahat.jpg",
    rating: 5,
    text: "The best platform for programming help. My Python tutor explains concepts so clearly — finally understood OOP after struggling for semesters.",
  },
  {
    name: "Fatima Islam",
    role: "IELTS Aspirant",
    avatar: "/avatars/fatima.jpg",
    rating: 4.9,
    text: "Got Band 8 in first attempt thanks to my dedicated English tutor. Flexible timings and detailed feedback made all the difference.",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          What Students Are Saying
        </h2>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="bg-card rounded-xl p-6 border shadow-sm flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                  {review.name[0]}
                </div>
                <div>
                  <h4 className="font-semibold">{review.name}</h4>
                  <p className="text-sm text-muted-foreground">{review.role}</p>
                </div>
              </div>

              <div className="flex text-yellow-500 mb-3">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>

              <p className="text-muted-foreground leading-relaxed flex-1">
                &quot;{review.text}&quot;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}