// src/app/(commonLayout)/careers/page.tsx
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers | TutorLink',
};

export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Join Our Team</h1>
      <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
        We are always looking for talented individuals who are passionate about education and technology.
      </p>

      <div className="bg-muted p-8 rounded-xl shadow-inner">
        <h2 className="text-2xl font-semibold mb-4">No Open Positions</h2>
        <p className="text-muted-foreground mb-6">
          While we don't have any specific openings right now, we'd love to hear from you.
        </p>
        <Button variant="outline" asChild>
            <a href="mailto:careers@tutorlink.com">Email Us Your Resume</a>
        </Button>
      </div>
    </div>
  );
}
