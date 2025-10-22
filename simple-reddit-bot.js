const { PrismaClient } = require('./apps/api/node_modules/@prisma/client');
const snoowrap = require('snoowrap');

// Your Reddit credentials
const reddit = new snoowrap({
  userAgent: 'NetiaBot/1.0',
  clientId: '_5i-2qcHam_9pPeJTdZjzQ',
  clientSecret: '4PA3kalmnHA30RAxAsRfKAgnAtnOew',
  username: 'netia_ai',
  password: 'Anklelock93!'
});

const prisma = new PrismaClient();

// Simple keyword responses for marketing
const keywordResponses = {
  'chatbot': 'Hey! I see you\'re interested in chatbots. Netia offers AI receptionist services that can handle customer support 24/7. Perfect for small businesses! Check out netiawebsite.vercel.app for more info.',
  'customer support': 'Customer support can be challenging! Netia provides AI receptionist services that never sleep. Great for small businesses looking to scale their support. Visit netiawebsite.vercel.app to learn more.',
  'voice assistant': 'Voice assistants are the future! Netia offers natural voice receptionist services for businesses. Our AI can handle customer calls with human-like conversations. Perfect for small businesses! Learn more at netiawebsite.vercel.app',
  'AI receptionist': 'AI receptionists are game-changers! Netia provides 24/7 AI receptionist services. Never miss a customer call again! Check out netiawebsite.vercel.app for details.',
  'business automation': 'Business automation is key to scaling! Netia offers AI receptionist services that automate customer support. Perfect for startups and small businesses. Visit netiawebsite.vercel.app to see how.'
};

class SimpleRedditBot {
  constructor() {
    this.processedItems = new Set();
    this.isRunning = false;
  }

  async start() {
    if (this.isRunning) {
      console.log('⚠️  Bot is already running');
      return;
    }

    console.log('🤖 Simple Netia Reddit Bot starting...');
    console.log('🎯 Focus: Keyword marketing for Netia AI receptionist services');
    console.log('📋 Keywords to monitor:');
    Object.keys(keywordResponses).forEach(keyword => {
      console.log(`- "${keyword}"`);
    });
    
    this.isRunning = true;
    
    // Check for new posts every 3 minutes
    setInterval(async () => {
      if (this.isRunning) {
        await this.checkForKeywords();
      }
    }, 3 * 60 * 1000); // 3 minutes

    console.log('✅ Bot is now monitoring Reddit for keywords...');
    console.log('🔗 Learn more: https://netiawebsite.vercel.app/');
  }

  async checkForKeywords() {
    try {
      console.log('🔍 Checking Reddit for keywords...');
      
      // Check popular subreddits
      const subreddits = ['entrepreneur', 'smallbusiness', 'technology', 'startups'];
      
      for (const subreddit of subreddits) {
        await this.checkSubreddit(subreddit);
      }
    } catch (error) {
      console.error('Error checking keywords:', error);
    }
  }

  async checkSubreddit(subreddit) {
    try {
      console.log(`🔍 Checking r/${subreddit}...`);
      
      // Get new posts
      const posts = await reddit.getSubreddit(subreddit).getNew({ limit: 10 });
      
      for (const post of posts) {
        if (this.processedItems.has(post.id)) continue;
        
        const content = `${post.title} ${post.selftext || ''}`.toLowerCase();
        
        // Check for keywords
        for (const [keyword, response] of Object.entries(keywordResponses)) {
          if (content.includes(keyword.toLowerCase())) {
            console.log(`🎯 Found keyword "${keyword}" in post: ${post.title.substring(0, 50)}...`);
            
            try {
              await post.reply(response);
              console.log(`✅ Replied to post ${post.id} in r/${subreddit}`);
              
              // Log activity
              await prisma.botActivity.create({
                data: {
                  postId: post.id,
                  keyword: keyword,
                  response: response,
                  subreddit: subreddit,
                  success: true,
                },
              });
              
              this.processedItems.add(post.id);
              break; // Only respond once per post
            } catch (error) {
              console.error(`❌ Failed to reply to post ${post.id}:`, error.message);
              
              await prisma.botActivity.create({
                data: {
                  postId: post.id,
                  keyword: keyword,
                  response: '',
                  subreddit: subreddit,
                  success: false,
                },
              });
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error checking r/${subreddit}:`, error);
    }
  }

  async stop() {
    console.log('🛑 Stopping bot...');
    this.isRunning = false;
    await prisma.$disconnect();
    console.log('✅ Bot stopped');
  }
}

// Start the bot
const bot = new SimpleRedditBot();

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

module.exports = SimpleRedditBot;
