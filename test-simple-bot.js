const snoowrap = require('snoowrap');

// Test Reddit connection
async function testConnection() {
  try {
    console.log('🔗 Testing Reddit connection...');
    
    const reddit = new snoowrap({
      userAgent: 'NetiaBot/1.0',
      clientId: '_5i-2qcHam_9pPeJTdZjzQ',
      clientSecret: '4PA3kalmnHA30RAxAsRfKAgnAtnOew',
      username: 'netia_ai',
      password: 'Anklelock93!'
    });
    
    // Test connection
    const user = await reddit.getMe();
    console.log(`✅ Connected as: ${user.name}`);
    
    // Test getting a subreddit
    const subreddit = await reddit.getSubreddit('entrepreneur');
    const posts = await subreddit.getNew({ limit: 1 });
    console.log(`✅ Can access r/entrepreneur - found ${posts.length} posts`);
    
    console.log('\n🎯 Bot is ready to monitor these keywords:');
    console.log('- "chatbot" - AI receptionist services');
    console.log('- "customer support" - 24/7 support solutions');
    console.log('- "voice assistant" - Natural voice capabilities');
    console.log('- "AI receptionist" - Core product promotion');
    console.log('- "business automation" - Automation benefits');
    
    console.log('\n🚀 Your simple Reddit bot is working!');
    console.log('📱 It will automatically respond to keywords every 3 minutes');
    console.log('🔗 Learn more: https://netiawebsite.vercel.app/');
    
  } catch (error) {
    console.error('❌ Reddit connection failed:', error.message);
    console.log('\n🔧 Check your Reddit credentials');
  }
}

testConnection();
