import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

const ActivityQuerySchema = z.object({
  limit: z.string().transform(Number).pipe(z.number().min(1).max(1000)).default('100'),
  offset: z.string().transform(Number).pipe(z.number().min(0)).default('0'),
  success: z.string().transform(val => val === 'true').optional(),
  subreddit: z.string().optional(),
  keyword: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// GET /api/activities - Get bot activities with filtering
router.get('/', async (req, res) => {
  try {
    const validatedQuery = ActivityQuerySchema.parse(req.query);
    
    const where: any = {};
    
    if (validatedQuery.success !== undefined) {
      where.success = validatedQuery.success;
    }
    
    if (validatedQuery.subreddit) {
      where.subreddit = validatedQuery.subreddit;
    }
    
    if (validatedQuery.keyword) {
      where.keyword = validatedQuery.keyword;
    }
    
    if (validatedQuery.startDate || validatedQuery.endDate) {
      where.timestamp = {};
      if (validatedQuery.startDate) {
        where.timestamp.gte = new Date(validatedQuery.startDate);
      }
      if (validatedQuery.endDate) {
        where.timestamp.lte = new Date(validatedQuery.endDate);
      }
    }

    const [activities, totalCount] = await Promise.all([
      prisma.botActivity.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        take: validatedQuery.limit,
        skip: validatedQuery.offset,
      }),
      prisma.botActivity.count({ where }),
    ]);

    res.json({
      success: true,
      data: activities,
      pagination: {
        total: totalCount,
        limit: validatedQuery.limit,
        offset: validatedQuery.offset,
        hasMore: validatedQuery.offset + validatedQuery.limit < totalCount,
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
    
    console.error('Error fetching activities:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch activities' 
    });
  }
});

// GET /api/activities/stats - Get activity statistics
router.get('/stats', async (req, res) => {
  try {
    const { days = '7' } = req.query;
    const daysNumber = parseInt(days as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNumber);

    const [
      totalActivities,
      successfulActivities,
      failedActivities,
      activitiesBySubreddit,
      activitiesByKeyword,
      recentActivities,
    ] = await Promise.all([
      // Total activities
      prisma.botActivity.count({
        where: { timestamp: { gte: startDate } },
      }),
      
      // Successful activities
      prisma.botActivity.count({
        where: { 
          timestamp: { gte: startDate },
          success: true 
        },
      }),
      
      // Failed activities
      prisma.botActivity.count({
        where: { 
          timestamp: { gte: startDate },
          success: false 
        },
      }),
      
      // Activities by subreddit
      prisma.botActivity.groupBy({
        by: ['subreddit'],
        where: { timestamp: { gte: startDate } },
        _count: { subreddit: true },
        orderBy: { _count: { subreddit: 'desc' } },
        take: 10,
      }),
      
      // Activities by keyword
      prisma.botActivity.groupBy({
        by: ['keyword'],
        where: { timestamp: { gte: startDate } },
        _count: { keyword: true },
        orderBy: { _count: { keyword: 'desc' } },
        take: 10,
      }),
      
      // Recent activities (last 24 hours)
      prisma.botActivity.count({
        where: { 
          timestamp: { 
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) 
          } 
        },
      }),
    ]);

    const successRate = totalActivities > 0 ? (successfulActivities / totalActivities) * 100 : 0;

    res.json({
      success: true,
      data: {
        period: `${daysNumber} days`,
        totalActivities,
        successfulActivities,
        failedActivities,
        successRate: Math.round(successRate * 100) / 100,
        recentActivities,
        topSubreddits: activitiesBySubreddit.map(item => ({
          subreddit: item.subreddit,
          count: item._count.subreddit,
        })),
        topKeywords: activitiesByKeyword.map(item => ({
          keyword: item.keyword,
          count: item._count.keyword,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching activity stats:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch activity statistics' 
    });
  }
});

// GET /api/activities/:id - Get specific activity
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const activity = await prisma.botActivity.findUnique({
      where: { id },
    });

    if (!activity) {
      return res.status(404).json({ 
        success: false, 
        error: 'Activity not found' 
      });
    }

    res.json({
      success: true,
      data: activity,
    });
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch activity' 
    });
  }
});

// DELETE /api/activities/:id - Delete specific activity
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.botActivity.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Activity deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete activity' 
    });
  }
});

export default router;

