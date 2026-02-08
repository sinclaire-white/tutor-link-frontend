
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
      "Browse tutors or search by subject → select preferred time slot → confirm booking. Payment is held until session completion.",
  },
  {
    question: "Are all tutors verified?",
    answer:
      "Yes. Every tutor goes through ID verification, qualification check, and interview before appearing on the platform.",
  },
  {
    question: "What happens if I'm not satisfied with a session?",
    answer:
      "We offer session credit or refund in case of genuine dissatisfaction. Just contact support within 24 hours.",
  },
  {
    question: "Can I take trial lessons?",
    answer:
      "Many tutors offer discounted or free 30-minute trial sessions. You can filter for tutors who provide trials.",
  },
  {
    question: "Do you offer group classes?",
    answer:
      "Yes — many tutors conduct small group sessions (2–6 students) at reduced per-person rates.",
  },
];

export function FAQ() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-lg font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}