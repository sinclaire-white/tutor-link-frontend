
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
              <span className="text-2xl font-bold text-primary">
                TutorLink
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Empowering learners worldwide through personalized education. Connect with expert tutors and achieve your academic goals effectively.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <SocialLink href="https://twitter.com" icon={<Twitter className="h-4 w-4" />} label="Twitter" />
              <SocialLink href="https://facebook.com" icon={<Facebook className="h-4 w-4" />} label="Facebook" />
              <SocialLink href="https://instagram.com" icon={<Instagram className="h-4 w-4" />} label="Instagram" />
              <SocialLink href="https://linkedin.com" icon={<Linkedin className="h-4 w-4" />} label="LinkedIn" />
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">For Students</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><FooterLink href="/tutors">Find Tutors</FooterLink></li>
              <li><FooterLink href="/#how-it-works">How It Works</FooterLink></li>
              <li><FooterLink href="/#categories">Online Classes</FooterLink></li>
              <li><FooterLink href="/#testimonials">Success Stories</FooterLink></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">For Tutors</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><FooterLink href="/become-tutor">Become a Tutor</FooterLink></li>
              <li><FooterLink href="/community">Tutor Community</FooterLink></li>
              <li><FooterLink href="/handbook">Tutor Handbook</FooterLink></li>
              <li><FooterLink href="/guidelines">Teaching Guidelines</FooterLink></li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><FooterLink href="/about">About Us</FooterLink></li>
              <li><FooterLink href="/careers">Careers</FooterLink></li>
              <li><FooterLink href="/contact">Contact Support</FooterLink></li>
              <li><FooterLink href="/faq">FAQ</FooterLink></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} TutorLink. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded-full border border-transparent hover:border-border"
    >
      {icon}
    </a>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="hover:text-primary transition-colors block w-fit">
      {children}
    </Link>
  );
}