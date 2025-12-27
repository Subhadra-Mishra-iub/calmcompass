# Step-by-Step Guide: Implementing Rule-Based Chatbot

This guide will help you implement a free, rule-based chatbot that provides personalized recommendations based on user check-in history.

## Overview

The chatbot will:
- Respond to user messages about their current feelings
- Analyze their past check-ins for the same emotion
- Show when they felt that way before and what helped
- Provide personalized suggestions based on their history

**Example Interactions:**
- User: "I'm feeling Happy today"
- Bot: "Great! You felt happy on December 20th and December 15th. You mentioned feeling grateful and accomplished. Keep doing what makes you happy!"

- User: "I'm feeling sad today"
- Bot: "I see you felt sad on December 18th and December 12th. You tried taking a walk and calling a friend, and you felt better afterwards. Would you like to try those actions again?"

## Step 1: Create the API Route

Create a new file: `app/api/chatbot/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message } = await request.json();
    const userId = session.user.id;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Extract emotion from message (simple pattern matching)
    const messageLower = message.toLowerCase();
    const emotions = await db.emotion.findMany({
      where: { userId },
    });

    // Try to find mentioned emotion in user's message
    let mentionedEmotion: { id: string; name: string } | null = null;
    for (const emotion of emotions) {
      if (messageLower.includes(emotion.name.toLowerCase())) {
        mentionedEmotion = emotion;
        break;
      }
    }

    // If no emotion found, look for common emotion keywords
    if (!mentionedEmotion) {
      const emotionKeywords: Record<string, string[]> = {
        happy: ['happy', 'joy', 'joyful', 'glad', 'cheerful', 'excited'],
        sad: ['sad', 'down', 'depressed', 'unhappy', 'blue', 'melancholy'],
        anxious: ['anxious', 'worried', 'nervous', 'stressed', 'tense'],
        angry: ['angry', 'mad', 'furious', 'irritated', 'annoyed'],
        stressed: ['stressed', 'overwhelmed', 'pressured', 'burned out'],
      };

      for (const [emotionName, keywords] of Object.entries(emotionKeywords)) {
        if (keywords.some(keyword => messageLower.includes(keyword))) {
          // Try to find this emotion in user's emotions
          const foundEmotion = emotions.find(
            e => e.name.toLowerCase() === emotionName
          );
          if (foundEmotion) {
            mentionedEmotion = foundEmotion;
            break;
          }
        }
      }
    }

    // Get user's check-ins (last 60 days for better context)
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const allCheckIns = await db.checkIn.findMany({
      where: {
        userId,
        createdAt: { gte: sixtyDaysAgo },
      },
      include: {
        emotion: true,
        checkInActions: {
          include: {
            action: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Generate response
    let response = '';

    if (mentionedEmotion) {
      // Find past check-ins with this emotion
      const pastCheckIns = allCheckIns.filter(
        checkIn => checkIn.emotionId === mentionedEmotion!.id
      );

      if (pastCheckIns.length > 0) {
        // Format dates
        const formatDate = (date: Date) => {
          return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
          });
        };

        // Get dates when they felt this way
        const dates = pastCheckIns
          .slice(0, 3) // Last 3 occurrences
          .map(checkIn => formatDate(checkIn.createdAt))
          .join(', ');

        // Get notes from past check-ins
        const notes = pastCheckIns
          .filter(checkIn => checkIn.notes)
          .slice(0, 2)
          .map(checkIn => checkIn.notes);

        // Get actions they completed
        const completedActions = new Set<string>();
        pastCheckIns.forEach(checkIn => {
          checkIn.checkInActions
            .filter(cia => cia.completed)
            .forEach(cia => {
              completedActions.add(cia.action.title);
            });
        });
        const actionList = Array.from(completedActions).slice(0, 3);

        // Build response based on emotion type
        const emotionLower = mentionedEmotion.name.toLowerCase();
        
        if (emotionLower.includes('happy') || emotionLower.includes('joy') || emotionLower.includes('good')) {
          response = `Great to hear you're feeling ${mentionedEmotion.name} today! `;
          if (pastCheckIns.length > 1) {
            response += `You felt ${mentionedEmotion.name} on ${dates} too. `;
          }
          if (notes.length > 0) {
            response += `You mentioned feeling grateful and positive on those days. `;
          }
          response += `Keep doing what makes you happy!`;
        } else if (emotionLower.includes('sad') || emotionLower.includes('down') || emotionLower.includes('unhappy')) {
          response = `I understand you're feeling ${mentionedEmotion.name} today. `;
          if (pastCheckIns.length > 1) {
            response += `You felt ${mentionedEmotion.name} on ${dates} too. `;
          }
          if (actionList.length > 0) {
            response += `On those days, you tried ${actionList.join(', ')} and felt better afterwards. `;
            response += `Would you like to try those actions again?`;
          } else {
            response += `Remember that it's okay to feel this way. Consider trying some of the actions you've set up for this emotion.`;
          }
        } else if (emotionLower.includes('anxious') || emotionLower.includes('worried') || emotionLower.includes('stressed')) {
          response = `I see you're feeling ${mentionedEmotion.name} today. `;
          if (pastCheckIns.length > 1) {
            response += `You felt ${mentionedEmotion.name} on ${dates} too. `;
          }
          if (actionList.length > 0) {
            response += `You found ${actionList.join(', ')} helpful in those moments. `;
            response += `Those might help you now as well.`;
          } else {
            response += `Take some deep breaths. Consider trying the actions you've set up for managing this feeling.`;
          }
        } else {
          // Generic response for other emotions
          response = `I see you're feeling ${mentionedEmotion.name} today. `;
          if (pastCheckIns.length > 1) {
            response += `You felt ${mentionedEmotion.name} on ${dates} too. `;
          }
          if (actionList.length > 0) {
            response += `You tried ${actionList.join(', ')} on those days. `;
            response += `Those might be helpful now as well.`;
          } else {
            response += `Consider trying some of the actions you've set up for this emotion.`;
          }
        }
      } else {
        // First time feeling this emotion (or first time in 60 days)
        response = `I see you're feeling ${mentionedEmotion.name} today. `;
        response += `This is the first time you've checked in with this emotion recently. `;
        response += `Consider trying some of the actions you've set up for this emotion - they can really help!`;
      }
    } else {
      // No emotion mentioned or found
      if (messageLower.includes('help') || messageLower.includes('suggestion')) {
        // Analyze overall patterns
        if (allCheckIns.length > 0) {
          const emotionCounts = new Map<string, number>();
          allCheckIns.forEach(checkIn => {
            const emotionName = checkIn.emotion.name;
            emotionCounts.set(emotionName, (emotionCounts.get(emotionName) || 0) + 1);
          });

          let mostCommonEmotion = '';
          let maxCount = 0;
          emotionCounts.forEach((count, emotion) => {
            if (count > maxCount) {
              maxCount = count;
              mostCommonEmotion = emotion;
            }
          });

          if (mostCommonEmotion && maxCount >= 3) {
            response = `I've noticed you've been feeling "${mostCommonEmotion}" quite often (${maxCount} times recently). `;
            response += `Consider focusing on actions that help with ${mostCommonEmotion.toLowerCase()}. `;
            response += `Would you like me to suggest some actions?`;
          } else {
            response = `You've been checking in regularly - that's great! `;
            response += `How are you feeling today? I can provide personalized suggestions based on your check-in history.`;
          }
        } else {
          response = `Welcome! Start by creating a check-in to track how you're feeling. `;
          response += `Once you have some check-in history, I can provide personalized recommendations!`;
        }
      } else {
        // Generic helpful response
        response = `I'm here to help! Try mentioning how you're feeling (like "I'm feeling happy" or "I'm feeling sad") `;
        response += `and I can provide personalized suggestions based on your past check-ins.`;
      }
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chatbot error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
```

## Step 2: Create the Chatbot Component

Create a new file: `components/Chatbot.tsx`

```typescript
'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      text: "Hi! I'm here to help. Tell me how you're feeling today, and I'll provide personalized suggestions based on your check-in history.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [...prev, { role: 'bot', text: data.response }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'bot',
            text: 'Sorry, I encountered an error. Please try again.',
          },
        ]);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg transition-colors"
        aria-label="Open chat"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h3 className="font-semibold">CalmCompass Assistant</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-200 text-xl font-bold"
          aria-label="Close chat"
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 h-96">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2">
              <span className="inline-flex items-center">
                Thinking
                <span className="ml-1 animate-pulse">...</span>
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
```

## Step 3: Add Chatbot to Dashboard

Edit `app/dashboard/page.tsx`:

Add the import at the top:
```typescript
import Chatbot from '@/components/Chatbot';
```

Add the component at the end of the return statement (before closing the main div):
```typescript
<Chatbot />
```

The dashboard page should look something like this:

```typescript
// ... existing imports ...
import Chatbot from '@/components/Chatbot';

