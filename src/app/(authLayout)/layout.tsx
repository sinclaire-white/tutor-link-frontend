// app/(auth)/layout.tsx
import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      {/* Back to home button */}
      <div className="absolute top-6 left-6 z-10">
        <Button variant="ghost" size="sm" asChild>
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </Button>
      </div>

      {/* Main centered content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Small branding – reduced margin below */}
          <div className="text-center mb-3">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-bold tracking-tight">
                <span className="text-primary">Tutor</span>Link
              </span>
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              Your path to better learning
            </p>
          </div>
          {children}
        </div>
      </div>

      {/* Simple footer */}
      <footer className="py-6 text-center text-xs text-muted-foreground border-t">
        © {new Date().getFullYear()} TutorLink. All rights reserved.
      </footer>
    </div>
  );
}