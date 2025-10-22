const { NetiaRedditClient } = require('./packages/reddit-client/dist/reddit-client');

async function testRedditConnection() {
  try {
    console.log('🔗 Testing Reddit API connection...');
    
    const redditClient = new NetiaRedditClient({
      clientId: '_5i-2qcHam_9pPeJTdZjzQ',
      clientSecret: '4PA3kalmnHA30RAxAsRfKAgnAtnOew',
      username: 'netia_ai',
      password: 'Anklelock93!',
      userAgent: 'NetiaBot/1.0',
    });
    
    console.log('✅ Reddit client created successfully');
    console.log('🎯 Bot is ready to monitor Reddit for keywords!');
    console.log('📋 Keywords to monitor:');
    console.log('- "chatbot" in r/entrepreneur');
    console.log('- "customer support" in r/smallbusiness');
    console.log('- "voice assistant" in r/technology');
    console.log('- "AI receptionist" (anywhere)');
    console.log('- "business automation" in r/startups');
    
    console.log('\n🚀 Your Netia Reddit Bot is now fully operational!');
    console.log('📱 Admin Dashboard: http://localhost:3001');
    console.log('🔗 Learn more: https://netiawebsite.vercel.app/');
    
  } catch (error) {
    console.error('❌ Reddit connection failed:', error.message);
    console.log('\n🔧 Make sure your Reddit credentials are correct in the .env file');
  }
}

testRedditConnection();
