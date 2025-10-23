export interface DiscordMessage {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    discriminator: string;
  };
  channelId: string;
  guildId: string;
  timestamp: Date;
  url: string;
}

export interface DiscordChannel {
  id: string;
  name: string;
  type: number;
  guildId: string;
}

export interface DiscordGuild {
  id: string;
  name: string;
  memberCount: number;
  channels: DiscordChannel[];
}

export interface DiscordClientConfig {
  token: string;
  applicationId: string;
  guildIds: string[];
  enabled: boolean;
}

export interface DiscordActivity {
  id: string;
  messageId: string;
  guildId: string;
  channelId: string;
  authorId: string;
  content: string;
  response?: string;
  keywordId: string;
  timestamp: Date;
  success: boolean;
}
