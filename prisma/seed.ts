import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create a test user
  const passwordHash = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@calmcompass.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@calmcompass.com',
      passwordHash,
    },
  });

  console.log('Created user:', user.email);

  // Define emotions and their actions
  const emotionsData = [
    {
      name: 'Anxious',
      actions: [
        { title: 'Take 5 deep breaths', description: 'Focus on slow, controlled breathing' },
        { title: 'Go for a 10-minute walk', description: 'Physical movement helps reduce anxiety' },
        { title: 'Practice grounding technique 5-4-3-2-1', description: 'Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste' },
        { title: 'Write down your worries', description: 'Get thoughts out of your head and onto paper' },
        { title: 'Listen to calming music', description: 'Find a playlist that soothes you' },
        { title: 'Call a friend or family member', description: 'Talking to someone can help reduce anxiety' },
        { title: 'Do a quick body scan meditation', description: 'Check in with each part of your body' },
        { title: 'Drink some water and sit quietly', description: 'Hydrate and give yourself a moment of stillness' },
      ],
    },
    {
      name: 'Sad',
      actions: [
        { title: 'Allow yourself to feel the sadness', description: 'Emotions are valid and temporary' },
        { title: 'Write in a journal about what you\'re feeling', description: 'Express your emotions through writing' },
        { title: 'Listen to music that matches or uplifts your mood', description: 'Music can be therapeutic' },
        { title: 'Reach out to someone you trust', description: 'Share your feelings with a supportive person' },
        { title: 'Do something kind for yourself', description: 'Treat yourself with compassion' },
        { title: 'Watch something that makes you laugh', description: 'Laughter can help shift your mood' },
        { title: 'Get some fresh air', description: 'Spend time outside if possible' },
        { title: 'Remember this feeling is temporary', description: 'Remind yourself that sadness will pass' },
      ],
    },
    {
      name: 'Lonely',
      actions: [
        { title: 'Call or text someone you care about', description: 'Reach out and connect' },
        { title: 'Join an online community or forum', description: 'Find people with shared interests' },
        { title: 'Plan a virtual hangout with friends', description: 'Schedule time to connect' },
        { title: 'Do an activity you enjoy alone', description: 'Enjoy your own company' },
        { title: 'Volunteer or help someone else', description: 'Giving back can reduce loneliness' },
        { title: 'Write a letter to someone', description: 'Express your thoughts and feelings' },
        { title: 'Go to a public place (cafe, park, library)', description: 'Being around people can help' },
        { title: 'Practice self-compassion', description: 'Be kind to yourself in this moment' },
      ],
    },
    {
      name: 'Happy',
      actions: [
        { title: 'Share your joy with others', description: 'Spread the positive energy' },
        { title: 'Express gratitude for this moment', description: 'Appreciate what makes you happy' },
        { title: 'Do something creative', description: 'Channel your positive energy into creation' },
        { title: 'Help someone else feel good', description: 'Share your happiness by helping others' },
        { title: 'Document this moment', description: 'Write or take a photo to remember this feeling' },
        { title: 'Plan something to look forward to', description: 'Build on this positive momentum' },
        { title: 'Savor the feeling', description: 'Take time to fully experience this happiness' },
        { title: 'Do something active', description: 'Use your energy for movement or exercise' },
      ],
    },
    {
      name: 'Stressed',
      actions: [
        { title: 'Take a break and step away', description: 'Give yourself permission to pause' },
        { title: 'Make a list of what needs to be done', description: 'Organize your thoughts and tasks' },
        { title: 'Prioritize and focus on one thing', description: 'Break down overwhelming tasks' },
        { title: 'Practice progressive muscle relaxation', description: 'Tense and release each muscle group' },
        { title: 'Do something physical (exercise, stretch)', description: 'Release physical tension' },
        { title: 'Set boundaries and say no if needed', description: 'Protect your time and energy' },
        { title: 'Talk to someone about what\'s stressing you', description: 'Get support and perspective' },
        { title: 'Remember you don\'t have to do everything perfectly', description: 'Be kind to yourself' },
      ],
    },
  ];

  // Create emotions and actions
  for (const emotionData of emotionsData) {
    // Check if emotion already exists
    const existingEmotion = await prisma.emotion.findFirst({
      where: {
        userId: user.id,
        name: emotionData.name,
      },
      include: {
        actions: true,
      },
    });

    let emotion;
    if (existingEmotion) {
      // Update existing emotion (add actions that don't exist)
      emotion = existingEmotion;
      for (const actionData of emotionData.actions) {
        const existingAction = emotion.actions.find(a => a.title === actionData.title);
        if (!existingAction) {
          await prisma.action.create({
            data: {
              emotionId: emotion.id,
              title: actionData.title,
              description: actionData.description,
            },
          });
        }
      }
      // Refresh to get updated actions count
      emotion = await prisma.emotion.findUniqueOrThrow({
        where: { id: emotion.id },
        include: { actions: true },
      });
    } else {
      // Create new emotion with actions
      emotion = await prisma.emotion.create({
        data: {
          userId: user.id,
          name: emotionData.name,
          actions: {
            create: emotionData.actions.map((action) => ({
              title: action.title,
              description: action.description,
            })),
          },
        },
        include: {
          actions: true,
        },
      });
    }

    console.log(`Created/updated emotion "${emotion.name}" with ${emotion.actions.length} actions`);
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

