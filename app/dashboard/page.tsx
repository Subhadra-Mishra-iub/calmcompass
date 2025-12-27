import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import CheckInModal from '@/components/CheckInModal';
import CheckInButton from '@/components/CheckInButton';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={session.user.name || undefined} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {session.user.name}!
          </h1>
          <p className="text-gray-600">
            Take a moment to check in with yourself today.
          </p>
        </div>
        <CheckInButton userId={session.user.id} />
        
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
            <p className="text-sm text-indigo-900">
              <span className="font-semibold">💬 Chat with our AI Assistant!</span> 
              {' '}Create some emotions and check-ins to get personalized support and recommendations based on your emotional patterns. Look for the chat icon in the bottom-right corner.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

