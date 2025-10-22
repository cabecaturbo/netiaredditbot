# Netia Reddit Bot API Documentation

This document describes the API endpoints available in the Netia Reddit Bot system.

## Base URL

- **Development**: `http://localhost:8080`
- **Production**: `https://your-domain.com`

## Authentication

Currently, the API doesn't require authentication for development. In production, you should implement proper authentication.

## Response Format

All API responses follow this format:

```json
{
  "success": boolean,
  "data": any,
  "error": string,
  "message": string
}
```

## Endpoints

### Health Check

#### GET /health

Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-22T12:00:00.000Z",
  "service": "Netia Reddit Bot API",
  "version": "1.0.0"
}
```

---

## Voice Endpoints

### Voice Configuration

#### GET /api/voice/config

Get voice configuration and capabilities.

**Response:**
```json
{
  "success": true,
  "data": {
    "enabled": true,
    "supportedFormats": ["wav", "mp3", "m4a", "ogg", "webm"],
    "maxFileSize": "25MB",
    "languages": ["en", "es", "fr", "de", "it", "pt", "ru", "ja", "ko", "zh"],
    "voices": ["alloy", "echo", "fable", "onyx", "nova", "shimmer"],
    "models": {
      "transcription": "whisper-1",
      "tts": "tts-1"
    }
  }
}
```

### Process Voice Message

#### POST /api/voice/webhook

Process incoming voice messages from Reddit.

**Request:**
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `audio`: Audio file (required)
  - `subreddit`: Subreddit name (required)
  - `postId`: Post ID (optional)
  - `commentId`: Comment ID (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "voice_interaction_id",
    "transcription": "Transcribed text from audio",
    "audioResponse": "base64_encoded_audio_response",
    "timestamp": "2025-01-22T12:00:00.000Z"
  }
}
```

### Generate Voice from Text

#### POST /api/voice/generate

Generate voice audio from text.

**Request:**
```json
{
  "text": "Text to convert to speech",
  "voice": "alloy" // Optional, defaults to "alloy"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "audio": "base64_encoded_audio",
    "text": "Original text",
    "voice": "alloy"
  }
}
```

### Get Voice Interactions

#### GET /api/voice/interactions

Get list of voice interactions.

**Query Parameters:**
- `limit`: Number of interactions to return (default: 50, max: 100)
- `offset`: Number of interactions to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "interaction_id",
      "postId": "post_id",
      "commentId": "comment_id",
      "subreddit": "subreddit_name",
      "transcription": "Transcribed text",
      "aiResponse": "AI response text",
      "timestamp": "2025-01-22T12:00:00.000Z",
      "success": true
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

---

## Keyword Management

### Get All Keywords

#### GET /api/keywords

Get all keyword rules.

**Query Parameters:**
- `isActive`: Filter by active status (true/false)
- `subreddit`: Filter by subreddit

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "keyword_id",
      "keyword": "dental cleaning",
      "subreddit": "dentistry",
      "responseTemplate": "Response template text",
      "isActive": true,
      "createdAt": "2025-01-22T12:00:00.000Z",
      "updatedAt": "2025-01-22T12:00:00.000Z"
    }
  ],
  "count": 1
}
```

### Get Specific Keyword

#### GET /api/keywords/:id

Get a specific keyword rule by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "keyword_id",
    "keyword": "dental cleaning",
    "subreddit": "dentistry",
    "responseTemplate": "Response template text",
    "isActive": true,
    "createdAt": "2025-01-22T12:00:00.000Z",
    "updatedAt": "2025-01-22T12:00:00.000Z"
  }
}
```

### Create Keyword Rule

#### POST /api/keywords

Create a new keyword rule.

**Request:**
```json
{
  "keyword": "dental cleaning",
  "subreddit": "dentistry", // Optional
  "responseTemplate": "How Netia should respond to this keyword",
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "new_keyword_id",
    "keyword": "dental cleaning",
    "subreddit": "dentistry",
    "responseTemplate": "How Netia should respond to this keyword",
    "isActive": true,
    "createdAt": "2025-01-22T12:00:00.000Z",
    "updatedAt": "2025-01-22T12:00:00.000Z"
  },
  "message": "Keyword rule created successfully"
}
```

### Update Keyword Rule

#### PUT /api/keywords/:id

Update an existing keyword rule.

**Request:**
```json
{
  "keyword": "updated keyword", // Optional
  "subreddit": "updated_subreddit", // Optional
  "responseTemplate": "Updated response template", // Optional
  "isActive": false // Optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "keyword_id",
    "keyword": "updated keyword",
    "subreddit": "updated_subreddit",
    "responseTemplate": "Updated response template",
    "isActive": false,
    "createdAt": "2025-01-22T12:00:00.000Z",
    "updatedAt": "2025-01-22T12:00:00.000Z"
  },
  "message": "Keyword rule updated successfully"
}
```

