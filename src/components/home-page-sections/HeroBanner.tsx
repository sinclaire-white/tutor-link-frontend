// components/HeroBanner.tsx
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Star, Users, CheckCircle } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="w-full bg-background border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side: Text + CTA */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Star className="h-4 w-4 fill-primary" />
              <span>Trusted by 1000+ students worldwide</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Connect with{" "}
                <span className="text-primary">Expert Tutors</span>{" "}
                Instantly
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-lg">
                Unlock personalized learning experiences tailored to your unique
                needs and goals. Start your journey to mastery today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="text-base h-12 px-8">
                <Link href="/tutors">
                  <Search className="mr-2 h-5 w-5" />
                  Find a Tutor
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base h-12 px-8">
                <Link href="/become-tutor">Become a Tutor</Link>
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center"
                    >
                      <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-semibold">500+ Tutors</div>
                  <div className="text-muted-foreground">Ready to help</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div className="text-sm">
                  <div className="font-semibold">Verified</div>
                  <div className="text-muted-foreground">All profiles</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Image */}
          <div className="relative lg:h-125">
            <div className="relative h-100 lg:h-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80"
                alt="Students learning together"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-background border shadow-xl rounded-xl p-4 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="h-6 w-6 text-primary fill-primary" />
                </div>
                <div>
                  <div className="font-bold text-lg">4.9/5</div>
                  <div className="text-sm text-muted-foreground">Avg. Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
