import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | TutorLink",
  description: "Learn how TutorLink collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, such as when you create an account, update your profile, book a session, or communicate with us. This may include your name, email address, payment information, and any other information you choose to provide.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services, including to:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Facilitate connections between students and tutors.</li>
            <li>Process payments and send you related information.</li>
            <li>Send you technical notices, updates, security alerts, and support messages.</li>
            <li>Respond to your comments, questions, and customer service requests.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">3. Sharing of Information</h2>
          <p>
            We do not share your personal information with third parties except as described in this policy. We may share information with tutors or students as necessary to facilitate your sessions, or with third-party service providers who help us operate our business.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">4. Security</h2>
          <p>
            We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at support@tutorlink.com.
          </p>
        </section>
      </div>
    </div>
  );
}
