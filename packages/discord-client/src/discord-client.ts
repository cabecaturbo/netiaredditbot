import { Client, GatewayIntentBits, Message, TextChannel, Guild } from 'discord.js';
import { DiscordMessage, DiscordClientConfig, DiscordGuild, DiscordChannel } from './types';

export class NetiaDiscordClient {
  private client: Client;
  private config: DiscordClientConfig;
  private isConnected: boolean = false;
  private processedMessages: Set<string> = new Set();

  constructor(config: DiscordClientConfig) {
    this.config = config;
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.client.on('ready', () => {
      console.log(`🤖 Discord bot logged in as ${this.client.user?.tag}`);
      this.isConnected = true;
    });

    this.client.on('error', (error) => {
      console.error('Discord client error:', error);
    });

    this.client.on('warn', (warning) => {
      console.warn('Discord client warning:', warning);
    });
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('Discord client already connected');
      return;
    }

    try {
      await this.client.login(this.config.token);
      console.log('✅ Discord client connected successfully');
    } catch (error) {
      console.error('❌ Discord client connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await this.client.destroy();
      this.isConnected = false;
      console.log('✅ Discord client disconnected');
    } catch (error) {
      console.error('❌ Discord client disconnect error:', error);
    }
  }

  async getGuilds(): Promise<DiscordGuild[]> {
    if (!this.isConnected) {
      throw new Error('Discord client not connected');
    }

    const guilds: DiscordGuild[] = [];
    
    for (const guildId of this.config.guildIds) {
      try {
        const guild = await this.client.guilds.fetch(guildId);
        const channels = await guild.channels.fetch();
        
        guilds.push({
          id: guild.id,
          name: guild.name,
          memberCount: guild.memberCount,
          channels: channels
            .filter(channel => channel?.type === 0) // Text channels only
            .map(channel => ({
              id: channel!.id,
              name: channel!.name,
              type: channel!.type,
              guildId: guild.id,
            })),
        });
      } catch (error) {
        console.error(`Error fetching guild ${guildId}:`, error);
      }
    }

    return guilds;
  }

  async getRecentMessages(guildId: string, channelId: string, limit: number = 10): Promise<DiscordMessage[]> {
    if (!this.isConnected) {
      throw new Error('Discord client not connected');
    }

    try {
      const guild = await this.client.guilds.fetch(guildId);
      const channel = await guild.channels.fetch(channelId) as TextChannel;
      
      if (!channel || channel.type !== 0) {
        throw new Error('Channel not found or not a text channel');
      }

      const messages = await channel.messages.fetch({ limit });
      
      return messages.map((message: Message): DiscordMessage => ({
        id: message.id,
        content: message.content,
        author: {
          id: message.author.id,
          username: message.author.username,
          discriminator: message.author.discriminator,
        },
        channelId: message.channelId,
        guildId: message.guildId!,
        timestamp: message.createdAt,
        url: message.url,
      }));
    } catch (error) {
      console.error(`Error fetching messages from ${guildId}/${channelId}:`, error);
      return [];
    }
  }

  async sendMessage(channelId: string, content: string): Promise<boolean> {
    if (!this.isConnected) {
      throw new Error('Discord client not connected');
    }

    try {
      const channel = await this.client.channels.fetch(channelId) as TextChannel;
      
      if (!channel || channel.type !== 0) {
        throw new Error('Channel not found or not a text channel');
      }

      await channel.send(content);
      console.log(`✅ Sent message to channel ${channelId}`);
      return true;
    } catch (error) {
      console.error(`Error sending message to ${channelId}:`, error);
      return false;
    }
  }

  async replyToMessage(messageId: string, channelId: string, content: string): Promise<boolean> {
    if (!this.isConnected) {
      throw new Error('Discord client not connected');
    }

    try {
      const channel = await this.client.channels.fetch(channelId) as TextChannel;
      
      if (!channel || channel.type !== 0) {
        throw new Error('Channel not found or not a text channel');
      }

      const message = await channel.messages.fetch(messageId);
      await message.reply(content);
      console.log(`✅ Replied to message ${messageId} in channel ${channelId}`);
      return true;
    } catch (error) {
      console.error(`Error replying to message ${messageId}:`, error);
      return false;
    }
  }

  async checkRateLimit(): Promise<boolean> {
    // Discord.js handles rate limiting automatically
    // This method can be used to check if the client is ready
    return this.isConnected;
  }

  isMessageProcessed(messageId: string): boolean {
    return this.processedMessages.has(messageId);
  }

  markMessageAsProcessed(messageId: string): void {
    this.processedMessages.add(messageId);
  }

  getClient(): Client {
    return this.client;
  }

  isReady(): boolean {
    return this.isConnected;
  }
}
