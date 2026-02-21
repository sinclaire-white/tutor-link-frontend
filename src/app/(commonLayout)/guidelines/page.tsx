import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Teaching Guidelines | TutorLink',
};

export default function GuidelinesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Teaching Guidelines</h1>
      <p className="text-xl text-muted-foreground mb-8">
        We are committed to providing a safe, respectful, and effective learning environment for all students and tutors.
      </p>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        
        <h2 className="text-2xl font-bold mt-8 mb-4">Professionalism</h2>
        <p>
            Tutors are expected to maintain a professional demeanor at all times. This includes dressing appropriately, using respectful language, and creating a supportive learning environment.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">Integrity</h2>
        <ul className="list-disc pl-6 space-y-2">
            <li><strong>Accuracy:</strong> Ensure all information provided on your profile and during sessions is accurate.</li>
            <li><strong>Academic Honesty:</strong> Do not complete assignments or take exams for students. Tutoring is about guiding the learning process.</li>
            <li><strong>Fairness:</strong> Treat all students equitably and with respect.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Safety</h2>
        <p>
            Report any inappropriate behavior or content immediately. Keep all communication and transactions within the TutorLink platform for your safety and protection.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Effectiveness</h2>
        <p>
            Tailor your teaching approach to the individual needs of each student. Be patient, encouraging, and clear in your explanations.
        </p>
      </div>
    </div>
  );
}
