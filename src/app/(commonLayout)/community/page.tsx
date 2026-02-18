// src/app/(commonLayout)/community/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tutor Community | TutorLink',
};

export default function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-12 text-center max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Tutor Community</h1>
      <p className="text-xl text-muted-foreground mb-12">
        A place for our thousands of tutors to connect, share tips, and grow together.
      </p>

      <div className="bg-muted p-8 rounded-xl">
        <h2 className="text-2xl font-semibold mb-4">Coming Soon!</h2>
        <p className="text-muted-foreground">
          We are building a vibrant community space for our tutors. Stay tuned for updates!
        </p>
      </div>
    </div>
  );
}
