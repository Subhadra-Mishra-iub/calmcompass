'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Emotion {
  id: string;
  name: string;
  actions: Action[];
}

interface Action {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  createdAt: string;
}

interface EmotionsManagerProps {
  userId: string;
}

export default function EmotionsManager({ userId }: EmotionsManagerProps) {
  const router = useRouter();
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddEmotion, setShowAddEmotion] = useState(false);
  const [newEmotionName, setNewEmotionName] = useState('');
  const [expandedEmotion, setExpandedEmotion] = useState<string | null>(null);
  const [editingAction, setEditingAction] = useState<string | null>(null);
  const [newAction, setNewAction] = useState({ title: '', description: '', url: '' });
  const [expandedActions, setExpandedActions] = useState<Set<string>>(new Set());

  const fetchEmotions = useCallback(async () => {
    try {
      const response = await fetch(`/api/emotions?userId=${userId}`);
      if (!response.ok) {
        console.error('Failed to fetch emotions:', response.status);
        return;
      }
      const data = await response.json();
      
      const emotionsWithActions = await Promise.all(
        (data.emotions || []).map(async (emotion: { id: string; name: string }) => {
          try {
            const actionsResponse = await fetch(`/api/actions?emotionId=${emotion.id}`);
            if (!actionsResponse.ok) {
              console.error(`Failed to fetch actions for emotion ${emotion.id}:`, actionsResponse.status);
              return {
                ...emotion,
                actions: [],
              };
            }
            const actionsData = await actionsResponse.json();
            return {
              ...emotion,
              actions: actionsData.actions || [],
            };
          } catch (error) {
            console.error(`Error fetching actions for emotion ${emotion.id}:`, error);
            return {
              ...emotion,
              actions: [],
            };
          }
        })
      );
      
      setEmotions(emotionsWithActions);
    } catch (error) {
      console.error('Error fetching emotions:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchEmotions();
  }, [fetchEmotions]);

  const handleAddEmotion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmotionName.trim()) return;

    try {
      const response = await fetch('/api/emotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newEmotionName.trim() }),
      });

      if (response.ok) {
        setNewEmotionName('');
        setShowAddEmotion(false);
        fetchEmotions();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to create emotion');
      }
    } catch (error) {
      console.error('Error creating emotion:', error);
      alert('Failed to create emotion');
    }
  };

  const handleDeleteEmotion = async (emotionId: string) => {
    if (!confirm('Are you sure you want to delete this emotion? This will also delete all associated actions.')) {
      return;
    }

    try {
      const response = await fetch(`/api/emotions/${emotionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchEmotions();
      } else {
        alert('Failed to delete emotion');
      }
    } catch (error) {
      console.error('Error deleting emotion:', error);
      alert('Failed to delete emotion');
    }
  };

  const handleAddAction = async (emotionId: string) => {
    if (!newAction.title.trim()) return;

    try {
      const response = await fetch('/api/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emotionId,
          title: newAction.title.trim(),
          description: newAction.description.trim() || null,
          url: newAction.url.trim() || null,
        }),
      });

      if (response.ok) {
        setNewAction({ title: '', description: '', url: '' });
        setEditingAction(null);
        await fetchEmotions();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to create action');
      }
    } catch (error) {
      console.error('Error creating action:', error);
      alert('Failed to create action');
    }
  };

  const handleDeleteAction = async (actionId: string) => {
    if (!confirm('Are you sure you want to delete this action?')) {
      return;
    }

    try {
      const response = await fetch(`/api/actions/${actionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchEmotions();
      } else {
        alert('Failed to delete action');
      }
    } catch (error) {
      console.error('Error deleting action:', error);
      alert('Failed to delete action');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading emotions...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Your Emotions</h2>
        <button
          onClick={() => setShowAddEmotion(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          Add Emotion
        </button>
      </div>

      {showAddEmotion && (
        <div className="bg-white p-4 rounded-lg shadow border">
          <form onSubmit={handleAddEmotion} className="flex gap-2">
            <input
              type="text"
              value={newEmotionName}
              onChange={(e) => setNewEmotionName(e.target.value)}
              placeholder="Emotion name (e.g., Anxious, Happy, Stressed)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder:text-gray-400"
              autoFocus
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddEmotion(false);
                setNewEmotionName('');
              }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {emotions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No emotions yet. Create your first emotion to get started!
        </div>
      ) : (
        <div className="space-y-4">
          {emotions.map((emotion) => (
            <div key={emotion.id} className="bg-white rounded-lg shadow border">
              <div className={`p-4 flex justify-between items-center ${emotion.actions.length > 0 ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''}`}>
                <button
                  onClick={() => setExpandedEmotion(expandedEmotion === emotion.id ? null : emotion.id)}
                  className="flex-1 text-left"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{emotion.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-sm font-medium ${emotion.actions.length > 0 ? 'text-indigo-700' : 'text-gray-500'}`}>
                      {emotion.actions.length === 0 ? (
                        'No actions yet'
                      ) : (
                        <>
                          <span className="font-semibold">{emotion.actions.length}</span> action{emotion.actions.length !== 1 ? 's' : ''} associated
                        </>
                      )}
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => handleDeleteEmotion(emotion.id)}
                  className="text-red-600 hover:text-red-700 px-3 py-1 text-sm"
                >
                  Delete
                </button>
              </div>

              {expandedEmotion === emotion.id && (
                <div className="border-t p-4 space-y-3">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900">Associated Actions</h4>
                    <button
                      onClick={() => setEditingAction(editingAction === emotion.id ? null : emotion.id)}
                      className="text-indigo-600 hover:text-indigo-700 text-sm cursor-pointer"
                    >
                      {editingAction === emotion.id ? 'Cancel' : 'Add Action'}
                    </button>
                  </div>

                  {editingAction === emotion.id && (
                    <div className="bg-gray-50 p-3 rounded space-y-2">
                      <input
                        type="text"
                        value={newAction.title}
                        onChange={(e) => setNewAction({ ...newAction, title: e.target.value })}
                        placeholder="Action title (required)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder:text-gray-400"
                      />
                      <textarea
                        value={newAction.description}
                        onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
                        placeholder="Description (optional)"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder:text-gray-400"
                      />
                      <input
                        type="url"
                        value={newAction.url}
                        onChange={(e) => setNewAction({ ...newAction, url: e.target.value })}
                        placeholder="URL (optional)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder:text-gray-400"
                      />
                      <button
                        onClick={() => handleAddAction(emotion.id)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm cursor-pointer"
                      >
                        Add Action
                      </button>
                    </div>
                  )}

                  {emotion.actions.length === 0 ? (
                    <p className="text-sm text-gray-500">No actions yet. Add your first action!</p>
                  ) : (
                    <ul className="space-y-2">
                      {emotion.actions.map((action) => {
                        const isExpanded = expandedActions.has(action.id);
                        const hasMoreContent = action.description || action.url;
                        const firstLine = action.description ? action.description.split('\n')[0] : '';
                        
                        const formatDate = (dateString: string) => {
                          const date = new Date(dateString);
                          const now = new Date();
                          const diffTime = Math.abs(now.getTime() - date.getTime());
                          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                          
                          if (diffDays === 0) {
                            return 'Added today';
                          } else if (diffDays === 1) {
                            return 'Added yesterday';
                          } else if (diffDays < 7) {
                            return `Added ${diffDays} days ago`;
                          } else {
                            return `Added ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined })}`;
                          }
                        };
                        
                        return (
                          <li key={action.id} className="flex justify-between items-start p-3 bg-gray-50 rounded border border-gray-200">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <div className="font-medium text-gray-900">{action.title}</div>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500">{formatDate(action.createdAt)}</span>
                              </div>
                              {action.description && (
                                <div className="text-sm text-gray-600 mt-1">
                                  {isExpanded || !hasMoreContent ? (
                                    action.description
                                  ) : (
                                    <>
                                      {firstLine}
                                      {action.description.length > firstLine.length && '...'}
                                    </>
                                  )}
                                </div>
                              )}
                              {action.url && (isExpanded || !action.description) && (
                                <a
                                  href={action.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-indigo-600 hover:text-indigo-700 mt-1 inline-block break-all"
                                >
                                  {action.url}
                                </a>
                              )}
                              {hasMoreContent && (
                                <button
                                  onClick={() => {
                                    setExpandedActions((prev) => {
                                      const next = new Set(prev);
                                      if (next.has(action.id)) {
                                        next.delete(action.id);
                                      } else {
                                        next.add(action.id);
                                      }
                                      return next;
                                    });
                                  }}
                                  className="text-sm text-indigo-600 hover:text-indigo-700 mt-2 cursor-pointer"
                                >
                                  {isExpanded ? 'Show less' : 'Show more'}
                                </button>
                              )}
                            </div>
                            <button
                              onClick={() => handleDeleteAction(action.id)}
                              className="text-red-600 hover:text-red-700 ml-4 text-sm cursor-pointer"
                            >
                              Delete
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

