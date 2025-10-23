import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get Discord activities
router.get('/activities', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const activities = await prisma.discordActivity.findMany({
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      orderBy: { timestamp: 'desc' },
    });

    res.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error('Error fetching Discord activities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Discord activities',
    });
  }
});

// Get Discord activity statistics
router.get('/activities/stats', async (req, res) => {
  try {
    const [
      totalActivities,
      successfulActivities,
      recentActivities,
      guildStats,
    ] = await Promise.all([
      prisma.discordActivity.count(),
      prisma.discordActivity.count({ where: { success: true } }),
      prisma.discordActivity.count({
        where: {
          timestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      }),
      prisma.discordActivity.groupBy({
        by: ['guildId'],
        _count: { guildId: true },
        _sum: { success: true },
      }),
    ]);

    const successRate = totalActivities > 0 ? (successfulActivities / totalActivities) * 100 : 0;

    res.json({
      success: true,
      data: {
        totalActivities,
        successfulActivities,
        failedActivities: totalActivities - successfulActivities,
        successRate,
        recentActivities,
        guildStats,
      },
    });
  } catch (error) {
    console.error('Error fetching Discord activity stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Discord activity statistics',
    });
  }
});

// Get Discord configurations
router.get('/configs', async (req, res) => {
  try {
    const configs = await prisma.discordConfig.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: configs,
    });
  } catch (error) {
    console.error('Error fetching Discord configs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Discord configurations',
    });
  }
});

// Create Discord configuration
router.post('/configs', async (req, res) => {
  try {
    const { guildId, guildName, channels, enabled = true } = req.body;

    if (!guildId || !guildName) {
      return res.status(400).json({
        success: false,
        error: 'Guild ID and name are required',
      });
    }

    const config = await prisma.discordConfig.upsert({
      where: { guildId },
      update: {
        guildName,
        channels: JSON.stringify(channels || []),
        enabled,
      },
      create: {
        guildId,
        guildName,
        channels: JSON.stringify(channels || []),
        enabled,
      },
    });

    res.json({
      success: true,
      data: config,
    });
  } catch (error) {
    console.error('Error creating Discord config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create Discord configuration',
    });
  }
});

// Update Discord configuration
router.put('/configs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { guildName, channels, enabled } = req.body;

    const config = await prisma.discordConfig.update({
      where: { id },
      data: {
        guildName,
        channels: channels ? JSON.stringify(channels) : undefined,
        enabled,
      },
    });

    res.json({
      success: true,
      data: config,
    });
  } catch (error) {
    console.error('Error updating Discord config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update Discord configuration',
    });
  }
});

// Delete Discord configuration
router.delete('/configs/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.discordConfig.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Discord configuration deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting Discord config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete Discord configuration',
    });
  }
});

export default router;
