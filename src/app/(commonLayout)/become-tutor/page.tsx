'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

const categories = ['Math', 'Science', 'English', 'History', 'Languages', 'Programming', 'Music', 'Art'];

export default function BecomeTutorPage() {
  const [user, setUser] = useState<{name?: string; role?: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const [formData, setFormData] = useState({
    bio: '',
    qualifications: '',
    hourlyRate: '',
    category: 'Math',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await authClient.getSession();
        const sessionData = result?.data;
        if (!sessionData?.user) {
          router.push('/sign-in');
          return;
        }
        setUser(sessionData.user);
      } catch {
        router.push('/sign-in');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus('idle');

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBase}/api/v1/tutors/apply`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio: formData.bio,
          qualifications: formData.qualifications,
          hourlyRate: parseFloat(formData.hourlyRate),
          categoryId: formData.category,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Your tutor application has been submitted! We\'ll review it shortly.');
        setFormData({ bio: '', qualifications: '', hourlyRate: '', category: 'Math' });
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        const error = await response.json();
        setStatus('error');
        setMessage(error.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Application error:', error);
      setStatus('error');
      setMessage('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  // Check if user is already a tutor (has a tutor profile)
  if (user?.role === 'TUTOR') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Already a Tutor</CardTitle>
            <CardDescription>You&apos;re already registered as a tutor!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Visit your tutor dashboard to manage your profile, bookings, and earnings.
            </p>
            <Button className="w-full" asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-linear-to-b from-muted/30 to-background py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl">Become a Tutor</CardTitle>
            <CardDescription>
              Share your expertise and start earning. Fill out the form below to apply as a tutor.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {status === 'success' && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-100">
                {message}
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-100">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category */}
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Primary Subject/Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-medium">
                  Bio / About You
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell students about yourself, your teaching experience, and what makes you a great tutor..."
                  rows={5}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  required
                />
              </div>

              {/* Qualifications */}
              <div className="space-y-2">
                <label htmlFor="qualifications" className="text-sm font-medium">
                  Qualifications & Certifications
                </label>
                <textarea
                  id="qualifications"
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleInputChange}
                  placeholder="E.g., Bachelor's in Mathematics, TEFL Certification, etc."
                  rows={3}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* Hourly Rate */}
              <div className="space-y-2">
                <label htmlFor="hourlyRate" className="text-sm font-medium">
                  Hourly Rate ($)
                </label>
                <Input
                  id="hourlyRate"
                  name="hourlyRate"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="50"
                  value={formData.hourlyRate}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This is your asking rate. Students may negotiate.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full"
                size="lg"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Your application will be reviewed by our team. You&apos;ll receive an email once approved.
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Set Your Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You have full control over your hourly rate. Adjust it anytime to match your experience level.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Build Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create a compelling profile with your qualifications and teaching style to attract more students.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Earn & Grow</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Earn money while helping students. Higher ratings lead to more bookings and opportunities.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
