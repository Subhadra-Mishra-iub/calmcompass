# Chatbot Implementation Guide

This document outlines options for implementing an AI chatbot feature in CalmCompass that provides personalized recommendations based on user check-in history.

## Feature Requirements

- Provide emotional support and guidance
- Recommend actions based on user's check-in history
- Fall back to general suggestions if no history exists
- Free or low-cost implementation preferred

## Implementation Options

### Option 1: Rule-Based Recommendation Engine (100% Free, Easiest)

**How it works:**
- Analyze user's recent check-ins to find patterns
- Look at most common emotions, recent trends
- Provide predefined recommendations based on patterns
- No AI/LLM needed - just logic based on data

**Pros:**
- ✅ Completely free
- ✅ Fast and reliable
- ✅ No API calls or external dependencies
- ✅ Easy to implement
- ✅ Predictable behavior
- ✅ Works offline

**Cons:**
- ❌ Less "intelligent" - follows predefined rules
- ❌ Limited natural language conversation
- ❌ Need to write recommendation logic yourself

**Implementation:**
```typescript
// Example logic:
// 1. Get user's last 30 check-ins
// 2. Count emotions (e.g., "Anxious" appears 5 times, "Happy" appears 2 times)
// 3. If "Anxious" is most common, recommend actions for anxiety
// 4. Show trending pattern: "You've been feeling anxious more often. Here are some actions..."
```

**Difficulty:** ⭐ Easy (2-3 hours)

---

### Option 2: Hugging Face Inference API (Free Tier Available)

**How it works:**
- Use Hugging Face's free inference API
- Send user's check-in history as context
- Get AI-generated recommendations
- Free tier: 30,000 requests/month

**Pros:**
- ✅ Free tier available (generous limits)
- ✅ Real AI responses
- ✅ Natural language conversation possible
- ✅ Easy to integrate (simple API calls)

**Cons:**
- ⚠️ Rate limited (but generous free tier)
- ⚠️ Requires API key setup
- ⚠️ Slightly slower than rule-based (API calls)

