import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

const BusinessProfileSchema = z.object({
  name: z.string().min(1).max(100),
  services: z.array(z.string()).min(1),
  hours: z.string().min(1).max(200),
  contact: z.string().min(1).max(500),
  pricing: z.record(z.string()).optional(),
});

const UpdateBusinessProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  services: z.array(z.string()).min(1).optional(),
  hours: z.string().min(1).max(200).optional(),
  contact: z.string().min(1).max(500).optional(),
  pricing: z.record(z.string()).optional(),
});

// GET /api/profile - Get business profile
router.get('/', async (req, res) => {
  try {
    const profile = await prisma.businessProfile.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!profile) {
      // Return default profile if none exists
      const defaultProfile = {
        id: 'default',
        name: 'Netia AI Receptionist',
        services: ['Customer Support', 'AI Receptionist', '24/7 Assistance', 'Voice Reception'],
        hours: '24/7 Available',
        contact: 'Visit netiawebsite.vercel.app for more information',
        pricing: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return res.json({
        success: true,
        data: defaultProfile,
      });
    }

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('Error fetching business profile:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch business profile' 
    });
  }
});

// POST /api/profile - Create business profile
router.post('/', async (req, res) => {
  try {
    const validatedData = BusinessProfileSchema.parse(req.body);
    
    // Check if profile already exists
    const existingProfile = await prisma.businessProfile.findFirst();
    
    if (existingProfile) {
      return res.status(409).json({ 
        success: false, 
        error: 'Business profile already exists. Use PUT to update.' 
      });
    }
    
    const newProfile = await prisma.businessProfile.create({
      data: validatedData,
    });

    res.status(201).json({
      success: true,
      data: newProfile,
      message: 'Business profile created successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation error',
        details: error.errors 
      });
    }
    
    console.error('Error creating business profile:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create business profile' 
    });
  }
});

// PUT /api/profile - Update business profile
router.put('/', async (req, res) => {
  try {
    const validatedData = UpdateBusinessProfileSchema.parse(req.body);
    
    // Find existing profile
    const existingProfile = await prisma.businessProfile.findFirst();
    
    if (!existingProfile) {
      // Create new profile if none exists
      const newProfile = await prisma.businessProfile.create({
        data: {
          name: validatedData.name || 'Netia AI Receptionist',
          services: validatedData.services || ['Customer Support', 'AI Receptionist', '24/7 Assistance', 'Voice Reception'],
          hours: validatedData.hours || '24/7 Available',
          contact: validatedData.contact || 'Visit netiawebsite.vercel.app for more information',
          pricing: validatedData.pricing || {},
        },
      });

      return res.json({
        success: true,
        data: newProfile,
        message: 'Business profile created successfully',
      });
    }
    
    const updatedProfile = await prisma.businessProfile.update({
      where: { id: existingProfile.id },
      data: validatedData,
    });

    res.json({
      success: true,
      data: updatedProfile,
      message: 'Business profile updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation error',
        details: error.errors 
      });
    }
    
    console.error('Error updating business profile:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update business profile' 
    });
  }
});

// DELETE /api/profile - Delete business profile
router.delete('/', async (req, res) => {
  try {
    const profile = await prisma.businessProfile.findFirst();
    
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        error: 'Business profile not found' 
      });
    }
    
    await prisma.businessProfile.delete({
      where: { id: profile.id },
    });

    res.json({
      success: true,
      message: 'Business profile deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting business profile:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete business profile' 
    });
  }
});

export default router;

