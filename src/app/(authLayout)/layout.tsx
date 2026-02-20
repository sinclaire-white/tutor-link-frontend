import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Quote } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Column: Branding / Marketing (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-900 text-white p-12 relative overflow-hidden">
        {/* Background decorative elements */}
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-zinc-900 via-zinc-900 to-zinc-800" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "32px 32px"
          }}
        />

        {/* Content Layer */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold hover:text-white/90 transition-colors">
              <div className="relative h-10 w-10">
                <Image 
                  src="/Gemini_Generated_Image_hj5p24hj5p24hj5p.png" 
                  alt="TutorLink Logo" 
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <span className="tracking-tight">TutorLink</span>
            </Link>
            
            <div className="space-y-4 pt-8">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-white leading-tight">
                Master any subject <br/>
                <span className="text-primary-foreground/80">with expert tutors.</span>
              </h1>
              <p className="text-lg text-zinc-400 max-w-sm leading-relaxed">
                Join thousands of students and tutors on the most trusted learning platform.
              </p>
            </div>
          </div>

          <div className="relative pt-12">
            <Quote className="absolute top-4 -left-4 h-8 w-8 text-zinc-700/50 -scale-x-100 rotate-180" />
            <blockquote className="text-xl font-medium leading-relaxed italic text-zinc-200 pl-6 py-2 border-l-2 border-primary/50">
              &quot;TutorLink has completely transformed how I learn. The tutors are experts and the platform is incredibly easy to use.&quot;
            </blockquote>
            <div className="mt-6 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold border border-zinc-700">
                JD
              </div>
              <div>
                <p className="font-semibold text-white">Jane Doe</p>
                <p className="text-xs text-zinc-500">Computer Science Student</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Auth Form */}
      <div className="relative flex flex-col justify-center items-center p-8 bg-background min-h-screen">
        <div className="absolute top-4 right-4 lg:top-8 lg:right-8">
            <Button variant="ghost" asChild>
                <Link href="/" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to website
                </Link>
            </Button>
        </div>
        
        {/* Mobile Logo (only visible on small screens) */}
         <div className="absolute top-6 left-6 lg:hidden">
            <Link href="/" className="flex items-center gap-2 font-bold text-foreground">
                <div className="relative h-8 w-8">
                  <Image 
                    src="/Gemini_Generated_Image_hj5p24hj5p24hj5p.png" 
                    alt="TutorLink Logo" 
                    fill
                    sizes="32px"
                    className="object-contain"
                  />
                </div>
                <span>TutorLink</span>
            </Link>
        </div>

        <div className="w-full max-w-100 flex flex-col items-center space-y-6">
            <div className="w-full">
              {children}
            </div>
            
            <p className="px-8 text-center text-sm text-muted-foreground w-full">
              By clicking continue, you agree to our{" "}
              <Link href="/terms" className="underline underline-offset-4 hover:text-primary transition-colors">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              .
            </p>
        </div>
      </div>
    </div>
  );
}