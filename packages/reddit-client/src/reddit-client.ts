import snoowrap from 'snoowrap';
import { RedditPost, RedditComment } from '@netia/shared';

export interface RedditClientConfig {
  clientId: string;
  clientSecret: string;
  username: string;
  password: string;
  userAgent: string;
}

export class NetiaRedditClient {
  private r: snoowrap;
  private rateLimitDelay: number = 1000; // 1 second delay between requests

  constructor(config: RedditClientConfig) {
    this.r = new snoowrap({
      userAgent: config.userAgent,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      username: config.username,
      password: config.password,
    });
  }

  async getNewPosts(subreddit: string, limit: number = 25): Promise<RedditPost[]> {
    try {
      await this.delay(this.rateLimitDelay);
      const posts = await this.r.getSubreddit(subreddit).getNew({ limit });
      
      return posts.map(post => ({
        id: post.id,
        title: post.title,
        content: post.selftext,
        author: post.author.name,
        subreddit: post.subreddit.display_name,
        url: post.url,
        created_utc: post.created_utc,
        score: post.score,
        num_comments: post.num_comments,
      }));
    } catch (error) {
      console.error(`Error fetching posts from r/${subreddit}:`, error);
      throw new Error(`Failed to fetch posts from r/${subreddit}`);
    }
  }

  async getNewComments(subreddit: string, limit: number = 25): Promise<RedditComment[]> {
    try {
      await this.delay(this.rateLimitDelay);
      const comments = await this.r.getSubreddit(subreddit).getNewComments({ limit });
      
      return comments.map(comment => ({
        id: comment.id,
        body: comment.body,
        author: comment.author.name,
        post_id: comment.link_id.replace('t3_', ''),
        parent_id: comment.parent_id?.replace('t1_', ''),
        created_utc: comment.created_utc,
        score: comment.score,
      }));
    } catch (error) {
      console.error(`Error fetching comments from r/${subreddit}:`, error);
      throw new Error(`Failed to fetch comments from r/${subreddit}`);
    }
  }

  async replyToComment(commentId: string, text: string): Promise<void> {
    try {
      await this.delay(this.rateLimitDelay);
      const comment = this.r.getComment(commentId);
      await comment.reply(text);
      console.log(`✅ Successfully replied to comment ${commentId}`);
    } catch (error: any) {
      console.error(`Error replying to comment ${commentId}:`, error);
      throw new Error(`Failed to reply to comment ${commentId}`);
    }
  }

  async replyToPost(postId: string, text: string): Promise<void> {
    try {
      await this.delay(this.rateLimitDelay);
      const post = this.r.getSubmission(postId);
      await post.reply(text);
      console.log(`✅ Successfully replied to post ${postId}`);
    } catch (error: any) {
      console.error(`Error replying to post ${postId}:`, error);
      throw new Error(`Failed to reply to post ${postId}`);
    }
  }

  async getSubredditInfo(subreddit: string): Promise<any> {
    try {
      await this.delay(this.rateLimitDelay);
      const subredditInfo = await this.r.getSubreddit(subreddit);
      return {
        display_name: subredditInfo.display_name,
        subscribers: subredditInfo.subscribers,
        description: subredditInfo.description,
        public_description: subredditInfo.public_description,
        created_utc: subredditInfo.created_utc,
      };
    } catch (error: any) {
      console.error(`Error fetching subreddit info for r/${subreddit}:`, error);
      throw new Error(`Failed to fetch subreddit info for r/${subreddit}`);
    }
  }

  async searchSubreddit(subreddit: string, query: string, limit: number = 25): Promise<RedditPost[]> {
    try {
      await this.delay(this.rateLimitDelay);
      const posts = await this.r.getSubreddit(subreddit).search({
        query: query,
        sort: 'new',
      });
      
      return posts.slice(0, limit).map(post => ({
        id: post.id,
        title: post.title,
        content: post.selftext,
        author: post.author.name,
        subreddit: post.subreddit.display_name,
        url: post.url,
        created_utc: post.created_utc,
        score: post.score,
        num_comments: post.num_comments,
      }));
    } catch (error: any) {
      console.error(`Error searching r/${subreddit} for "${query}":`, error);
      throw new Error(`Failed to search r/${subreddit}`);
    }
  }

  async getPostComments(postId: string, limit: number = 100): Promise<RedditComment[]> {
    try {
      await this.delay(this.rateLimitDelay);
      const post = this.r.getSubmission(postId);
      const comments = await post.comments.fetchMore({ amount: limit });
      
      return comments.map(comment => ({
        id: comment.id,
        body: comment.body,
        author: comment.author.name,
        post_id: postId,
        parent_id: comment.parent_id?.replace('t1_', ''),
        created_utc: comment.created_utc,
        score: comment.score,
      }));
    } catch (error: any) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      throw new Error(`Failed to fetch comments for post ${postId}`);
    }
  }

  async checkRateLimit(): Promise<any> {
    try {
      // Make a simple request to check rate limit status
      await this.r.getMe();
      return { status: 'ok' };
    } catch (error: any) {
      console.error('Rate limit check failed:', error);
      return { status: 'error', error: error.message };
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  setRateLimitDelay(delay: number): void {
    this.rateLimitDelay = delay;
  }

  getRateLimitDelay(): number {
    return this.rateLimitDelay;
  }
}
