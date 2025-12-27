import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

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

    // Get user's emotions
    const emotions = await db.emotion.findMany({
      where: { userId },
    });

    // Get user's check-ins (last 60 days)
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

    // Extract emotion from message
    const messageLower = message.toLowerCase();
    let mentionedEmotion: { id: string; name: string } | null = null;
    
    // Try to find exact emotion match
    for (const emotion of emotions) {
      if (messageLower.includes(emotion.name.toLowerCase())) {
        mentionedEmotion = emotion;
        break;
      }
    }

    // If no exact match, try common emotion keywords
    if (!mentionedEmotion) {
      const emotionKeywords: Record<string, string[]> = {
        happy: ['happy', 'joy', 'joyful', 'glad', 'cheerful', 'excited', 'great'],
        sad: ['sad', 'down', 'depressed', 'unhappy', 'blue', 'melancholy'],
        anxious: ['anxious', 'worried', 'nervous', 'stressed', 'tense'],
        angry: ['angry', 'mad', 'furious', 'irritated', 'annoyed'],
        stressed: ['stressed', 'overwhelmed', 'pressured', 'burned out'],
      };

      for (const [emotionName, keywords] of Object.entries(emotionKeywords)) {
        if (keywords.some(keyword => messageLower.includes(keyword))) {
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

    // Prepare context for AI
    let context = '';
    
    if (mentionedEmotion) {
      const pastCheckIns = allCheckIns.filter(
        checkIn => checkIn.emotionId === mentionedEmotion!.id
      );

      if (pastCheckIns.length > 0) {
        const formatDate = (date: Date) => {
          return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
          });
        };

        const dates = pastCheckIns
          .slice(0, 3)
          .map(checkIn => formatDate(checkIn.createdAt))
          .join(', ');

        const notes = pastCheckIns
          .filter(checkIn => checkIn.notes)
          .slice(0, 3)
          .map(checkIn => checkIn.notes)
          .join(' | ');

        const completedActions = new Set<string>();
        pastCheckIns.forEach(checkIn => {
          checkIn.checkInActions
            .filter(cia => cia.completed)
            .forEach(cia => {
              completedActions.add(cia.action.title);
            });
        });
        const actionList = Array.from(completedActions).slice(0, 5);

        context = `The user said they're feeling "${mentionedEmotion.name}" today. `;
        context += `They have felt ${mentionedEmotion.name} on these dates before: ${dates}. `;
        
        if (notes) {
          context += `Their previous notes when feeling this way: ${notes}. `;
        }
        
        if (actionList.length > 0) {
          context += `Actions they tried that helped: ${actionList.join(', ')}. `;
        }
        
        // Check if user wants more detail
        const wantsMoreDetail = messageLower.includes('more') || messageLower.includes('detail') || messageLower.includes('explain') || messageLower.includes('elaborate');
        const wordLimit = wantsMoreDetail ? '150 words' : '60 words';
        
        context += `Generate a warm, supportive response that: 1) Acknowledges their feeling, 2) Mentions the dates when they felt this way before, 3) References what helped them in the past (notes or actions), 4) Encourages them. Keep it conversational and personal, under ${wordLimit}. Only mention facts from their check-in history - do not make assumptions or suggestions beyond what is explicitly in their data.`;
      } else {
        const wantsMoreDetail = messageLower.includes('more') || messageLower.includes('detail') || messageLower.includes('explain');
        const wordLimit = wantsMoreDetail ? '100 words' : '50 words';
        context = `The user said they're feeling "${mentionedEmotion.name}" today. This is the first time they've checked in with this emotion recently (or first time in 60 days). Provide a warm, supportive response acknowledging their feeling and encouraging them. Keep it under ${wordLimit}. Be concise and only mention what is factually known.`;
      }
    } else {
      // No emotion mentioned - analyze overall patterns
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

        context = `User message: "${message}". `;
        if (mostCommonEmotion && maxCount >= 3) {
          context += `They've been feeling "${mostCommonEmotion}" frequently (${maxCount} times recently). `;
        }
        const wantsMoreDetail = messageLower.includes('more') || messageLower.includes('detail') || messageLower.includes('explain');
        const wordLimit = wantsMoreDetail ? '100 words' : '50 words';
        context += `Generate a helpful, supportive response. Keep it conversational and under ${wordLimit}. Be concise and fact-based.`;
      } else {
        context = `User message: "${message}". This user has no check-in history yet. Welcome them and encourage them to start tracking their emotions. Keep it friendly and under 50 words. Be concise.`;
      }
    }

    // Call Groq API
    const groqApiKey = process.env.GROQ_API_KEY;
    
    if (!groqApiKey) {
      // Fallback to rule-based response if no API key
      return NextResponse.json({
        response: generateFallbackResponse(mentionedEmotion, allCheckIns, emotions),
        source: 'rule-based',
      });
    }

    try {
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: 'You are a warm, empathetic emotional wellness assistant for CalmCompass. You help users understand their emotional patterns and provide supportive, personalized guidance based on their check-in history. Be conversational, supportive, and encouraging. Keep responses concise and brief (2-4 sentences typically). Only mention facts from their check-in history - do not make assumptions or provide unsolicited advice beyond what is in their data. If they ask for more detail, you can expand, but default to being brief.',
            },
            {
              role: 'user',
              content: context,
            },
          ],
          temperature: 0.7,
          max_tokens: messageLower.includes('more') || messageLower.includes('detail') || messageLower.includes('explain') ? 150 : 80,
        }),
      });

      if (!groqResponse.ok) {
        throw new Error(`Groq API error: ${groqResponse.status}`);
      }

      const data: GroqResponse = await groqResponse.json();
      const aiResponse = data.choices[0]?.message?.content || '';

      return NextResponse.json({
        response: aiResponse,
        source: 'groq-ai',
      });
    } catch (groqError) {
      console.error('Groq API error:', groqError);
      // Fallback to rule-based response
      return NextResponse.json({
        response: generateFallbackResponse(mentionedEmotion, allCheckIns, emotions),
        source: 'rule-based-fallback',
      });
    }
  } catch (error) {
    console.error('Chatbot error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

function generateFallbackResponse(
  mentionedEmotion: { id: string; name: string } | null,
  allCheckIns: any[],
  emotions: any[]
): string {
  if (!mentionedEmotion) {
    return "I'm here to help! Try mentioning how you're feeling (like 'I'm feeling happy' or 'I'm feeling sad') and I can provide personalized suggestions based on your past check-ins.";
  }

  const pastCheckIns = allCheckIns.filter(
    checkIn => checkIn.emotionId === mentionedEmotion.id
  );

  if (pastCheckIns.length === 0) {
    return `I see you're feeling ${mentionedEmotion.name} today. This is the first time you've checked in with this emotion recently. Consider trying some of the actions you've set up for this emotion - they can really help!`;
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    });
  };

  const dates = pastCheckIns
    .slice(0, 3)
    .map(checkIn => formatDate(checkIn.createdAt))
    .join(', ');

  const completedActions = new Set<string>();
  pastCheckIns.forEach(checkIn => {
    checkIn.checkInActions
      .filter((cia: any) => cia.completed)
      .forEach((cia: any) => {
        completedActions.add(cia.action.title);
      });
  });
  const actionList = Array.from(completedActions).slice(0, 3);

  const emotionLower = mentionedEmotion.name.toLowerCase();
  
  if (emotionLower.includes('happy') || emotionLower.includes('joy') || emotionLower.includes('good')) {
    let response = `Great to hear you're feeling ${mentionedEmotion.name} today! `;
    if (pastCheckIns.length > 1) {
      response += `You felt ${mentionedEmotion.name} on ${dates} too. `;
    }
    response += `Keep doing what makes you happy!`;
    return response;
  } else if (emotionLower.includes('sad') || emotionLower.includes('down')) {
    let response = `I understand you're feeling ${mentionedEmotion.name} today. `;
    if (pastCheckIns.length > 1) {
      response += `You felt ${mentionedEmotion.name} on ${dates} too. `;
    }
    if (actionList.length > 0) {
      response += `On those days, you tried ${actionList.join(', ')} and felt better afterwards. Would you like to try those actions again?`;
    } else {
      response += `Remember that it's okay to feel this way. Consider trying some of the actions you've set up for this emotion.`;
    }
    return response;
  } else {
    let response = `I see you're feeling ${mentionedEmotion.name} today. `;
    if (pastCheckIns.length > 1) {
      response += `You felt ${mentionedEmotion.name} on ${dates} too. `;
    }
    if (actionList.length > 0) {
      response += `You tried ${actionList.join(', ')} on those days. Those might be helpful now as well.`;
    } else {
      response += `Consider trying some of the actions you've set up for this emotion.`;
    }
    return response;
  }
}

