import OpenAI from 'openai';
import { RedditPost, RedditComment, BusinessProfile } from '@netia/shared';

export class NetiaAIClient {
  private openai: OpenAI;
  private businessProfile: BusinessProfile;

  constructor(apiKey: string, businessProfile?: Partial<BusinessProfile>) {
    this.openai = new OpenAI({ apiKey });
    this.businessProfile = {
      name: 'Netia AI Receptionist',
      services: ['Customer Support', 'AI Receptionist', '24/7 Assistance', 'Voice Reception'],
      hours: '24/7 Available',
      contact: 'Visit netiawebsite.vercel.app for more information',
      pricing: {},
      ...businessProfile,
    };
  }

  async generateResponse(
    context: RedditPost | RedditComment,
    keyword: string,
    template: string
  ): Promise<string> {
    const prompt = this.buildNetiaPrompt(context, keyword, template);
    
    const response = await this.openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are Netia, an AI receptionist that provides 24/7 customer support. You are helpful, professional, and always available. Your responses should be:
          - Natural and conversational
          - Helpful and informative
          - Consistent with Netia branding
          - Appropriate for Reddit discussions
          - Focused on providing value to the community
          
          Business Profile:
          Name: ${this.businessProfile.name}
          Services: ${this.businessProfile.services.join(', ')}
          Hours: ${this.businessProfile.hours}
          Contact: ${this.businessProfile.contact}`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: parseInt(process.env.AI_MAX_TOKENS || '200'),
      temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
    });

    return response.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response right now. Feel free to reach out through our website for assistance!';
  }

  private buildNetiaPrompt(context: RedditPost | RedditComment, keyword: string, template: string): string {
    const content = 'body' in context ? context.body : context.content || context.title;
    
    return `
Reddit Context: ${content}
Keyword matched: ${keyword}
Response template: ${template}

As Netia AI Receptionist, generate a helpful response that:
1. Acknowledges the user's question or comment naturally
2. Provides relevant information based on our business profile
3. Maintains a helpful, professional tone
4. Encourages further engagement if appropriate
5. Stays true to Netia's "AI Receptionist That Never Sleeps" branding

Keep the response conversational and Reddit-appropriate while showcasing Netia's capabilities.
    `.trim();
  }

  async generateVoiceResponse(text: string, voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' = 'alloy'): Promise<Buffer> {
    try {
      const response = await this.openai.audio.speech.create({
        model: process.env.TTS_MODEL || 'tts-1',
        voice: voice,
        input: text,
      });

      // Convert response to buffer
      const buffer = Buffer.from(await response.arrayBuffer());
      return buffer;
    } catch (error) {
      console.error('Voice generation error:', error);
      throw new Error('Failed to generate voice response');
    }
  }

  async transcribeAudio(audioBuffer: Buffer): Promise<string> {
    try {
      const transcription = await this.openai.audio.transcriptions.create({
        file: new File([audioBuffer], 'audio.wav', { type: 'audio/wav' }),
        model: process.env.VOICE_MODEL || 'whisper-1',
        language: 'en',
      });
      
      return transcription.text;
    } catch (error) {
      console.error('Voice transcription error:', error);
      throw new Error('Failed to transcribe audio');
    }
  }

  async processVoiceMessage(audioBuffer: Buffer, context: string): Promise<{ text: string; audioResponse: Buffer }> {
    // Transcribe the incoming voice message
    const transcribedText = await this.transcribeAudio(audioBuffer);
    
    // Generate AI response based on transcription and context
    const aiResponse = await this.generateTextResponse(transcribedText, context);
    
    // Convert AI response to voice
    const audioResponse = await this.generateVoiceResponse(aiResponse);
    
    return {
      text: aiResponse,
      audioResponse: audioResponse
    };
  }

  private async generateTextResponse(userMessage: string, context: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are Netia, an AI receptionist with natural voice capabilities. You are:
          - Professional and friendly in tone
          - Available 24/7
          - Capable of handling voice conversations naturally
          - Focused on providing helpful responses
          
          Context: ${context}
          
          Respond naturally as if you're having a voice conversation. Keep responses conversational and appropriate for voice delivery.`
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      max_tokens: parseInt(process.env.AI_MAX_TOKENS || '150'),
      temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
    });

    return response.choices[0]?.message?.content || 'I apologize, but I couldn\'t process your request right now. Please try again or visit our website for assistance.';
  }

  updateBusinessProfile(profile: Partial<BusinessProfile>): void {
    this.businessProfile = { ...this.businessProfile, ...profile };
  }

  getBusinessProfile(): BusinessProfile {
    return this.businessProfile;
  }
}

