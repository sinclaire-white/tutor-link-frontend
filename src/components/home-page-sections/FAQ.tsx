
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "How do I book a tutor?",
    answer:
      "Browse verified tutors by subject or price, check their availability, and select a time slot that works for you. Secure your booking instantly.",
  },
  {
    question: "Are the tutors verified?",
    answer:
      "Yes. Every tutor undergoes a strict verification process including identity checks and qualification reviews to ensure quality learning.",
  },
  {
    question: "What if I'm not satisfied with a session?",
    answer:
      "Your satisfaction is our priority. If a session doesn't meet expectations, contact support within 24 hours for a credit or refund.",
  },
  {
    question: "Can I take trial lessons?",
    answer:
      "Many tutors offer discounted trial sessions. Look for the 'Trial Available' badge on tutor profiles to test the waters before committing.",
  },
  {
    question: "Do you offer group classes?",
    answer:
      "Yes! Tutors often conduct small group sessions at reduced rates, perfect for learning with peers in a collaborative environment.",
  },
  {
    question: "How do payments work?",
    answer:
      "We use a secure payment system. You are charged only after you confirm a booking, and funds are held in escrow until the lesson is complete.",
  },
];

export function FAQ() {
  return (
    <section>
      <div className="text-center mb-12 space-y-4">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Everything you need to know about TutorLink.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}