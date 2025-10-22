import { RedditPost, RedditComment, KeywordRule } from './types';

/**
 * Utility functions for Netia Reddit Bot
 */

export function shouldProcessContent(
  content: RedditPost | RedditComment,
  rule: KeywordRule
): boolean {
  const text = 'body' in content ? content.body : (content as any).content || (content as any).title;
  return text.toLowerCase().includes(rule.keyword.toLowerCase());
}

export function formatRedditContent(content: RedditPost | RedditComment): string {
  if ('body' in content) {
    return content.body;
  }
  return (content as any).content || (content as any).title;
}

export function extractSubredditFromPostId(postId: string): string {
  // This would need to be implemented based on how we store subreddit info
  // For now, return a placeholder
  return 'unknown';
}

export function sanitizeRedditText(text: string): string {
  // Remove Reddit markdown formatting for AI processing
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
    .replace(/\*(.*?)\*/g, '$1')     // Italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
    .replace(/`(.*?)`/g, '$1')       // Code
    .replace(/#{1,6}\s/g, '')        // Headers
    .trim();
}

export function createUniqueId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toISOString();
}

export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

export function isValidSubreddit(subreddit: string): boolean {
  // Basic subreddit name validation
  return /^[a-zA-Z0-9][a-zA-Z0-9_]{0,20}$/.test(subreddit);
}

export function normalizeKeyword(keyword: string): string {
  return keyword.toLowerCase().trim();
}

export function buildContextString(
  content: RedditPost | RedditComment,
  keyword: string
): string {
  const text = formatRedditContent(content);
  const truncatedText = truncateText(text, 200);
  
  return `
Context: ${truncatedText}
Keyword matched: ${keyword}
Source: Reddit post/comment
  `.trim();
}
