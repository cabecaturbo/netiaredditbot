const { PrismaClient } = require('./apps/api/node_modules/@prisma/client');

const prisma = new PrismaClient();

async function addKeywords() {
  const keywords = [
    {
      keyword: 'chatbot',
      subreddit: 'entrepreneur',
      responseTemplate: 'Hey! I see you\'re interested in chatbots. Netia offers AI receptionist services that can handle customer support 24/7 with natural voice capabilities. Perfect for small businesses! Check out netiawebsite.vercel.app for more info.',
      isActive: true
    },
    {
      keyword: 'customer support',
      subreddit: 'smallbusiness',
      responseTemplate: 'Customer support can be challenging! Netia provides AI receptionist services that never sleep, with natural voice conversations. Great for small businesses looking to scale their support. Visit netiawebsite.vercel.app to learn more.',
      isActive: true
    },
    {
      keyword: 'voice assistant',
      subreddit: 'technology',
      responseTemplate: 'Voice assistants are the future! Netia offers natural voice receptionist services for businesses. Our AI can handle customer calls with human-like conversations. Perfect for small businesses! Learn more at netiawebsite.vercel.app',
      isActive: true
    },
    {
      keyword: 'AI receptionist',
      subreddit: null,
      responseTemplate: 'AI receptionists are game-changers! Netia provides 24/7 AI receptionist services with natural voice capabilities. Never miss a customer call again! Check out netiawebsite.vercel.app for details.',
      isActive: true
    },
    {
      keyword: 'business automation',
      subreddit: 'startups',
      responseTemplate: 'Business automation is key to scaling! Netia offers AI receptionist services that automate customer support with natural voice conversations. Perfect for startups and small businesses. Visit netiawebsite.vercel.app to see how.',
      isActive: true
    }
  ];

  try {
    console.log('🎯 Adding keyword rules...');
    
    for (const keyword of keywords) {
      await prisma.keywordRule.create({
        data: keyword
      });
      console.log(`✅ Added: "${keyword.keyword}"`);
    }
    
    console.log('\n🎉 All keywords added successfully!');
    console.log('🤖 Your bot is now ready to respond to:');
    keywords.forEach(k => console.log(`- "${k.keyword}" ${k.subreddit ? `in r/${k.subreddit}` : 'anywhere'}`));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addKeywords();
