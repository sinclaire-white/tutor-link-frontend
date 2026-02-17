import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SessionProvider } from "@/providers/SessionProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "TutorLink - Connect with Expert Tutors",
    template: "%s | TutorLink",
  },
  description: "Find and book qualified tutors for personalized learning. Connect with expert educators across various subjects and achieve your learning goals.",
  keywords: ["tutoring", "online tutors", "education", "learning", "private tutoring", "expert tutors"],
  authors: [{ name: "TutorLink Team" }],
  icons: {
    icon: "/Gemini_Generated_Image_hj5p24hj5p24hj5p.png",
    apple: "/Gemini_Generated_Image_hj5p24hj5p24hj5p.png",
  },
  openGraph: {
    title: "TutorLink - Connect with Expert Tutors",
    description: "Find and book qualified tutors for personalized learning",
    type: "website",
    images: ["/Gemini_Generated_Image_hj5p24hj5p24hj5p.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <SessionProvider>
          <ThemeProvider>
            {children}
            <Toaster richColors />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
