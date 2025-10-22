import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

const KeywordRuleSchema = z.object({
  keyword: z.string().min(1).max(100),
  subreddit: z.string().optional(),
  responseTemplate: z.string().min(1).max(1000),
  isActive: z.boolean().default(true),
});

const UpdateKeywordRuleSchema = z.object({
  keyword: z.string().min(1).max(100).optional(),
  subreddit: z.string().optional(),
  responseTemplate: z.string().min(1).max(1000).optional(),
  isActive: z.boolean().optional(),
});

// GET /api/keywords - Get all keyword rules
router.get('/', async (req, res) => {
  try {
    const { isActive, subreddit } = req.query;
    
    const where: any = {};
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }
    if (subreddit) {
      where.subreddit = subreddit;
    }

    const keywords = await prisma.keywordRule.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: keywords,
      count: keywords.length,
    });
  } catch (error) {
    console.error('Error fetching keywords:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch keywords' 
    });
  }
});

// GET /api/keywords/:id - Get specific keyword rule
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const keyword = await prisma.keywordRule.findUnique({
      where: { id },
    });

    if (!keyword) {
      return res.status(404).json({ 
        success: false, 
        error: 'Keyword rule not found' 
      });
    }

    res.json({
      success: true,
      data: keyword,
    });
  } catch (error) {
    console.error('Error fetching keyword:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch keyword rule' 
    });
  }
});

// POST /api/keywords - Create new keyword rule
router.post('/', async (req, res) => {
  try {
    const validatedData = KeywordRuleSchema.parse(req.body);
    
    const newKeyword = await prisma.keywordRule.create({
      data: validatedData,
    });

    res.status(201).json({
      success: true,
      data: newKeyword,
      message: 'Keyword rule created successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation error',
        details: error.errors 
      });
    }
    
    console.error('Error creating keyword:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create keyword rule' 
    });
  }
});

// PUT /api/keywords/:id - Update keyword rule
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = UpdateKeywordRuleSchema.parse(req.body);
    
    const updatedKeyword = await prisma.keywordRule.update({
      where: { id },
      data: validatedData,
    });

    res.json({
      success: true,
      data: updatedKeyword,
      message: 'Keyword rule updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation error',
        details: error.errors 
      });
    }
    
    console.error('Error updating keyword:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update keyword rule' 
    });
  }
});

// DELETE /api/keywords/:id - Delete keyword rule
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.keywordRule.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Keyword rule deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting keyword:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete keyword rule' 
    });
  }
});

// POST /api/keywords/:id/toggle - Toggle keyword rule active status
router.post('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    
    const keyword = await prisma.keywordRule.findUnique({
      where: { id },
    });

    if (!keyword) {
      return res.status(404).json({ 
        success: false, 
        error: 'Keyword rule not found' 
      });
    }

    const updatedKeyword = await prisma.keywordRule.update({
      where: { id },
      data: { isActive: !keyword.isActive },
    });

    res.json({
      success: true,
      data: updatedKeyword,
      message: `Keyword rule ${updatedKeyword.isActive ? 'activated' : 'deactivated'}`,
    });
  } catch (error) {
    console.error('Error toggling keyword:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to toggle keyword rule' 
    });
  }
});

export default router;

