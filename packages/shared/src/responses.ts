import { RedditPost, RedditComment, DiscordMessage, BusinessProfile } from './types';

export interface ResponseTemplate {
  id: string;
  name: string;
  template: string;
  platform: 'reddit' | 'discord' | 'both';
  keywords: string[];
}

export class ResponseTemplateManager {
  private businessProfile: BusinessProfile;

  constructor(businessProfile: BusinessProfile) {
    this.businessProfile = businessProfile;
  }

  getTemplates(): ResponseTemplate[] {
    return [
      {
        id: 'problem-solution',
        name: 'Problem-Solution Template',
        template: `I've been there! {context}

I actually built {business_name} to solve this exact problem. {solution}

We're helping {social_proof} with this. {contact_info}

Happy to answer any questions!`,
        platform: 'both',
        keywords: ['missing calls', 'customer service', 'appointment booking', 'lead follow-up'],
      },
      {
        id: 'value-first',
        name: 'Value-First Template',
        template: `Great question! {helpful_advice}

I built {business_name} for this exact reason. {explanation}

{social_proof} are using it successfully. {contact_info}

Let me know if you have any questions!`,
        platform: 'both',
        keywords: ['business automation', 'AI assistant', '24/7 support'],
      },
      {
        id: 'story-based',
        name: 'Story-Based Template',
        template: `Similar situation happened to me! {brief_story}

I ended up building {business_name} because of this. {how_it_works}

{social_proof} are now using it. {contact_info}

Happy to help if you want to know more!`,
        platform: 'both',
        keywords: ['entrepreneur', 'startup', 'small business'],
      },
      {
        id: 'reddit-specific',
        name: 'Reddit-Specific Template',
        template: `Hey! I totally get this struggle. {acknowledgment}

I built {business_name} specifically for this problem - {solution}. 

We're helping {social_proof} never miss another call. {contact_info}

Worth checking out if you're interested: {website_link}

Happy to answer any questions about how it works!`,
        platform: 'reddit',
        keywords: ['missing calls', 'customer service', 'appointment booking'],
      },
      {
        id: 'discord-specific',
        name: 'Discord-Specific Template',
        template: `Hey! {acknowledgment}

I built {business_name} to solve this exact problem. {solution}

We're helping {social_proof} with this. {contact_info}

Let me know if you have any questions!`,
        platform: 'discord',
        keywords: ['business automation', 'AI assistant', '24/7 support'],
      },
    ];
  }

  getTemplateById(id: string): ResponseTemplate | undefined {
    return this.getTemplates().find(template => template.id === id);
  }

  getTemplatesByPlatform(platform: 'reddit' | 'discord' | 'both'): ResponseTemplate[] {
    return this.getTemplates().filter(template => 
      template.platform === platform || template.platform === 'both'
    );
  }

  getTemplatesByKeyword(keyword: string): ResponseTemplate[] {
    return this.getTemplates().filter(template =>
      template.keywords.some(k => keyword.toLowerCase().includes(k.toLowerCase()))
    );
  }

  personalizeTemplate(template: ResponseTemplate, context: RedditPost | RedditComment | DiscordMessage): string {
    let personalized = template.template;

    // Replace placeholders with actual values
    personalized = personalized.replace('{business_name}', this.businessProfile.name);
    personalized = personalized.replace('{social_proof}', '500+ businesses');
    personalized = personalized.replace('{contact_info}', this.businessProfile.contact);
    personalized = personalized.replace('{website_link}', 'https://netiawebsite.vercel.app');

    // Context-specific replacements
    if ('title' in context) {
      // Reddit post
      personalized = personalized.replace('{context}', `"${context.title}"`);
      personalized = personalized.replace('{acknowledgment}', `I see you're dealing with "${context.title}"`);
    } else if ('body' in context) {
      // Reddit comment
      personalized = personalized.replace('{context}', `"${context.body.substring(0, 100)}..."`);
      personalized = personalized.replace('{acknowledgment}', `I understand your situation`);
    } else {
      // Discord message
      personalized = personalized.replace('{context}', `"${context.content.substring(0, 100)}..."`);
      personalized = personalized.replace('{acknowledgment}', `I understand your situation`);
    }

    // Add platform-specific context
    if ('guildId' in context) {
      // Discord message
      personalized += '\n\n💬 *Netia AI Receptionist - Available 24/7 for your business needs!*';
    } else {
      // Reddit post/comment
      personalized += '\n\n🎤 *Netia now supports natural voice conversations! Reply with voice messages for a more personal experience.*';
    }

    return personalized;
  }

  shouldProcessContent(content: RedditPost | RedditComment | DiscordMessage, keyword: string): boolean {
    const text = 'title' in content ? 
      `${content.title} ${content.content || ''}` : 
      'body' in content ? content.body : content.content;

    const lowerText = text.toLowerCase();
    const lowerKeyword = keyword.toLowerCase();

    // Check for exact keyword match
    if (lowerText.includes(lowerKeyword)) {
      return true;
    }

    // Check for related keywords
    const relatedKeywords = this.getRelatedKeywords(keyword);
    return relatedKeywords.some(related => lowerText.includes(related.toLowerCase()));
  }

  private getRelatedKeywords(keyword: string): string[] {
    const keywordMap: Record<string, string[]> = {
      'missing calls': ['missed calls', 'unanswered calls', 'call handling', 'phone calls'],
      'customer service': ['customer support', 'client service', 'help desk', 'support'],
      'appointment booking': ['scheduling', 'bookings', 'appointments', 'calendar'],
      'lead follow-up': ['follow up', 'lead nurturing', 'prospect follow-up', 'sales follow-up'],
      'business automation': ['automation', 'AI assistant', 'chatbot', 'virtual assistant'],
      '24/7 support': ['24/7', 'always available', 'round the clock', 'continuous support'],
    };

    return keywordMap[keyword.toLowerCase()] || [];
  }
}

// Export the shouldProcessContent function for backward compatibility
export function shouldProcessContent(
  content: RedditPost | RedditComment | DiscordMessage, 
  rule: { keyword: string }
): boolean {
  const manager = new ResponseTemplateManager({
    name: 'Netia AI Receptionist',
    services: ['Customer Support', 'AI Receptionist', '24/7 Assistance'],
    hours: '24/7 Available',
    contact: 'Visit netiawebsite.vercel.app for more information',
    pricing: {},
  });

  return manager.shouldProcessContent(content, rule.keyword);
}
