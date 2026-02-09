'use client';

import Link from "next/link";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export function BecomeTutorCTA() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await authClient.getSession();
        const sessionData = result?.data;
        if (sessionData?.user) {
          setUser(sessionData.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Hide this section if user is already a tutor
  if (!loading && user?.role === 'TUTOR') {
    return null;
  }

  return (
    <section className="py-16 md:py-20 bg-muted/40">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Share Your Knowledge?
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join our community of expert tutors and earn while helping students reach their goals. Set your own rates and schedule.
        </p>
        <Button size="lg" className="text-lg px-10" asChild>
          <Link href="/become-tutor">Become a Tutor</Link>
        </Button>
      </div>
    </section>
  );
}