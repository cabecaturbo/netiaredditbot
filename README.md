# Netia Reddit Bot

This repository contains a Reddit bot (`apps/reddit-bot`) with natural voice reception capabilities, API backend (`apps/api`), and admin dashboard (`apps/admin`). Built for Netia's AI receptionist services.

## Features

- **🎤 Natural Voice Reception**: Speech-to-text and text-to-speech capabilities using OpenAI Whisper and TTS
- **🔍 Keyword Monitoring**: Respond to specific keywords across Reddit subreddits
- **🤖 AI-Powered Responses**: Natural language responses using OpenAI GPT-4
- **⏰ 24/7 Availability**: Never miss relevant discussions about your business
- **📊 Admin Dashboard**: Manage keywords, monitor activities, and configure voice settings
- **🔗 Business Integration**: Connects with your existing Netia business profile
- **🎯 Voice Conversations**: Users can have natural voice conversations on Reddit

## Quick start

1. Copy `.env.example` to `.env` and fill values
2. Install deps where needed
3. Push Prisma schema to your database
4. Start all apps

```bash
npm run prisma:push
npm run dev
```

API runs on :8080, Admin on :3000 (Next.js). See `apps/api/src/routes` for endpoints.

## About

netiawebsite.vercel.app

### Resources

Edit `.env` with your credentials:

```env
# Reddit API Configuration
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_USERNAME=your_reddit_username
REDDIT_PASSWORD=your_reddit_password
REDDIT_USER_AGENT=NetiaBot/1.0

# AI Model Configuration
AI_API_KEY=your_openai_api_key
AI_MODEL=gpt-4
AI_MAX_TOKENS=200
AI_TEMPERATURE=0.7

# Voice Reception Configuration
VOICE_API_KEY=your_openai_api_key
VOICE_MODEL=whisper-1
TTS_MODEL=tts-1
VOICE_ENABLED=true

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/netia_reddit_bot
```

### 4. Database Setup

```bash
# Generate Prisma client
pnpm prisma:generate

# Push schema to database
pnpm prisma:push
```

### 5. Start Development

```bash
# Start all services
pnpm dev
```

This will start:
- **API Server**: http://localhost:8080
- **Admin Dashboard**: http://localhost:3000
- **Reddit Bot**: Background monitoring service

## Project Structure

```
netia-reddit-bot/
├── apps/
│   ├── reddit-bot/           # Main Reddit bot application
│   ├── api/                  # API backend with voice endpoints
│   └── admin/                # Admin dashboard
├── packages/
│   ├── shared/               # Shared types and utilities
│   ├── ai-client/            # AI and voice client
│   └── reddit-client/        # Reddit API wrapper
├── docs/                     # Documentation
└── env.example              # Environment template
```

## Voice Features

### 🎤 Natural Voice Reception

Netia can now process voice messages and respond with natural speech:

- **Speech-to-Text**: Uses OpenAI Whisper for accurate transcription
- **Text-to-Speech**: Uses OpenAI TTS for natural voice responses
- **Voice Conversations**: Users can have voice conversations directly on Reddit
- **Multi-language Support**: Supports multiple languages for voice processing

### Voice Configuration

The voice system supports:
- Multiple voice types (alloy, echo, fable, onyx, nova, shimmer)
- Various audio formats (wav, mp3, m4a, ogg, webm)
- Up to 25MB file size limit
- Multiple languages for transcription

## Admin Dashboard

Access the admin dashboard at http://localhost:3000 to:

- **📊 Monitor Performance**: View bot statistics and activity metrics
- **🔧 Manage Keywords**: Add, edit, and configure keyword rules
- **🎤 Voice Settings**: Configure voice reception capabilities
- **📈 View Activities**: Monitor bot interactions and responses

## API Endpoints

### Voice Endpoints
- `POST /api/voice/webhook` - Process voice messages
- `GET /api/voice/config` - Get voice configuration
- `POST /api/voice/generate` - Generate voice from text

### Keyword Management
- `GET /api/keywords` - Get all keyword rules
- `POST /api/keywords` - Create new keyword rule
- `PUT /api/keywords/:id` - Update keyword rule
- `DELETE /api/keywords/:id` - Delete keyword rule

### Activity Monitoring
- `GET /api/activities` - Get bot activities
- `GET /api/activities/stats` - Get activity statistics

## Reddit API Setup

1. Go to https://www.reddit.com/prefs/apps
2. Create a new app (script type)
3. Get your client ID and secret
4. Set up your Reddit account credentials in `.env`

## Business Integration

The bot integrates with your existing Netia business profile:

- **Consistent Branding**: Maintains Netia's professional tone
- **Business Context**: Uses your services, hours, and contact info
- **Voice Capabilities**: Extends voice reception to Reddit
- **24/7 Availability**: Never miss customer inquiries

## Deployment

### Production Build

```bash
# Build all packages
pnpm build

# Start production services
pnpm start
```

### Environment Variables for Production

Ensure all production environment variables are set:
- Database connection string
- Reddit API credentials
- OpenAI API keys
- Voice configuration settings

## Monitoring

The bot provides comprehensive monitoring:

- **Activity Logging**: All bot interactions are logged
- **Success Metrics**: Track response success rates
- **Voice Interactions**: Monitor voice message processing
- **Performance Stats**: Real-time performance metrics

## Support

For support and questions:
- Visit [Netia Website](https://netiawebsite.vercel.app/)
- Check the documentation in `/docs`
- Review the API endpoints in the admin dashboard

## License

MIT License - see LICENSE file for details.

---

**Netia AI Receptionist That Never Sleeps** 🚀

