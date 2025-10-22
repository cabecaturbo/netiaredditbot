import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import { NetiaAIClient } from '@netia/ai-client';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();
const aiClient = new NetiaAIClient(process.env.AI_API_KEY!);

// Configure multer for audio file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  },
});

const VoiceWebhookSchema = z.object({
  subreddit: z.string().min(1),
  postId: z.string().optional(),
  commentId: z.string().optional(),
});

// POST /api/voice/webhook - Process voice messages
router.post('/webhook', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No audio file provided' 
      });
    }

    const validatedData = VoiceWebhookSchema.parse(req.body);
    
    const context = {
      subreddit: validatedData.subreddit,
      postId: validatedData.postId,
      commentId: validatedData.commentId,
    };

    const contextString = `Reddit context: Subreddit ${context.subreddit}${context.postId ? `, Post ${context.postId}` : ''}${context.commentId ? `, Comment ${context.commentId}` : ''}`;

    // Process voice message
    const result = await aiClient.processVoiceMessage(req.file.buffer, contextString);

    // Log the voice interaction
    const voiceInteraction = await prisma.voiceInteraction.create({
      data: {
        postId: context.postId || undefined,
        commentId: context.commentId || undefined,
        subreddit: context.subreddit,
        audioInput: req.file.buffer.toString('base64'),
        transcription: result.text,
        aiResponse: result.text,
        audioOutput: result.audioResponse.toString('base64'),
        success: true,
      },
    });

    res.json({
      success: true,
      data: {
        id: voiceInteraction.id,
        transcription: result.text,
        audioResponse: result.audioResponse.toString('base64'),
        timestamp: voiceInteraction.timestamp,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation error',
        details: error.errors 
      });
    }
    
    console.error('Voice webhook error:', error);
    
    // Log failed interaction
    try {
      await prisma.voiceInteraction.create({
        data: {
          subreddit: req.body.subreddit || 'unknown',
          postId: req.body.postId,
          commentId: req.body.commentId,
          audioInput: req.file?.buffer.toString('base64'),
          success: false,
        },
      });
    } catch (logError) {
      console.error('Failed to log voice interaction error:', logError);
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process voice message' 
    });
  }
});

// GET /api/voice/config - Get voice configuration
router.get('/config', (req, res) => {
  res.json({
    success: true,
    data: {
      enabled: process.env.VOICE_ENABLED === 'true',
      supportedFormats: ['wav', 'mp3', 'm4a', 'ogg', 'webm'],
      maxFileSize: '25MB',
      languages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
      voices: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'],
      models: {
        transcription: process.env.VOICE_MODEL || 'whisper-1',
        tts: process.env.TTS_MODEL || 'tts-1',
      },
    },
  });
});

// GET /api/voice/interactions - Get voice interactions
router.get('/interactions', async (req, res) => {
  try {
    const { limit = '50', offset = '0' } = req.query;
    const limitNum = Math.min(parseInt(limit as string), 100);
    const offsetNum = parseInt(offset as string);

    const interactions = await prisma.voiceInteraction.findMany({
      orderBy: { timestamp: 'desc' },
      take: limitNum,
      skip: offsetNum,
      select: {
        id: true,
        postId: true,
        commentId: true,
        subreddit: true,
        transcription: true,
        aiResponse: true,
        timestamp: true,
        success: true,
      },
    });

    const totalCount = await prisma.voiceInteraction.count();

    res.json({
      success: true,
      data: interactions,
      pagination: {
        total: totalCount,
        limit: limitNum,
        offset: offsetNum,
        hasMore: offsetNum + limitNum < totalCount,
      },
    });
  } catch (error) {
    console.error('Error fetching voice interactions:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch voice interactions' 
    });
  }
});

// GET /api/voice/interactions/:id - Get specific voice interaction
router.get('/interactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const interaction = await prisma.voiceInteraction.findUnique({
      where: { id },
    });

    if (!interaction) {
      return res.status(404).json({ 
        success: false, 
        error: 'Voice interaction not found' 
      });
    }

    res.json({
      success: true,
      data: interaction,
    });
  } catch (error) {
    console.error('Error fetching voice interaction:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch voice interaction' 
    });
  }
});

// POST /api/voice/generate - Generate voice from text
router.post('/generate', async (req, res) => {
  try {
    const { text, voice = 'alloy' } = req.body;
    
    if (!text) {
      return res.status(400).json({ 
        success: false, 
        error: 'Text is required' 
      });
    }

    const audioBuffer = await aiClient.generateVoiceResponse(text, voice);

    res.json({
      success: true,
      data: {
        audio: audioBuffer.toString('base64'),
        text,
        voice,
      },
    });
  } catch (error) {
    console.error('Error generating voice:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate voice' 
    });
  }
});

export default router;

