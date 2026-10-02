import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export default async function SenaCmsIndexPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect('/senacms/dashboard');
  } else {
    redirect('/senacms/login');
  }
}
