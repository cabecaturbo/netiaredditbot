import dotenv from 'dotenv';
import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { NetiaDiscordClient } from '@netia/discord-client';
import { NetiaAIClient } from '@netia/ai-client';
import { DiscordMessage, shouldProcessContent, BusinessProfile } from '@netia/shared';

dotenv.config();

class NetiaDiscordBot {
  private prisma: PrismaClient;
  private discordClient: NetiaDiscordClient;
  private aiClient: NetiaAIClient;
  private processedMessages: Set<string> = new Set();
  private businessProfile: BusinessProfile;
  private isRunning: boolean = false;

  constructor() {
    this.prisma = new PrismaClient();
    this.discordClient = new NetiaDiscordClient({
      token: process.env.DISCORD_BOT_TOKEN!,
      applicationId: process.env.DISCORD_APPLICATION_ID!,
      guildIds: process.env.DISCORD_GUILD_IDS?.split(',') || [],
      enabled: process.env.DISCORD_ENABLED === 'true',
    });
    
    this.businessProfile = {
      name: process.env.BUSINESS_NAME || 'Netia AI Receptionist',
      services: (process.env.BUSINESS_SERVICES || 'Customer Support,AI Receptionist,24/7 Assistance,Voice Reception').split(','),
      hours: process.env.BUSINESS_HOURS || '24/7 Available',
      contact: process.env.BUSINESS_CONTACT || 'Visit netiawebsite.vercel.app for more information',
      pricing: JSON.parse(process.env.BUSINESS_PRICING || '{}'),
    };
    
    this.aiClient = new NetiaAIClient(process.env.AI_API_KEY!, this.businessProfile);
  }

  async start() {
    if (this.isRunning) {
      console.log('⚠️  Discord bot is already running');
      return;
    }

    if (!process.env.DISCORD_ENABLED || process.env.DISCORD_ENABLED !== 'true') {
      console.log('ℹ️  Discord bot is disabled');
      return;
    }

    console.log('🤖 Netia Discord Bot starting...');
    console.log('📋 Business Profile:', this.businessProfile.name);
    console.log('⏰ Availability: 24/7');
    console.log('🎯 Powered by OpenAI GPT-4');
    
    // Test Discord connection
    try {
      await this.discordClient.connect();
      console.log('✅ Discord API connection successful');
    } catch (error) {
      console.error('❌ Discord API connection failed:', error);
      throw error;
    }

    this.isRunning = true;
    
    // Check for new messages every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      if (this.isRunning) {
        await this.checkForNewMessages();
      }
    });

    console.log('✅ Netia Discord Bot is now live!');
    console.log('🔗 Learn more about Netia: https://netiawebsite.vercel.app/');
    console.log('⏰ Monitoring Discord every 5 minutes...');
  }

  async stop() {
    console.log('🛑 Stopping Netia Discord Bot...');
    this.isRunning = false;
    await this.discordClient.disconnect();
    await this.prisma.$disconnect();
    console.log('✅ Discord bot stopped successfully');
  }

  private async checkForNewMessages() {
    try {
      const keywordRules = await this.prisma.keywordRule.findMany({
        where: { isActive: true },
      });

      if (keywordRules.length === 0) {
        console.log('ℹ️  No active keyword rules found');
        return;
      }

      console.log(`🔍 Checking ${keywordRules.length} active keyword rules...`);

      // Get Discord configurations
      const discordConfigs = await this.prisma.discordConfig.findMany({
        where: { enabled: true },
      });

      for (const config of discordConfigs) {
        const channels = JSON.parse(config.channels);
        
        for (const channelId of channels) {
          await this.checkChannel(channelId, config.guildId, keywordRules);
        }
      }
    } catch (error) {
      console.error('Error checking for new messages:', error);
    }
  }

  private async checkChannel(channelId: string, guildId: string, rules: any[]) {
    try {
      console.log(`🔍 Checking Discord channel ${channelId} in guild ${guildId}`);
      
      const messages = await this.discordClient.getRecentMessages(guildId, channelId, 20);
      
      for (const message of messages) {
        if (this.discordClient.isMessageProcessed(message.id)) {
          continue;
        }

        for (const rule of rules) {
          if (shouldProcessContent(message, rule)) {
            await this.processMessage(message, rule);
            this.discordClient.markMessageAsProcessed(message.id);
            break; // Only process once per message
          }
        }
      }
    } catch (error) {
      console.error(`Error checking channel ${channelId}:`, error);
    }
  }

  private async processMessage(message: DiscordMessage, rule: any) {
    try {
      console.log(`💬 Processing Discord message: ${message.content.substring(0, 50)}...`);
      
      const response = await this.generateResponse(message, rule);
      const success = await this.discordClient.replyToMessage(message.id, message.channelId, response);

      await this.prisma.discordActivity.create({
        data: {
          messageId: message.id,
          guildId: message.guildId,
          channelId: message.channelId,
          authorId: message.author.id,
          content: message.content,
          response: success ? response : null,
          keywordId: rule.id,
          success: success,
        },
      });

      if (success) {
        console.log(`✅ Replied to message ${message.id} in channel ${message.channelId}`);
      } else {
        console.log(`❌ Failed to reply to message ${message.id}`);
      }
    } catch (error) {
      console.error(`Error processing message ${message.id}:`, error);
      
      await this.prisma.discordActivity.create({
        data: {
          messageId: message.id,
          guildId: message.guildId,
          channelId: message.channelId,
          authorId: message.author.id,
          content: message.content,
          response: null,
          keywordId: rule.id,
          success: false,
        },
      });
    }
  }

  private async generateResponse(message: DiscordMessage, rule: any): Promise<string> {
    let response = await this.aiClient.generateResponse(message, rule.keyword, rule.responseTemplate);
    
    // Add Discord-specific context
    response += '\n\n💬 *Netia AI Receptionist - Available 24/7 for your business needs!*';
    
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
        this.prisma.discordActivity.count(),
        this.prisma.discordActivity.count({ where: { success: true } }),
        this.prisma.keywordRule.count({ where: { isActive: true } }),
        this.prisma.discordActivity.count({
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
      };
    } catch (error) {
      console.error('Error getting Discord bot stats:', error);
      throw error;
    }
  }
}

// Start the bot
const bot = new NetiaDiscordBot();

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
  console.error('Failed to start Discord bot:', error);
  await bot.stop();
  process.exit(1);
});

export default NetiaDiscordBot;
