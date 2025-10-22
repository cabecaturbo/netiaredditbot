# 🤖 Netia Reddit Bot - Engineer Instructions

## 🚀 Quick Start (For Your Engineer)

Your Reddit bot is ready to run! Here's how to start it:

### **Option 1: Simple Command**
```bash
node netia-bot-production.js
```

### **Option 2: Double-click**
- Double-click `start-bot.bat` file

## 🎯 What This Bot Does

The bot automatically:
- **Monitors Reddit** every 3 minutes for keywords
- **Finds posts** about "chatbot", "customer support", "voice assistant", "AI receptionist", "business automation"
- **Automatically replies** with marketing messages about Netia
- **Logs all activity** to the database

## 📋 Keywords It Responds To

| Keyword | Marketing Message |
|---------|------------------|
| `AI receptionist` | "AI receptionists are game-changers! Netia provides 24/7 AI receptionist services. Never miss a customer call again! Check out netiawebsite.vercel.app for details." |
| `chatbot` | "Hey! I see you're interested in chatbots. Netia offers AI receptionist services that can handle customer support 24/7. Perfect for small businesses! Check out netiawebsite.vercel.app for more info." |
| `customer support` | "Customer support can be challenging! Netia provides AI receptionist services that never sleep. Great for small businesses looking to scale their support. Visit netiawebsite.vercel.app to learn more." |
| `voice assistant` | "Voice assistants are the future! Netia offers natural voice receptionist services for businesses. Our AI can handle customer calls with human-like conversations. Perfect for small businesses! Learn more at netiawebsite.vercel.app" |
| `business automation` | "Business automation is key to scaling! Netia offers AI receptionist services that automate customer support. Perfect for startups and small businesses. Visit netiawebsite.vercel.app to see how." |

## 🔧 Technical Details

- **Reddit Credentials**: Already configured in the code
- **Database**: SQLite with keyword rules
- **Monitoring**: Checks Reddit every 3 minutes
- **Subreddits**: r/entrepreneur, r/smallbusiness, r/technology, r/startups
- **Logging**: All responses logged to database

## 🛑 To Stop the Bot
- Press `Ctrl+C` in the terminal

## 📊 Monitor Activity
- Check the console output for real-time activity
- All responses are logged to the database
- Success/failure rates are tracked

## 🎉 Ready to Go!

Your Reddit bot is configured and ready to market Netia AI receptionist services automatically. Just run the command and it will start working!

**Website**: https://netiawebsite.vercel.app/
