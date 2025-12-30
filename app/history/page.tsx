import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import HistoryView from '@/components/HistoryView';

export default async function HistoryPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={session.user.name || undefined} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Check-in History</h1>
          <p className="text-gray-600 mt-2">
            Review your past emotional check-ins and completed actions.
          </p>
        </div>
        <HistoryView userId={session.user.id} />
      </main>
    </div>
  );
}




