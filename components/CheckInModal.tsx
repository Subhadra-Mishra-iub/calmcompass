'use client';

import { useState, useEffect } from 'react';

interface Emotion {
  id: string;
  name: string;
}

interface Action {
  id: string;
  title: string;
  description: string | null;
}

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  userId: string;
}

export default function CheckInModal({ isOpen, onClose, onComplete, userId }: CheckInModalProps) {
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [selectedEmotionId, setSelectedEmotionId] = useState<string>('');
  const [actions, setActions] = useState<Action[]>([]);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingEmotions, setLoadingEmotions] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchEmotions();
    }
  }, [isOpen, userId]);

  useEffect(() => {
    if (selectedEmotionId) {
      fetchActions(selectedEmotionId);
    } else {
      setActions([]);
      setCompletedActions(new Set());
    }
  }, [selectedEmotionId]);

  const fetchEmotions = async () => {
    try {
      const response = await fetch(`/api/emotions?userId=${userId}`);
      const data = await response.json();
      setEmotions(data.emotions || []);
    } catch (error) {
      console.error('Error fetching emotions:', error);
    } finally {
      setLoadingEmotions(false);
    }
  };

  const fetchActions = async (emotionId: string) => {
    try {
      const response = await fetch(`/api/actions?emotionId=${emotionId}`);
      const data = await response.json();
      setActions(data.actions || []);
      setCompletedActions(new Set());
    } catch (error) {
      console.error('Error fetching actions:', error);
    }
  };

  const toggleAction = (actionId: string) => {
    setCompletedActions((prev) => {
      const next = new Set(prev);
      if (next.has(actionId)) {
        next.delete(actionId);
      } else {
        next.add(actionId);
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmotionId) return;

    setLoading(true);
    try {
      const response = await fetch('/api/check-ins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          emotionId: selectedEmotionId,
          notes: notes.trim() || null,
          actionIds: Array.from(completedActions),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save check-in');
      }

      // Reset form
      setSelectedEmotionId('');
      setNotes('');
      setCompletedActions(new Set());
      onComplete();
      onClose();
    } catch (error) {
      console.error('Error saving check-in:', error);
      alert('Failed to save check-in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">How are we feeling today?</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="emotion" className="block text-sm font-medium text-gray-700 mb-2">
              Select an emotion
            </label>
            {loadingEmotions ? (
              <div className="text-gray-500">Loading emotions...</div>
            ) : emotions.length === 0 ? (
              <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
                <p className="text-gray-700 mb-2">No emotions found. Create emotions first to track your check-ins.</p>
                <a
                  href="/emotions"
                  className="text-indigo-600 hover:text-indigo-700 underline"
                >
                  Go to Emotions page →
                </a>
              </div>
            ) : (
              <select
                id="emotion"
                value={selectedEmotionId}
                onChange={(e) => setSelectedEmotionId(e.target.value)}
                required
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              >
                <option value="">Choose an emotion...</option>
                {emotions.map((emotion) => (
                  <option key={emotion.id} value={emotion.id}>
                    {emotion.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {selectedEmotionId && actions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Actions for this emotion (optional)
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {actions.map((action) => (
                  <label
                    key={action.id}
                    className="flex items-start p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={completedActions.has(action.id)}
                      onChange={() => toggleAction(action.id)}
                      className="mt-1 mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{action.title}</div>
                      {action.description && (
                        <div className="text-sm text-gray-600 mt-1">{action.description}</div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 placeholder:text-gray-400"
              placeholder="How are you feeling? What's on your mind?"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedEmotionId}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Check-in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

