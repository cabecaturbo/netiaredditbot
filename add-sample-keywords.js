#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function addSampleKeywords() {
  try {
    console.log('🎯 Adding sample keyword rules...');
    
    // Read sample keywords
    const sampleKeywords = JSON.parse(fs.readFileSync('sample-keywords.json', 'utf8'));
    
    for (const keyword of sampleKeywords) {
      try {
        const existing = await prisma.keywordRule.findFirst({
          where: { keyword: keyword.keyword }
        });
        
        if (existing) {
          console.log(`⚠️  Keyword "${keyword.keyword}" already exists, skipping...`);
          continue;
        }
        
        await prisma.keywordRule.create({
          data: {
            keyword: keyword.keyword,
            subreddit: keyword.subreddit,
            responseTemplate: keyword.responseTemplate,
            isActive: keyword.isActive
          }
        });
        
        console.log(`✅ Added keyword: "${keyword.keyword}"`);
      } catch (error) {
        console.error(`❌ Failed to add keyword "${keyword.keyword}":`, error.message);
      }
    }
    
    console.log('\n🎉 Sample keywords added successfully!');
    console.log('🤖 The bot is now ready to respond to these keywords:');
    
    const allKeywords = await prisma.keywordRule.findMany({
      where: { isActive: true }
    });
    
    allKeywords.forEach(rule => {
      const subreddit = rule.subreddit ? ` in r/${rule.subreddit}` : ' (anywhere)';
      console.log(`- "${rule.keyword}"${subreddit}`);
    });
    
  } catch (error) {
    console.error('❌ Error adding sample keywords:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSampleKeywords();
