// src/app/(commonLayout)/cookies/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | TutorLink',
};

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
      
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">1. What are Cookies?</h2>
          <p>
            Cookies are small text files that are stored on your computer or mobile device when you visit a website. They allow the website to recognize your device and remember your preferences.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Cookies</h2>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Essential Cookies:</strong> Necessary for the operation of the website, such as enabling you to log into secure areas.</li>
            <li><strong>Performance Cookies:</strong> Collect information about how you use our website, allowing us to improve its functionality.</li>
            <li><strong>Functional Cookies:</strong> Remember your preferences and customization choices.</li>
            <li><strong>Targeting Cookies:</strong> Used to deliver advertisements relevant to you and your interests.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">3. Managing Cookies</h2>
          <p>
            Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience.
          </p>
        </section>
      </div>
    </div>
  );
}
