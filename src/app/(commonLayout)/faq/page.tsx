import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | TutorLink',
};

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>How do sessions work on TutorLink?</AccordionTrigger>
          <AccordionContent>
            Students browse tutor profiles, message a tutor to discuss needs, and book a session. Sessions take place online via our integrated video classroom.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>Is there a cost for using TutorLink?</AccordionTrigger>
          <AccordionContent>
            TutorLink is free for students to browse and message tutors. You only pay for the sessions you book. Tutors set their own hourly rates.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>How do I become a tutor?</AccordionTrigger>
          <AccordionContent>
            Sign up as a tutor, create your profile, list your subjects and rates, and undergo our verification process. Once approved, your profile will be visible to students.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
            <AccordionTrigger>What happens if I need to cancel a session?</AccordionTrigger>
            <AccordionContent>
                Both students and tutors can cancel sessions within our flexible cancellation policy. Please refer to your booking confirmation for specific details.
            </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
