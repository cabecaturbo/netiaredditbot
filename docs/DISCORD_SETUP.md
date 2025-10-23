# Discord Bot Setup Guide

This guide will help you set up the Discord bot for your Netia marketing automation.

## Prerequisites

- Discord Developer Account
- Discord Server with appropriate permissions
- Environment variables configured

## Step 1: Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Name it "Netia Marketing Bot"
4. Click "Create"

## Step 2: Create Bot

1. In your application, go to the "Bot" section
2. Click "Add Bot"
3. Copy the bot token (you'll need this for `DISCORD_BOT_TOKEN`)
4. Under "Privileged Gateway Intents", enable:
   - **Message Content Intent** (required for reading message content)
5. Save changes

## Step 3: Generate Invite Link

1. Go to "OAuth2" > "URL Generator"
2. Select scopes:
   - `bot`
   - `applications.commands`
3. Select bot permissions:
   - `Send Messages`
   - `Read Message History`
   - `Use Slash Commands`
   - `Read Messages`
4. Copy the generated URL and use it to invite the bot to your servers

## Step 4: Environment Variables

Add these to your `.env` file:

```env
# Discord Configuration
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_APPLICATION_ID=your_application_id_here
DISCORD_GUILD_IDS=guild_id_1,guild_id_2,guild_id_3
DISCORD_ENABLED=true
```

### Getting Guild IDs

1. Enable Developer Mode in Discord (User Settings > Advanced > Developer Mode)
2. Right-click on your server name
3. Select "Copy ID"
4. Add this ID to `DISCORD_GUILD_IDS` (comma-separated for multiple servers)

## Step 5: Configure Discord Servers

### Target Discord Servers

Here are some recommended Discord servers to monitor:

#### Business & Entrepreneurship
- **Indie Hackers Discord**: https://discord.gg/indiehackers
- **Entrepreneur.com Community**: Search for "Entrepreneur" in Discord
- **Small Business Network**: Search for "Small Business" in Discord
- **Freelancer Hub**: Search for "Freelancer" in Discord
- **Marketing & Growth**: Search for "Marketing" in Discord
- **Startup Grind**: Search for "Startup Grind" in Discord

#### How to Join Servers
1. Use the invite links above
2. Follow each server's rules and verification process
3. Note down the server IDs for configuration

## Step 6: Configure Channels

After joining servers, configure which channels to monitor:

1. Go to your admin dashboard
2. Navigate to Discord Configuration
3. Add each server with the channels you want to monitor
4. Enable/disable monitoring per server

## Step 7: Test the Bot

1. Start the Discord bot: `pnpm --filter discord-bot start`
2. Check the logs for connection status
3. Send a test message in a monitored channel with keywords
4. Verify the bot responds appropriately

## Monitoring Keywords

The bot will respond to messages containing these keywords:

### Primary Keywords
- "missing calls"
- "customer service"
- "appointment booking"
- "lead follow-up"
- "business automation"
- "AI assistant"

### Related Keywords
- "missed calls", "unanswered calls"
- "customer support", "client service"
- "scheduling", "bookings"
- "follow up", "lead nurturing"
- "automation", "chatbot"
- "24/7", "always available"

## Response Templates

The bot uses different response templates based on context:

1. **Problem-Solution**: Acknowledges the problem and offers solution
2. **Value-First**: Provides helpful advice before mentioning the product
3. **Story-Based**: Shares a relatable story and solution
4. **Platform-Specific**: Tailored for Reddit vs Discord context

## Rate Limiting

The bot includes built-in rate limiting:
- **Reddit**: 20-30 responses per day
- **Discord**: 15-25 responses per day
- **Cooldown**: 5-minute intervals between checks

## Troubleshooting

### Bot Not Responding
1. Check if `DISCORD_ENABLED=true`
2. Verify bot token is correct
3. Ensure bot has proper permissions
4. Check if guild IDs are correct

### Permission Issues
1. Make sure bot has "Send Messages" permission
2. Verify "Read Message History" permission
3. Check if bot is in the correct channels

### Rate Limiting
1. Discord has strict rate limits
2. Bot automatically handles rate limiting
3. If hitting limits, reduce response frequency

## Security Best Practices

1. **Never share your bot token**
2. **Use environment variables for all secrets**
3. **Regularly rotate bot tokens**
4. **Monitor bot activity for abuse**
5. **Set up proper logging and alerts**

## Deployment on Vercel

The bot is configured to run on Vercel with cron jobs:

- **Reddit Bot**: Runs every 3 minutes
- **Discord Bot**: Runs every 5 minutes
- **API**: Available 24/7 for configuration

## Support

For issues or questions:
- Check the logs in your admin dashboard
- Review the API endpoints documentation
- Contact support through the Netia website

---

**Netia AI Receptionist That Never Sleeps** 🚀