export default async function DashboardPage() {
  // ... existing code ...

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={session.user.name || undefined} />
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* ... existing dashboard content ... */}
        <CheckInButton userId={session.user.id} />
        {/* ... rest of content ... */}
      </div>
      <Chatbot />
    </div>
  );
}
```

## Step 4: Test the Chatbot

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Login to your app** at `http://localhost:3000`

3. **Create some check-ins** with different emotions and notes (if you haven't already)

4. **Open the chatbot** by clicking the chat icon in the bottom right

5. **Test these messages:**
   - "I'm feeling happy today"
   - "I'm feeling sad today"
   - "I'm feeling anxious"
   - "Can you help me?"

6. **Verify responses:**
   - The bot should recognize the emotion
   - It should show past dates when you felt that way
   - It should mention actions you tried
   - It should provide personalized suggestions

## Step 5: Customize Responses (Optional)

You can customize the response logic in `app/api/chatbot/route.ts`:

- Add more emotion keywords
- Change the date formatting
- Adjust how many past check-ins to reference
- Modify the response templates
- Add more sophisticated pattern analysis

## Troubleshooting

**Bot doesn't recognize emotions:**
- Make sure the emotion names in your messages match the emotion names you created
- Check that emotions are case-insensitive in the matching logic

**No past check-ins found:**
- Create some check-ins first
- Check that check-ins are being saved correctly
- Verify the date range (currently 60 days)

**Responses are generic:**
- Ensure you have check-ins with notes or completed actions
- The bot works better with more historical data

**Component not showing:**
- Verify Chatbot component is imported and added to dashboard
- Check browser console for errors
- Make sure the component path is correct

## Next Steps

Once the rule-based chatbot is working:

1. **Test thoroughly** with different scenarios
2. **Refine response templates** based on user feedback
3. **Add more sophisticated pattern analysis** (trends, correlations)
4. **Consider adding AI enhancement** later (see CHATBOT_IMPLEMENTATION.md)

## Summary

You now have a fully functional, free chatbot that:
- ✅ Recognizes emotions from user messages
- ✅ Analyzes past check-ins for the same emotion
- ✅ Shows when they felt that way before
- ✅ Mentions actions they tried
- ✅ Provides personalized recommendations
- ✅ Works 100% free with no external APIs

The chatbot appears as a floating button in the bottom right corner and opens into a chat interface when clicked.

