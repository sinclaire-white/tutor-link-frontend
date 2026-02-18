import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | TutorLink",
  description: "Terms and conditions for using TutorLink.",
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using TutorLink, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">2. Description of Service</h2>
          <p>
            TutorLink is a platform that connects students with independent tutors for online learning sessions. We do not provide tutoring services ourselves but facilitate the connection, scheduling, and payment between users.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">3. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">4. Conduct</h2>
          <p>
            You agree not to use the service for any unlawful purpose or in any way that interrupts, damages, or impairs the service. Harassment, abuse, or inappropriate behavior towards other users is strictly prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">5. Disclaimer of Warranties</h2>
          <p>
            The service is provided "as is" and "as available" without any warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability or fitness for a particular purpose.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">6. Limitation of Liability</h2>
          <p>
            In no event shall TutorLink be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>
        </section>
      </div>
    </div>
  );
}
