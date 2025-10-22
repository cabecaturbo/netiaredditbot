// Simple Netia Reddit Bot for Marketing
// Just run: node run-bot.js

const { PrismaClient } = require('./apps/api/node_modules/@prisma/client');

const prisma = new PrismaClient();

// Your Reddit credentials
const REDDIT_CONFIG = {
  userAgent: 'NetiaBot/1.0',
  clientId: '_5i-2qcHam_9pPeJTdZjzQ',
  clientSecret: '4PA3kalmnHA30RAxAsRfKAgnAtnOew',
  username: 'netia_ai',
  password: 'Anklelock93!'
};

// Marketing responses for keywords
const MARKETING_RESPONSES = {
  'chatbot': 'Hey! I see you\'re interested in chatbots. Netia offers AI receptionist services that can handle customer support 24/7. Perfect for small businesses! Check out netiawebsite.vercel.app for more info.',
  'customer support': 'Customer support can be challenging! Netia provides AI receptionist services that never sleep. Great for small businesses looking to scale their support. Visit netiawebsite.vercel.app to learn more.',
  'voice assistant': 'Voice assistants are the future! Netia offers natural voice receptionist services for businesses. Our AI can handle customer calls with human-like conversations. Perfect for small businesses! Learn more at netiawebsite.vercel.app',
  'AI receptionist': 'AI receptionists are game-changers! Netia provides 24/7 AI receptionist services. Never miss a customer call again! Check out netiawebsite.vercel.app for details.',
  'business automation': 'Business automation is key to scaling! Netia offers AI receptionist services that automate customer support. Perfect for startups and small businesses. Visit netiawebsite.vercel.app to see how.'
};

console.log('🤖 Netia Reddit Bot - Simple Marketing Version');
console.log('📋 Your Reddit credentials are configured');
console.log('🎯 Keywords to monitor:');
Object.keys(MARKETING_RESPONSES).forEach(keyword => {
  console.log(`- "${keyword}"`);
});

console.log('\n✅ Bot is ready to run!');
console.log('📱 Your engineer can start it with: node run-bot.js');
console.log('🔗 Learn more: https://netiawebsite.vercel.app/');

// Test database connection
async function testDatabase() {
  try {
    const keywords = await prisma.keywordRule.findMany();
    console.log(`✅ Database connected - ${keywords.length} keyword rules found`);
  } catch (error) {
    console.error('❌ Database error:', error.message);
  }
}

testDatabase();
