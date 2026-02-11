// app/about/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Award, Calendar, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'About Us | TutorLink',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">About TutorLink</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connecting students with expert tutors for personalized learning experiences.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 py-8 border-y">
          {[
            { value: '10K+', label: 'Students' },
            { value: '500+', label: 'Tutors' },
            { value: '50+', label: 'Subjects' },
            { value: '98%', label: 'Success' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {[
            { icon: Users, title: 'Expert Tutors', desc: 'Vetted professionals with proven experience.' },
            { icon: BookOpen, title: 'Personalized Learning', desc: 'Lessons tailored to your pace and style.' },
            { icon: Award, title: 'Proven Results', desc: 'Structured plans with measurable progress.' },
            { icon: Calendar, title: 'Flexible Schedule', desc: 'Book sessions that fit your calendar.' },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="p-2 h-fit rounded-md bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to learn?</h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of students achieving their goals.
          </p>
          <Button asChild>
            <Link href="/tutors">
              Find a Tutor
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}