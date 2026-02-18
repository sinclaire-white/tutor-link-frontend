// src/app/(commonLayout)/handbook/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tutor Handbook | TutorLink',
};

export default function HandbookPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Tutor Handbook</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Your comprehensive guide to success on TutorLink.
      </p>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        
        <h2 className="text-2xl font-bold mt-8 mb-4">Getting Started</h2>
        <p>
            Learn how to create a compelling tutor profile, set your rates, and list your first subjects. A complete profile with a friendly photo and detailed bio is key to attracting students.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">Conducting Sessions</h2>
        <ul className="list-disc pl-6 space-y-2">
            <li><strong>Preparation:</strong> Always review the topic beforehand if the student has provided it.</li>
            <li><strong>Punctuality:</strong> Be on time for every scheduled session.</li>
            <li><strong>Communication:</strong> Keep communication clear and professional through our messaging platform.</li>
            <li><strong>Environment:</strong> Ensure a quiet, well-lit space for video sessions.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Platform Policies</h2>
        <p>
            Understand our payment processing, cancellation policies, and code of conduct to ensure a smooth experience for everyone.
        </p>
      </div>
    </div>
  );
}
