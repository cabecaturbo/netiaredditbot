const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data for demo
const mockKeywords = [
  {
    id: '1',
    keyword: 'dental cleaning',
    subreddit: 'dentistry',
    responseTemplate: 'Hi! Netia AI Receptionist here. I can help you with dental cleaning information. Visit our website for more details!',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2', 
    keyword: 'appointment',
    subreddit: 'healthcare',
    responseTemplate: 'Hello! Netia can help you schedule appointments. We offer 24/7 AI receptionist services!',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockStats = {
  totalActivities: 45,
  successfulActivities: 42,
  failedActivities: 3,
  successRate: 93.33,
  activeKeywords: 2,
  recentActivities: 8,
  isRunning: true,
  voiceEnabled: true
};

// Routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Netia Reddit Bot API (Demo)',
    version: '1.0.0'
  });
});

app.get('/api/keywords', (req, res) => {
  res.json({
    success: true,
    data: mockKeywords,
    count: mockKeywords.length
  });
});

app.post('/api/keywords', (req, res) => {
  const newKeyword = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  mockKeywords.push(newKeyword);
  res.json({
    success: true,
    data: newKeyword,
    message: 'Keyword rule created successfully'
  });
});

app.get('/api/activities/stats', (req, res) => {
  res.json({
    success: true,
    data: mockStats
  });
});

app.get('/api/voice/config', (req, res) => {
  res.json({
    success: true,
    data: {
      enabled: true,
      supportedFormats: ['wav', 'mp3', 'm4a', 'ogg', 'webm'],
      maxFileSize: '25MB',
      languages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
      voices: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'],
      models: {
        transcription: 'whisper-1',
        tts: 'tts-1'
      }
    }
  });
});

app.post('/api/voice/generate', (req, res) => {
  res.json({
    success: true,
    data: {
      audio: 'base64_demo_audio_data',
      text: req.body.text,
      voice: req.body.voice || 'alloy'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Netia Reddit Bot Demo API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🎤 Voice endpoints: http://localhost:${PORT}/api/voice`);
  console.log(`🔑 Keywords: http://localhost:${PORT}/api/keywords`);
  console.log(`\n✅ Demo API is ready! You can now start the admin dashboard.`);
});

