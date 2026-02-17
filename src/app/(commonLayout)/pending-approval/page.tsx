// app/pending-approval/page.tsx
export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold">Application Under Review</h1>
        <p className="text-muted-foreground">
          Your tutor application has been received and is pending admin approval. 
          You&apos;ll be able to access your dashboard once approved.
        </p>
        <p className="text-sm text-muted-foreground">
          This usually takes 1-2 business days.
        </p>
      </div>
    </div>
  );
}