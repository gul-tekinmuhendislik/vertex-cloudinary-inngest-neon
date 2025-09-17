# Vercel Deployment Guide

## Required Environment Variables

Please add the following environment variables in your Vercel Dashboard:

### Inngest Configuration
```
INNGEST_EVENT_KEY=g8nH2Z5xTW1N7LIWvhrn0oO6nDKARqMRyrF21CRFo9x79vq0fKBZqVb8aPr61Lfz6kc6UKwNW_z8FRe2iCwQAg
INNGEST_SIGNING_KEY=signkey-prod-0daacebdb22e9ab56c934744809aaeb843573002d499a8437414f2d93880aadd
```

### Cloudinary Configuration
```
CLOUDINARY_API_KEY=782682811169167
CLOUDINARY_API_SECRET=g0ojrhN_9uoubWmiVKz0f396KOo
CLOUDINARY_CLOUD_NAME=dgfdk0l8j
```

### Neon Database Configuration
```
DATABASE_URL=postgresql://neondb_owner:npg_fjQXK6w3iWDP@ep-polished-frog-adaec7m0-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

## Test Endpoints

After deployment, test these endpoints:

1. **Debug Endpoint**: https://vertex-cloudinary-inngest-neon.vercel.app/api/debug
   - Shows which environment variables are configured

2. **Inngest Dashboard**: https://vertex-cloudinary-inngest-neon.vercel.app/api/inngest
   - Inngest function dashboard

3. **Test Endpoints**:
   - https://vertex-cloudinary-inngest-neon.vercel.app/api/test-cloudinary
   - https://vertex-cloudinary-inngest-neon.vercel.app/api/test-neon
   - https://vertex-cloudinary-inngest-neon.vercel.app/api/test-inngest

## Important Notes

1. Make sure all environment variables are added in Vercel Dashboard → Settings → Environment Variables
2. After adding environment variables, redeploy the project
3. Check the /api/debug endpoint first to verify all keys are present