**Setup:**
1. Sign up at [huggingface.co](https://huggingface.co)
2. Get free API token
3. Use a model like `microsoft/DialoGPT-medium` or `gpt2` for chat
4. Send user context + conversation history

**Difficulty:** ⭐⭐ Medium (4-6 hours)

---

### Option 3: Groq API (Free Tier - Very Fast)

**How it works:**
- Use Groq's fast inference API
- Free tier: 14,400 requests/day
- Very fast responses (designed for speed)

**Pros:**
- ✅ Free tier (very generous - 14,400 requests/day)
- ✅ Extremely fast responses
- ✅ Real AI (uses Llama models)
- ✅ Good for production

**Cons:**
- ⚠️ Requires API key
- ⚠️ Need to handle API errors
- ⚠️ Free tier might have limits on model size

**Setup:**
1. Sign up at [groq.com](https://groq.com)
2. Get free API key
3. Use their fast inference API
4. Send prompts with user context

**Difficulty:** ⭐⭐ Medium (4-6 hours)

---

### Option 4: OpenAI API (Paid, but has free credits)

**How it works:**
- Use OpenAI's GPT models (GPT-3.5-turbo is cheaper)
- $5 free credits when you sign up
- Very high quality responses

**Pros:**
- ✅ Best quality AI responses
- ✅ Very natural conversation
- ✅ $5 free credits to start
- ✅ Well-documented

**Cons:**
- ❌ Costs money after free credits ($0.0015 per 1K tokens)
- ❌ More expensive for high usage
- ⚠️ Rate limits

**Cost Estimate:**
- ~$0.002 per conversation (very affordable)
- For 1000 users doing 10 conversations/month: ~$20/month
- But free credits cover initial testing

**Difficulty:** ⭐⭐ Medium (4-6 hours)

---

## Recommended Approach: Hybrid (Best of Both Worlds)

**Start with Option 1 (Rule-Based) + Add Option 2/3 later:**

1. **Phase 1 (Now)**: Implement rule-based recommendations
   - Fast to implement
   - Works immediately
   - No costs
   - Good user experience

2. **Phase 2 (Later)**: Add AI enhancement
   - Use Hugging Face or Groq free tier
   - Enhance recommendations with AI
   - Fall back to rule-based if API fails
   - Best of both worlds!

**Example Flow:**
```
User: "How should I feel better?"
System:
1. Check if user has check-in history
2. If yes, analyze patterns (rule-based)
3. Send context + pattern to AI API (if available)
4. AI generates personalized response
5. Fall back to rule-based if AI fails
```

---

## Implementation Steps (Rule-Based - Recommended to Start)

### Step 1: Create API Route

Create `app/api/chatbot/recommend/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { message } = await request.json();
  const userId = session.user.id;

  // Get user's recent check-ins (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const checkIns = await db.checkIn.findMany({
    where: {
      userId,
      createdAt: { gte: thirtyDaysAgo },
    },
    include: {
      emotion: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 30,
  });

  // Analyze patterns
  const emotionCounts = new Map<string, number>();
  checkIns.forEach((checkIn) => {
    const emotionName = checkIn.emotion.name;
    emotionCounts.set(emotionName, (emotionCounts.get(emotionName) || 0) + 1);
  });

  // Get most common emotion
  let mostCommonEmotion = '';
  let maxCount = 0;
  emotionCounts.forEach((count, emotion) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommonEmotion = emotion;
    }
  });

  // Generate recommendation based on pattern
  let recommendation = '';
  if (mostCommonEmotion && maxCount >= 3) {
    recommendation = `I've noticed you've been feeling "${mostCommonEmotion}" quite often recently (${maxCount} times in the last 30 days). `;
    // Add specific advice based on emotion
    if (mostCommonEmotion.toLowerCase().includes('anxious')) {
      recommendation += 'Consider trying some breathing exercises or taking a walk. Would you like to see actions for managing anxiety?';
    } else if (mostCommonEmotion.toLowerCase().includes('sad')) {
      recommendation += 'Remember that it\'s okay to feel this way. Consider connecting with friends or doing something you enjoy. Would you like some action suggestions?';
    }
    // ... more emotion-specific recommendations
  } else if (checkIns.length > 0) {
    const latestEmotion = checkIns[0].emotion.name;
    recommendation = `I see you recently checked in as feeling "${latestEmotion}". How are you doing with that?`;
  } else {
    recommendation = 'Welcome to CalmCompass! Start by creating a check-in to track how you\'re feeling. I can provide personalized recommendations once you have some check-in history.';
  }

  return NextResponse.json({ 
    response: recommendation,
    hasHistory: checkIns.length > 0,
    mostCommonEmotion,
  });
}
```

### Step 2: Create Chatbot Component

Create `components/Chatbot.tsx`:

```typescript
'use client';

import { useState } from 'react';

export default function Chatbot() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'bot'; text: string }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chatbot/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'bot', text: data.response }]);
    } catch (error) {
      setMessages((prev) => [...prev, { 
        role: 'bot', 
        text: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-lg border">
      <div className="p-4 border-b">
        <h3 className="font-semibold">CalmCompass Assistant</h3>
      </div>
      <div className="h-64 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded ${
              msg.role === 'user'
                ? 'bg-indigo-100 ml-8'
                : 'bg-gray-100 mr-8'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div className="text-gray-500">Thinking...</div>}
      </div>
      <div className="p-4 border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask for help..."
          className="flex-1 border rounded px-2 py-1"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-1 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
```

### Step 3: Add to Dashboard

Add the chatbot to `app/dashboard/page.tsx`:

```typescript
import Chatbot from '@/components/Chatbot';

// In the component:
return (
  <div>
    {/* existing dashboard content */}
    <Chatbot />
  </div>
);
```

---

## Quick Answer to Your Questions

**Can it be done for free?**
✅ **Yes!** Start with Option 1 (rule-based) - 100% free, no API needed. Later add free AI tier if desired.

**Is it easy?**
✅ **Yes!** Rule-based version is straightforward (2-3 hours). AI version is medium difficulty (4-6 hours).

**Recommendation:**
Start with **Option 1 (Rule-Based)** - it's free, fast, and gives great value. You can always add AI later if you want more sophisticated responses.

---

## Next Steps

1. Decide which approach you want (recommend starting with rule-based)
2. Implement the API route and component
3. Test with your check-in history
4. Optionally add AI enhancement later

Would you like me to implement the rule-based chatbot now?

