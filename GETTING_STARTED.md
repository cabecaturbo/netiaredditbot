# 🚀 Getting Your Netia Reddit Bot Working

Your Reddit bot is designed to automatically respond to keywords related to your product (chatbot + voice receptionist for small service businesses). Here's how to get it working:

## 🎯 What This Bot Does

The bot automatically:
- **Monitors Reddit** for keywords like "chatbot", "customer support", "voice assistant", "AI receptionist", "business automation"
- **Responds naturally** with information about your Netia AI receptionist services
- **Promotes your product** to small businesses looking for customer support solutions
- **Uses voice capabilities** for natural conversations (when enabled)

## 🔧 Quick Setup (5 minutes)

### 1. Run the Setup Script
```bash
node setup-bot.js
```

### 2. Add Your OpenAI API Key
Edit the `.env` file and replace `your_openai_api_key_here` with your actual OpenAI API key:
```env
AI_API_KEY=sk-your-actual-openai-key-here
VOICE_API_KEY=sk-your-actual-openai-key-here
```

### 3. Set Up Database
**Option A: Use SQLite (Easier)**
```bash
# Change DATABASE_URL in .env to:
DATABASE_URL=file:./dev.db
```

**Option B: Use PostgreSQL (Production)**
```bash
# Install PostgreSQL, then update DATABASE_URL in .env
DATABASE_URL=postgresql://username:password@localhost:5432/netia_reddit_bot
```

### 4. Create Database Tables
```bash
pnpm prisma:push
```

### 5. Add Sample Keywords
```bash
node add-sample-keywords.js
```

### 6. Start the Bot
```bash
pnpm dev
```

## 🎯 Keywords the Bot Responds To

The bot is configured to respond to these keywords:

| Keyword | Subreddit | Response Focus |
|---------|-----------|----------------|
| `chatbot` | r/entrepreneur | AI receptionist services |
| `customer support` | r/smallbusiness | 24/7 support solutions |
| `voice assistant` | r/technology | Natural voice capabilities |
| `AI receptionist` | Anywhere | Core product promotion |
| `business automation` | r/startups | Automation benefits |

## 🎤 Voice Features

When voice is enabled, the bot can:
- **Process voice messages** using OpenAI Whisper
- **Generate voice responses** using OpenAI TTS
- **Have natural conversations** with users
- **Promote voice receptionist services**

## 📊 Admin Dashboard

Access the admin dashboard at `http://localhost:3001` to:
- **Monitor bot activity** and success rates
- **Manage keyword rules** and responses
- **Configure voice settings**
- **View real-time statistics**

## 🔍 How It Works

1. **Bot monitors Reddit** every 3 minutes for new posts/comments
2. **Checks for keywords** in post titles, content, and comments
3. **Generates AI response** using your business profile
4. **Posts response** to Reddit automatically
5. **Logs activity** for monitoring and analytics

## 🎯 Business Profile

The bot uses this business profile for responses:
- **Name**: Netia AI Receptionist
- **Services**: Customer Support, AI Receptionist, 24/7 Assistance, Voice Reception
- **Hours**: 24/7 Available
- **Contact**: Visit netiawebsite.vercel.app for more information

## 🚨 Troubleshooting

### Bot Not Responding?
1. Check if keywords are active in admin dashboard
2. Verify Reddit credentials in `.env`
3. Ensure OpenAI API key is valid
4. Check bot logs for errors

### Database Issues?
1. Run `pnpm prisma:push` to create tables
2. Check DATABASE_URL in `.env`
3. Ensure database is running

### Voice Not Working?
1. Verify OpenAI API key has TTS/Whisper access
2. Check VOICE_ENABLED=true in `.env`
3. Ensure sufficient OpenAI credits

## 📈 Monitoring Success

The admin dashboard shows:
- **Total activities** and success rates
- **Recent interactions** in the last 24 hours
- **Active keywords** and their performance
- **Voice feature status**

## 🎯 Customizing Responses

Edit keyword rules in the admin dashboard or directly in the database:
- **Keywords**: What to monitor for
- **Subreddits**: Where to respond (null = anywhere)
- **Response Template**: Base response structure
- **Active Status**: Enable/disable rules

## 🚀 Production Deployment

Use the `render.yaml` file for production deployment:
1. Push to GitHub
2. Connect to Render
3. Set environment variables
4. Deploy automatically

## 📞 Support

- **Documentation**: Check `docs/` folder
- **API Reference**: See `docs/API.md`
- **Website**: https://netiawebsite.vercel.app/

---

**🎉 Your Reddit bot is now ready to promote Netia AI receptionist services 24/7!**
