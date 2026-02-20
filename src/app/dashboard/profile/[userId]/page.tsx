import { redirect } from 'next/navigation';

export default function OldProfileRedirect({ params }: { params: { userId: string } }) {
  redirect(`/profile/${params.userId}`);
}