### Delete Keyword Rule

#### DELETE /api/keywords/:id

Delete a keyword rule.

**Response:**
```json
{
  "success": true,
  "message": "Keyword rule deleted successfully"
}
```

### Toggle Keyword Rule

#### POST /api/keywords/:id/toggle

Toggle the active status of a keyword rule.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "keyword_id",
    "keyword": "dental cleaning",
    "subreddit": "dentistry",
    "responseTemplate": "Response template text",
    "isActive": false,
    "createdAt": "2025-01-22T12:00:00.000Z",
    "updatedAt": "2025-01-22T12:00:00.000Z"
  },
  "message": "Keyword rule deactivated"
}
```

---

## Activity Monitoring

### Get Activities

#### GET /api/activities

Get bot activities with filtering.

**Query Parameters:**
- `limit`: Number of activities to return (default: 100, max: 1000)
- `offset`: Number of activities to skip (default: 0)
- `success`: Filter by success status (true/false)
- `subreddit`: Filter by subreddit
- `keyword`: Filter by keyword
- `startDate`: Filter by start date (ISO 8601)
- `endDate`: Filter by end date (ISO 8601)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "activity_id",
      "postId": "post_id",
      "commentId": "comment_id",
      "keyword": "dental cleaning",
      "response": "Bot response text",
      "subreddit": "dentistry",
      "timestamp": "2025-01-22T12:00:00.000Z",
      "success": true
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 100,
    "offset": 0,
    "hasMore": false
  }
}
```

### Get Activity Statistics

#### GET /api/activities/stats

Get activity statistics.

**Query Parameters:**
- `days`: Number of days to include in stats (default: 7)

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "7 days",
    "totalActivities": 150,
    "successfulActivities": 142,
    "failedActivities": 8,
    "successRate": 94.67,
    "recentActivities": 25,
    "topSubreddits": [
      {
        "subreddit": "dentistry",
        "count": 45
      }
    ],
    "topKeywords": [
      {
        "keyword": "dental cleaning",
        "count": 32
      }
    ]
  }
}
```

### Get Specific Activity

#### GET /api/activities/:id

Get a specific activity by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "activity_id",
    "postId": "post_id",
    "commentId": "comment_id",
    "keyword": "dental cleaning",
    "response": "Bot response text",
    "subreddit": "dentistry",
    "timestamp": "2025-01-22T12:00:00.000Z",
    "success": true
  }
}
```

### Delete Activity

#### DELETE /api/activities/:id

Delete a specific activity.

**Response:**
```json
{
  "success": true,
  "message": "Activity deleted successfully"
}
```

---

## Business Profile

### Get Business Profile

#### GET /api/profile

Get the current business profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "profile_id",
    "name": "Netia AI Receptionist",
    "services": ["Customer Support", "AI Receptionist", "24/7 Assistance", "Voice Reception"],
    "hours": "24/7 Available",
    "contact": "Visit netiawebsite.vercel.app for more information",
    "pricing": {},
    "createdAt": "2025-01-22T12:00:00.000Z",
    "updatedAt": "2025-01-22T12:00:00.000Z"
  }
}
```

### Create Business Profile

#### POST /api/profile

Create a new business profile.

**Request:**
```json
{
  "name": "Your Business Name",
  "services": ["Service 1", "Service 2"],
  "hours": "Business hours",
  "contact": "Contact information",
  "pricing": {
    "service1": "$100",
    "service2": "$200"
  }
}
```

### Update Business Profile

#### PUT /api/profile

Update the existing business profile.

**Request:**
```json
{
  "name": "Updated Business Name",
  "services": ["Updated Service 1", "Updated Service 2"],
  "hours": "Updated business hours",
  "contact": "Updated contact information"
}
```

### Delete Business Profile

#### DELETE /api/profile

Delete the business profile.

**Response:**
```json
{
  "success": true,
  "message": "Business profile deleted successfully"
}
```

---

## Error Responses

All endpoints may return error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": [
    {
      "field": "keyword",
      "message": "Keyword is required"
    }
  ]
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

---

## Rate Limiting

The API includes rate limiting:
- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: Rate limit information is included in response headers

---

## Webhooks

### Voice Webhook

The voice webhook endpoint (`/api/voice/webhook`) is designed to receive voice messages from Reddit and process them with AI responses.

**Expected Flow:**
1. Reddit user sends voice message
2. Voice message is sent to webhook
3. Audio is transcribed using Whisper
4. AI generates response based on transcription
5. Response is converted to speech using TTS
6. Both text and audio responses are returned

This completes the API documentation for the Netia Reddit Bot system.

