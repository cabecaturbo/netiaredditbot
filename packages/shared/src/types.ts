import { z } from 'zod';

// Reddit API Types
export const RedditPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string().optional(),
  author: z.string(),
  subreddit: z.string(),
  url: z.string(),
  created_utc: z.number(),
  score: z.number(),
  num_comments: z.number(),
});

export const RedditCommentSchema = z.object({
  id: z.string(),
  body: z.string(),
  author: z.string(),
  post_id: z.string(),
  parent_id: z.string().optional(),
  created_utc: z.number(),
  score: z.number(),
});

// Database Types
export const KeywordRuleSchema = z.object({
  id: z.string(),
  keyword: z.string(),
  subreddit: z.string().optional(),
  response_template: z.string(),
  is_active: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const BotActivitySchema = z.object({
  id: z.string(),
  post_id: z.string().optional(),
  comment_id: z.string().optional(),
  keyword: z.string(),
  response: z.string(),
  subreddit: z.string(),
  timestamp: z.date(),
  success: z.boolean(),
});

// Voice Types
export const VoiceMessageSchema = z.object({
  audio_buffer: z.instanceof(Buffer),
  context: z.object({
    subreddit: z.string(),
    post_id: z.string().optional(),
    comment_id: z.string().optional(),
  }),
});

export const VoiceResponseSchema = z.object({
  text_response: z.string(),
  audio_response: z.instanceof(Buffer),
});

// Discord Types
export const DiscordMessageSchema = z.object({
  id: z.string(),
  content: z.string(),
  author: z.object({
    id: z.string(),
    username: z.string(),
    discriminator: z.string(),
  }),
  channelId: z.string(),
  guildId: z.string(),
  timestamp: z.date(),
  url: z.string(),
});

export const DiscordActivitySchema = z.object({
  id: z.string(),
  messageId: z.string(),
  guildId: z.string(),
  channelId: z.string(),
  authorId: z.string(),
  content: z.string(),
  response: z.string().optional(),
  keywordId: z.string(),
  timestamp: z.date(),
  success: z.boolean(),
});

// Business Profile Types
export const BusinessProfileSchema = z.object({
  name: z.string(),
  services: z.array(z.string()),
  hours: z.string(),
  contact: z.string(),
  pricing: z.record(z.string()),
});

// API Response Types
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
});

// Type Exports
export type RedditPost = z.infer<typeof RedditPostSchema>;
export type RedditComment = z.infer<typeof RedditCommentSchema>;
export type KeywordRule = z.infer<typeof KeywordRuleSchema>;
export type BotActivity = z.infer<typeof BotActivitySchema>;
export type VoiceMessage = z.infer<typeof VoiceMessageSchema>;
export type VoiceResponse = z.infer<typeof VoiceResponseSchema>;
export type DiscordMessage = z.infer<typeof DiscordMessageSchema>;
export type DiscordActivity = z.infer<typeof DiscordActivitySchema>;
export type BusinessProfile = z.infer<typeof BusinessProfileSchema>;
export type ApiResponse<T = any> = z.infer<typeof ApiResponseSchema> & { data?: T };

