'use client';

import { useState, useEffect } from 'react';

interface CheckIn {
  id: string;
  emotion: {
    id: string;
    name: string;
  };
  notes: string | null;
  createdAt: string;
  checkInActions: Array<{
    id: string;
    completed: boolean;
    action: {
      id: string;
      title: string;
      description: string | null;
    };
  }>;
}

interface Emotion {
  id: string;
  name: string;
}

interface HistoryViewProps {
  userId: string;
}

export default function HistoryView({ userId }: HistoryViewProps) {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmotionId, setSelectedEmotionId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [expandedCheckIns, setExpandedCheckIns] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchEmotions();
  }, []);

  useEffect(() => {
    fetchCheckIns();
  }, [selectedEmotionId, startDate, endDate]);

  const fetchEmotions = async () => {
    try {
      const response = await fetch(`/api/emotions?userId=${userId}`);
      const data = await response.json();
      setEmotions(data.emotions || []);
    } catch (error) {
      console.error('Error fetching emotions:', error);
    }
  };

  const fetchCheckIns = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedEmotionId) params.append('emotionId', selectedEmotionId);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`/api/check-ins/history?${params.toString()}`);
      const data = await response.json();
      setCheckIns(data.checkIns || []);
    } catch (error) {
      console.error('Error fetching check-ins:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const clearFilters = () => {
    setSelectedEmotionId('');
    setStartDate('');
    setEndDate('');
  };

  const toggleExpand = (checkInId: string) => {
    setExpandedCheckIns((prev) => {
      const next = new Set(prev);
      if (next.has(checkInId)) {
        next.delete(checkInId);
      } else {
        next.add(checkInId);
      }
      return next;
    });
  };

  const getFirstLine = (text: string): string => {
    const lines = text.split('\n');
    return lines[0] || text;
  };

  if (loading) {
    return <div className="text-center py-8">Loading history...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="emotion" className="block text-sm font-medium text-gray-700 mb-1">
              Emotion
            </label>
            <select
              id="emotion"
              value={selectedEmotionId}
              onChange={(e) => setSelectedEmotionId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            >
              <option value="">All emotions</option>
              {emotions.map((emotion) => (
                <option key={emotion.id} value={emotion.id}>
                  {emotion.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {checkIns.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow border">
          No check-ins found. Start tracking your emotions by creating a check-in from the dashboard!
        </div>
      ) : (
        <div className="space-y-4">
          {checkIns.map((checkIn) => {
            const completedActions = checkIn.checkInActions.filter(cia => cia.completed);
            const isExpanded = expandedCheckIns.has(checkIn.id);
            const hasNotes = checkIn.notes && checkIn.notes.trim().length > 0;
            const hasActions = completedActions.length > 0;
            const shouldShowExpand = hasNotes || hasActions;
            const notesPreview = hasNotes ? getFirstLine(checkIn.notes!) : '';
            const notesFull = hasNotes && notesPreview.length < checkIn.notes!.length;
            
            return (
              <div key={checkIn.id} className="bg-white rounded-lg shadow border p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {checkIn.emotion.name}
                      </h3>
                      {shouldShowExpand && (
                        <button
                          onClick={() => toggleExpand(checkIn.id)}
                          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium ml-4"
                        >
                          {isExpanded ? 'Show less' : 'Show more'}
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-3">
                      {formatDate(checkIn.createdAt)}
                    </p>

                    {hasNotes && (
                      <div className={`mb-3 ${!isExpanded ? '' : 'p-3 bg-gray-50 rounded'}`}>
                        <p className="text-gray-900 whitespace-pre-wrap">
                          {isExpanded ? checkIn.notes : notesPreview}
                          {!isExpanded && notesFull && '...'}
                        </p>
                      </div>
                    )}

                    {isExpanded && hasActions && (
                      <div className="mt-3">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Completed Actions ({completedActions.length})
                        </h4>
                        <ul className="space-y-2">
                          {completedActions.map((cia) => (
                            <li key={cia.id} className="flex items-start">
                              <span className="text-green-600 mr-2">✓</span>
                              <div>
                                <span className="text-gray-900 font-medium">{cia.action.title}</span>
                                {cia.action.description && (
                                  <span className="text-gray-600 text-sm ml-2">
                                    - {cia.action.description}
                                  </span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

