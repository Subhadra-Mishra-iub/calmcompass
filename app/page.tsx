import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-2xl text-center">
        <h1 className="mb-4 text-5xl font-bold text-gray-900">
          CalmCompass
        </h1>
        <p className="mb-8 text-xl text-gray-700">
          Your daily emotional well-being companion
        </p>
        <p className="mb-12 text-lg text-gray-600">
          Track your emotions, manage your actions, and build healthier habits
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/signup"
            className="rounded-lg bg-indigo-600 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="rounded-lg border-2 border-indigo-600 px-8 py-3 text-lg font-semibold text-indigo-600 transition-colors hover:bg-indigo-50"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
