// src/app/(commonLayout)/blog/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | TutorLink',
};

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">TutorLink Blog</h1>
      <p className="text-xl text-muted-foreground mb-12">
        Insights, tips, and stories from the TutorLink education community.
      </p>

      <div className="bg-muted p-8 rounded-xl shadow-inner mb-8">
        <h2 className="text-2xl font-semibold mb-4">Under Construction</h2>
        <p className="text-muted-foreground">
          We are preparing exciting content for you. Check back soon for articles on effective studying, online tutoring best practices, and more!
        </p>
      </div>
    </div>
  );
}
