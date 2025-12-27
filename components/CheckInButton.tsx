'use client';

import { useState } from 'react';
import CheckInModal from './CheckInModal';

interface CheckInButtonProps {
  userId: string;
}

export default function CheckInButton({ userId }: CheckInButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleComplete = () => {
    setRefreshKey((prev) => prev + 1);
    // Optionally refresh the page or update data
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-lg text-lg shadow-lg transition-colors"
        >
          How are we feeling today?
        </button>
      </div>
      <CheckInModal
        key={refreshKey}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onComplete={handleComplete}
        userId={userId}
      />
    </>
  );
}


