# Netia Reddit Bot Setup Guide

This guide will help you set up the Netia Reddit Bot with natural voice reception capabilities.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** and **pnpm** installed
- **PostgreSQL** database running
- **Reddit API credentials**
- **OpenAI API key** with access to GPT-4 and Whisper

## Step 1: Reddit API Setup

### 1.1 Create Reddit App

1. Go to https://www.reddit.com/prefs/apps
2. Click "Create App" or "Create Another App"
3. Choose "script" as the app type
4. Fill in the required information:
   - **Name**: NetiaBot (or your preferred name)
   - **Description**: AI receptionist bot for customer support
   - **About URL**: https://netiawebsite.vercel.app/
   - **Redirect URI**: http://localhost:8080/auth/reddit/callback

### 1.2 Get Credentials

After creating the app, you'll see:
- **Client ID**: The string under your app name
- **Client Secret**: The secret key

### 1.3 Reddit Account Setup

- Use a dedicated Reddit account for the bot
- Ensure the account has appropriate permissions
- Note the username and password

## Step 2: OpenAI API Setup

### 2.1 Get API Key

1. Go to https://platform.openai.com/
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Ensure you have access to:
   - GPT-4 (for text generation)
   - Whisper (for speech-to-text)
   - TTS (for text-to-speech)

### 2.2 API Limits

- Ensure your OpenAI account has sufficient credits
- Voice processing uses more tokens than text-only
- Monitor your usage in the OpenAI dashboard

## Step 3: Database Setup

### 3.1 PostgreSQL Installation

**Windows:**
```bash
# Using Chocolatey
choco install postgresql

# Or download from https://www.postgresql.org/download/windows/
```

**macOS:**
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# CentOS/RHEL
sudo yum install postgresql-server postgresql-contrib
```

### 3.2 Create Database

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE netia_reddit_bot;

-- Create user (optional)
CREATE USER netia_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE netia_reddit_bot TO netia_user;
```

## Step 4: Environment Configuration

### 4.1 Copy Environment File

```bash
cp env.example .env
```

### 4.2 Configure Environment Variables

Edit `.env` with your actual values:

```env
# Reddit API Configuration
REDDIT_CLIENT_ID=your_actual_client_id
REDDIT_CLIENT_SECRET=your_actual_client_secret
REDDIT_USERNAME=your_bot_username
REDDIT_PASSWORD=your_bot_password
REDDIT_USER_AGENT=NetiaBot/1.0

# AI Model Configuration
AI_API_KEY=sk-your-openai-api-key
AI_MODEL=gpt-4
AI_MAX_TOKENS=200
AI_TEMPERATURE=0.7

# Voice Reception Configuration
VOICE_API_KEY=sk-your-openai-api-key
VOICE_MODEL=whisper-1
TTS_MODEL=tts-1
VOICE_WEBHOOK_URL=http://localhost:8080/webhook/voice
VOICE_ENABLED=true

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/netia_reddit_bot

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
ADMIN_SECRET=your_admin_secret_key
```

## Step 5: Installation and Setup

### 5.1 Install Dependencies

```bash
# Install all dependencies
pnpm install
```

### 5.2 Generate Prisma Client

```bash
pnpm prisma:generate
```

### 5.3 Push Database Schema

```bash
pnpm prisma:push
```

## Step 6: Testing the Setup

### 6.1 Test API Connection

```bash
# Start the API server
pnpm --filter api dev

# In another terminal, test the health endpoint
curl http://localhost:8080/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-22T...",
  "service": "Netia Reddit Bot API",
  "version": "1.0.0"
}
```

### 6.2 Test Voice Configuration

```bash
# Test voice config endpoint
curl http://localhost:8080/api/voice/config
```

### 6.3 Test Admin Dashboard

```bash
# Start the admin dashboard
pnpm --filter admin dev
```

Visit http://localhost:3000 to access the admin dashboard.

## Step 7: Start the Bot

### 7.1 Start All Services

```bash
# Start everything in development mode
pnpm dev
```

This will start:
- API Server (port 8080)
- Admin Dashboard (port 3000)
- Reddit Bot (background monitoring)

### 7.2 Verify Bot is Running

Check the console output for:
```
🤖 Netia Reddit Bot starting...
✅ Reddit API connection successful
✅ Netia Reddit Bot is now live with voice capabilities!
🎤 Voice Reception: ENABLED
⏰ Monitoring Reddit every 3 minutes...
```

## Step 8: Configure Keywords

### 8.1 Add Your First Keyword

1. Open the admin dashboard at http://localhost:3000
2. Go to "Keywords" tab
3. Click "Add Keyword Rule"
4. Fill in:
   - **Keyword**: A term you want to monitor (e.g., "dental cleaning")
   - **Subreddit**: Specific subreddit or leave blank for all
   - **Response Template**: How Netia should respond
   - **Active**: Check to enable

### 8.2 Test Keyword Detection

The bot will automatically start monitoring Reddit for your keywords and respond when found.

## Troubleshooting

### Common Issues

**1. Reddit API Connection Failed**
- Verify your Reddit credentials
- Check that your Reddit app is set up correctly
- Ensure your Reddit account has proper permissions

**2. OpenAI API Errors**
- Verify your API key is correct
- Check your OpenAI account has sufficient credits
- Ensure you have access to GPT-4 and Whisper

**3. Database Connection Issues**
- Verify PostgreSQL is running
- Check your DATABASE_URL is correct
- Ensure the database exists and is accessible

**4. Voice Features Not Working**
- Verify VOICE_ENABLED=true in .env
- Check OpenAI API key has TTS access
- Test voice config endpoint

### Getting Help

- Check the console logs for detailed error messages
- Verify all environment variables are set correctly
- Test individual components (API, database, Reddit connection)
- Review the README.md for additional information

## Next Steps

Once your bot is running:

1. **Monitor Performance**: Use the admin dashboard to track bot activity
2. **Fine-tune Keywords**: Add more keyword rules based on your needs
3. **Configure Voice Settings**: Customize voice responses and settings
4. **Scale Up**: Deploy to production when ready

Your Netia Reddit Bot with natural voice reception is now ready to provide 24/7 AI receptionist services on Reddit! 🚀

