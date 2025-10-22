import dotenv from 'dotenv';
import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { NetiaRedditClient } from '@netia/reddit-client';
import { NetiaAIClient } from '@netia/ai-client';
import { RedditPost, RedditComment, shouldProcessContent, BusinessProfile } from '@netia/shared';

dotenv.config();

class NetiaRedditBot {
  private prisma: PrismaClient;
  private redditClient: NetiaRedditClient;
  private aiClient: NetiaAIClient;
  private processedItems: Set<string> = new Set();
  private businessProfile: BusinessProfile;
  private voiceEnabled: boolean;
  private isRunning: boolean = false;

  constructor() {
    this.prisma = new PrismaClient();
    this.redditClient = new NetiaRedditClient({
      clientId: process.env.REDDIT_CLIENT_ID!,
      clientSecret: process.env.REDDIT_CLIENT_SECRET!,
      username: process.env.REDDIT_USERNAME!,
      password: process.env.REDDIT_PASSWORD!,
      userAgent: process.env.REDDIT_USER_AGENT!,
    });
    
    this.businessProfile = {
      name: process.env.BUSINESS_NAME || 'Netia AI Receptionist',
      services: (process.env.BUSINESS_SERVICES || 'Customer Support,AI Receptionist,24/7 Assistance,Voice Reception').split(','),
      hours: process.env.BUSINESS_HOURS || '24/7 Available',
      contact: process.env.BUSINESS_CONTACT || 'Visit netiawebsite.vercel.app for more information',
      pricing: JSON.parse(process.env.BUSINESS_PRICING || '{}'),
    };
    
    this.aiClient = new NetiaAIClient(process.env.AI_API_KEY!, this.businessProfile);
    this.voiceEnabled = process.env.VOICE_ENABLED === 'true';
  }

  async start() {
    if (this.isRunning) {
      console.log('⚠️  Bot is already running');
      return;
    }

    console.log('🤖 Netia Reddit Bot starting...');
    console.log('📋 Business Profile:', this.businessProfile.name);
    console.log('⏰ Availability: 24/7');
    console.log('🎯 Powered by OpenAI GPT-4');
    console.log('🎤 Voice Reception:', this.voiceEnabled ? 'ENABLED' : 'DISABLED');
    
    if (this.voiceEnabled) {
      console.log('🎵 Voice Features: Speech-to-Text & Text-to-Speech');
      console.log('🗣️  Natural voice conversations ready!');
    }
    
    // Test Reddit connection
    try {
      await this.redditClient.checkRateLimit();
      console.log('✅ Reddit API connection successful');
    } catch (error) {
      console.error('❌ Reddit API connection failed:', error);
      throw error;
    }

    this.isRunning = true;
    
    // Check for new posts every 3 minutes
    cron.schedule('*/3 * * * *', async () => {
      if (this.isRunning) {
        await this.checkForNewContent();
      }
    });

    console.log('✅ Netia Reddit Bot is now live with voice capabilities!');
    console.log('🔗 Learn more about Netia: https://netiawebsite.vercel.app/');
    console.log('⏰ Monitoring Reddit every 3 minutes...');
  }

  async stop() {
    console.log('🛑 Stopping Netia Reddit Bot...');
    this.isRunning = false;
    await this.prisma.$disconnect();
    console.log('✅ Bot stopped successfully');
  }

  private async checkForNewContent() {
    try {
      const keywordRules = await this.prisma.keywordRule.findMany({
        where: { isActive: true },
      });

      if (keywordRules.length === 0) {
        console.log('ℹ️  No active keyword rules found');
        return;
      }

      console.log(`🔍 Checking ${keywordRules.length} active keyword rules...`);

      for (const rule of keywordRules) {
        if (rule.subreddit) {
          await this.checkSubreddit(rule.subreddit, rule);
        } else {
          // Check popular subreddits if no specific subreddit is set
          const popularSubreddits = ['technology', 'programming', 'webdev', 'javascript', 'entrepreneur', 'startups'];
          for (const subreddit of popularSubreddits) {
            await this.checkSubreddit(subreddit, rule);
          }
        }
      }
    } catch (error) {
      console.error('Error checking for new content:', error);
    }
  }

