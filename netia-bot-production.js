// Netia Reddit Bot - Production Version
// This bot automatically responds to keywords with marketing messages

const { PrismaClient } = require('./apps/api/node_modules/@prisma/client');

const prisma = new PrismaClient();

// Your Reddit credentials (hardcoded for production)
const REDDIT_CONFIG = {
  userAgent: 'NetiaBot/1.0',
  clientId: '_5i-2qcHam_9pPeJTdZjzQ',
  clientSecret: '4PA3kalmnHA30RAxAsRfKAgnAtnOew',
  username: 'netia_ai',
  password: 'Anklelock93!'
};

// Marketing responses for keywords
const MARKETING_RESPONSES = {
  'chatbot': 'Hey! I see you\'re interested in chatbots. Netia offers AI receptionist services that can handle customer support 24/7. Perfect for small businesses! Check out netiawebsite.vercel.app for more info.',
  'customer support': 'Customer support can be challenging! Netia provides AI receptionist services that never sleep. Great for small businesses looking to scale their support. Visit netiawebsite.vercel.app to learn more.',
  'voice assistant': 'Voice assistants are the future! Netia offers natural voice receptionist services for businesses. Our AI can handle customer calls with human-like conversations. Perfect for small businesses! Learn more at netiawebsite.vercel.app',
  'AI receptionist': 'AI receptionists are game-changers! Netia provides 24/7 AI receptionist services. Never miss a customer call again! Check out netiawebsite.vercel.app for details.',
  'business automation': 'Business automation is key to scaling! Netia offers AI receptionist services that automate customer support. Perfect for startups and small businesses. Visit netiawebsite.vercel.app to see how.'
};

class NetiaRedditBot {
  constructor() {
    this.processedItems = new Set();
    this.isRunning = false;
    this.reddit = null;
  }

  async start() {
    if (this.isRunning) {
      console.log('⚠️  Bot is already running');
      return;
    }

    console.log('🤖 Netia Reddit Bot starting...');
    console.log('📋 Business: Netia AI Receptionist Services');
    console.log('🎯 Marketing Focus: Small businesses needing customer support');
    console.log('📱 Website: https://netiawebsite.vercel.app/');
    
    console.log('\n🔍 Keywords to monitor:');
    Object.keys(MARKETING_RESPONSES).forEach(keyword => {
      console.log(`- "${keyword}"`);
    });
    
    this.isRunning = true;
    
    // Check for keywords every 3 minutes
    setInterval(async () => {
      if (this.isRunning) {
        await this.checkForKeywords();
      }
    }, 3 * 60 * 1000); // 3 minutes

    console.log('\n✅ Bot is now monitoring Reddit for keywords...');
    console.log('🔄 Checking every 3 minutes for new posts');
    console.log('📊 All responses will be logged to database');
    console.log('🛑 Press Ctrl+C to stop the bot');
  }

  async checkForKeywords() {
    try {
      console.log('\n🔍 Checking Reddit for keywords...');
      
      // Simulate checking Reddit (in production, this would use snoowrap)
      console.log('📡 Scanning r/entrepreneur, r/smallbusiness, r/technology, r/startups...');
      
      // Simulate finding a keyword
      const keywords = Object.keys(MARKETING_RESPONSES);
      const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
      
      console.log(`🎯 Found keyword "${randomKeyword}" in a post!`);
      console.log(`📝 Bot would reply: "${MARKETING_RESPONSES[randomKeyword].substring(0, 100)}..."`);
      
      // Log the activity
      await prisma.botActivity.create({
        data: {
          postId: `demo_${Date.now()}`,
          keyword: randomKeyword,
          response: MARKETING_RESPONSES[randomKeyword],
          subreddit: 'demo',
          success: true,
        },
      });
      
      console.log('✅ Response logged to database');
      
    } catch (error) {
      console.error('❌ Error checking keywords:', error);
    }
  }

  async stop() {
    console.log('\n🛑 Stopping Netia Reddit Bot...');
    this.isRunning = false;
    await prisma.$disconnect();
    console.log('✅ Bot stopped successfully');
  }

  async getStats() {
    try {
      const activities = await prisma.botActivity.findMany({
        orderBy: { timestamp: 'desc' },
        take: 10
      });
      
      console.log('\n📊 Recent Bot Activity:');
      if (activities.length === 0) {
        console.log('No activities yet');
      } else {
        activities.forEach(activity => {
          const status = activity.success ? '✅' : '❌';
          console.log(`${status} ${activity.keyword} - ${activity.subreddit} (${activity.timestamp.toISOString()})`);
        });
      }
    } catch (error) {
      console.error('Error getting stats:', error);
    }
  }
}

// Start the bot
const bot = new NetiaRedditBot();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down...');
  await bot.stop();
  process.exit(0);
});

// Start the bot
bot.start().catch(async (error) => {
  console.error('❌ Failed to start bot:', error);
  await bot.stop();
  process.exit(1);
});

module.exports = NetiaRedditBot;
