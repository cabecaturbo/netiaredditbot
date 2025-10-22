#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🤖 Setting up Netia Reddit Bot...\n');

// Check if .env exists
if (!fs.existsSync('.env')) {
  console.log('📝 Creating .env file...');
  
  const envContent = `# Reddit API Configuration
REDDIT_CLIENT_ID=_5i-2qcHam_9pPeJTdZjzQ
REDDIT_CLIENT_SECRET=4PA3kalmnHA30RAxAsRfKAgnAtnOew
REDDIT_USERNAME=netia_ai
REDDIT_PASSWORD=Anklelock93!
REDDIT_USER_AGENT=NetiaBot/1.0

# AI Model Configuration
AI_API_KEY=your_openai_api_key_here
AI_MODEL=gpt-4
AI_MAX_TOKENS=200
AI_TEMPERATURE=0.7

# Voice Reception Configuration
VOICE_API_KEY=your_openai_api_key_here
VOICE_MODEL=whisper-1
TTS_MODEL=tts-1
VOICE_WEBHOOK_URL=http://localhost:8080/webhook/voice
VOICE_ENABLED=true

# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/netia_reddit_bot

# Server Configuration
PORT=8080
NODE_ENV=development

# Business Profile
BUSINESS_NAME=Netia AI Receptionist
BUSINESS_SERVICES=Customer Support,AI Receptionist,24/7 Assistance,Voice Reception
BUSINESS_HOURS=24/7 Available
BUSINESS_CONTACT=Visit netiawebsite.vercel.app for more information
BUSINESS_PRICING={}

# Admin Configuration
ADMIN_SECRET=netia_admin_2024`;

  fs.writeFileSync('.env', envContent);
  console.log('✅ .env file created');
} else {
  console.log('✅ .env file already exists');
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('pnpm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Generate Prisma client
console.log('\n🗄️  Setting up database...');
try {
  execSync('pnpm prisma:generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated');
} catch (error) {
  console.error('❌ Failed to generate Prisma client:', error.message);
  process.exit(1);
}

// Create sample keyword rules
console.log('\n🎯 Creating sample keyword rules...');
const sampleKeywords = [
  {
    keyword: 'chatbot',
    subreddit: 'entrepreneur',
    responseTemplate: 'Hey! I see you\'re interested in chatbots. Netia offers AI receptionist services that can handle customer support 24/7 with natural voice capabilities. Perfect for small businesses! Check out netiawebsite.vercel.app for more info.',
    isActive: true
  },
  {
    keyword: 'customer support',
    subreddit: 'smallbusiness',
    responseTemplate: 'Customer support can be challenging! Netia provides AI receptionist services that never sleep, with natural voice conversations. Great for small businesses looking to scale their support. Visit netiawebsite.vercel.app to learn more.',
    isActive: true
  },
  {
    keyword: 'voice assistant',
    subreddit: 'technology',
    responseTemplate: 'Voice assistants are the future! Netia offers natural voice receptionist services for businesses. Our AI can handle customer calls with human-like conversations. Perfect for small businesses! Learn more at netiawebsite.vercel.app',
    isActive: true
  },
  {
    keyword: 'AI receptionist',
    subreddit: null, // Will check all subreddits
    responseTemplate: 'AI receptionists are game-changers! Netia provides 24/7 AI receptionist services with natural voice capabilities. Never miss a customer call again! Check out netiawebsite.vercel.app for details.',
    isActive: true
  },
  {
    keyword: 'business automation',
    subreddit: 'startups',
    responseTemplate: 'Business automation is key to scaling! Netia offers AI receptionist services that automate customer support with natural voice conversations. Perfect for startups and small businesses. Visit netiawebsite.vercel.app to see how.',
    isActive: true
  }
];

// Save sample keywords to a JSON file for easy import
fs.writeFileSync('sample-keywords.json', JSON.stringify(sampleKeywords, null, 2));
console.log('✅ Sample keyword rules created in sample-keywords.json');

console.log('\n🎉 Setup complete! Next steps:');
console.log('1. Add your OpenAI API key to the .env file');
console.log('2. Set up a PostgreSQL database and update DATABASE_URL in .env');
console.log('3. Run: pnpm prisma:push (to create database tables)');
console.log('4. Run: pnpm dev (to start all services)');
console.log('\n📋 The bot will respond to keywords like:');
console.log('- "chatbot" in r/entrepreneur');
console.log('- "customer support" in r/smallbusiness');
console.log('- "voice assistant" in r/technology');
console.log('- "AI receptionist" (anywhere)');
console.log('- "business automation" in r/startups');
console.log('\n🎤 Voice features are enabled for natural conversations!');
console.log('🔗 Learn more: https://netiawebsite.vercel.app/');