  private async checkSubreddit(subreddit: string, rule: any) {
    try {
      console.log(`🔍 Checking r/${subreddit} for keyword: "${rule.keyword}"`);
      
      // Check new posts
      const posts = await this.redditClient.getNewPosts(subreddit, 10);
      for (const post of posts) {
        if (shouldProcessContent(post, rule) && !this.processedItems.has(post.id)) {
          await this.processPost(post, rule);
          this.processedItems.add(post.id);
        }
      }

      // Check new comments
      const comments = await this.redditClient.getNewComments(subreddit, 10);
      for (const comment of comments) {
        if (shouldProcessContent(comment, rule) && !this.processedItems.has(comment.id)) {
          await this.processComment(comment, rule);
          this.processedItems.add(comment.id);
        }
      }
    } catch (error) {
      console.error(`Error checking subreddit r/${subreddit}:`, error);
    }
  }

  private async processPost(post: RedditPost, rule: any) {
    try {
      console.log(`📝 Processing post: ${post.title.substring(0, 50)}...`);
      
      const response = await this.generateResponse(post, rule);
      await this.redditClient.replyToPost(post.id, response);

      await this.prisma.botActivity.create({
        data: {
          postId: post.id,
          keyword: rule.keyword,
          response,
          subreddit: post.subreddit,
          success: true,
        },
      });

      console.log(`✅ Replied to post ${post.id} in r/${post.subreddit}`);
    } catch (error) {
      console.error(`Error processing post ${post.id}:`, error);
      
      await this.prisma.botActivity.create({
        data: {
          postId: post.id,
          keyword: rule.keyword,
          response: '',
          subreddit: post.subreddit,
          success: false,
        },
      });
    }
  }

  private async processComment(comment: RedditComment, rule: any) {
    try {
      console.log(`💬 Processing comment: ${comment.body.substring(0, 50)}...`);
      
      const response = await this.generateResponse(comment, rule);
      await this.redditClient.replyToComment(comment.id, response);

      await this.prisma.botActivity.create({
        data: {
          commentId: comment.id,
          keyword: rule.keyword,
          response,
          subreddit: 'unknown', // We'd need to get this from the post
          success: true,
        },
      });

      console.log(`✅ Replied to comment ${comment.id}`);
    } catch (error) {
      console.error(`Error processing comment ${comment.id}:`, error);
      
      await this.prisma.botActivity.create({
        data: {
          commentId: comment.id,
          keyword: rule.keyword,
          response: '',
          subreddit: 'unknown',
          success: false,
        },
      });
    }
  }

  private async generateResponse(content: RedditPost | RedditComment, rule: any): Promise<string> {
    let response = await this.aiClient.generateResponse(content, rule.keyword, rule.responseTemplate);
    
    // Add voice capability mention if enabled
    if (this.voiceEnabled) {
      response += '\n\n🎤 *Netia now supports natural voice conversations! Reply with voice messages for a more personal experience.*';
    }
    
    return response;
  }

  async getStats() {
    try {
      const [
        totalActivities,
        successfulActivities,
        activeKeywords,
        recentActivities,
      ] = await Promise.all([
        this.prisma.botActivity.count(),
        this.prisma.botActivity.count({ where: { success: true } }),
        this.prisma.keywordRule.count({ where: { isActive: true } }),
        this.prisma.botActivity.count({
          where: {
            timestamp: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
            },
          },
        }),
      ]);

      return {
        totalActivities,
        successfulActivities,
        failedActivities: totalActivities - successfulActivities,
        successRate: totalActivities > 0 ? (successfulActivities / totalActivities) * 100 : 0,
        activeKeywords,
        recentActivities,
        isRunning: this.isRunning,
        voiceEnabled: this.voiceEnabled,
      };
    } catch (error) {
      console.error('Error getting bot stats:', error);
      throw error;
    }
  }
}

// Start the bot
const bot = new NetiaRedditBot();

// Graceful shutdown handling
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await bot.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await bot.stop();
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', async (error) => {
  console.error('Uncaught Exception:', error);
  await bot.stop();
  process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  await bot.stop();
  process.exit(1);
});

// Start the bot
bot.start().catch(async (error) => {
  console.error('Failed to start bot:', error);
  await bot.stop();
  process.exit(1);
});

export default NetiaRedditBot;

