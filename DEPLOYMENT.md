# Deployment Guide

This guide explains how to deploy ShiftMind to production using Vercel.

## Prerequisites

1. A Vercel account (https://vercel.com)
2. A Supabase project (https://supabase.com)
3. Git repository with your ShiftMind code
4. (Optional) SideShift.ai API key for advanced features

## Step 1: Prepare Your Repository

1. Ensure your code is in a Git repository (GitHub recommended for Vercel integration)
2. Make sure you have the following files:
   - `vercel.json` (deployment configuration)
   - `.env.production` (production environment variables)
   - `vite.config.ts` (Vite configuration)

## Step 2: Set Up Supabase

1. Create a new Supabase project if you haven't already
2. Get your project URL and anon key from Project Settings > API
3. Run the migration scripts in `supabase/migrations/`
4. Enable Row Level Security (RLS) policies

## Step 3: Deploy to Vercel

1. Go to https://vercel.com/new
2. Import your repository
3. Configure the following settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. Add the following environment variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_SIDESHIFT_API_URL=https://api.sideshift.ai/v2
   VITE_NETWORK_NAME=polygon
   VITE_CHAIN_ID=137
   VITE_ENVIRONMENT=production
   ```

5. Click "Deploy"

## Step 4: Domain Setup (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Configure DNS settings as instructed by Vercel

## Step 5: Production Checks

After deployment, verify:

1. Application loads correctly
2. Wallet connection works
3. Supabase connection is successful
4. SideShift.ai API integration functions
5. All pages render properly
6. Automatic swap functionality works
7. Manual swap interface is responsive
8. Error messages are clear and helpful

## Troubleshooting

Common issues and solutions:

1. "Failed to fetch" errors:
   - Check CORS settings in Supabase
   - Verify API endpoints are accessible
   - Check network/firewall settings

2. Wallet connection issues:
   - Ensure correct network (Polygon)
   - Verify Web3 provider configuration

3. Database connection errors:
   - Verify environment variables
   - Check Supabase RLS policies
   - Confirm database is active

## Monitoring

1. Set up error monitoring:
   - Enable Vercel Analytics
   - Configure error logging
   - Monitor API response times

2. Database monitoring:
   - Watch Supabase usage
   - Monitor query performance
   - Set up alerts for errors

## Security Considerations

1. Environment Variables:
   - Never commit sensitive keys
   - Use Vercel's encrypted environment variables
   - Rotate keys periodically

2. API Security:
   - Implement rate limiting
   - Use secure headers
   - Monitor for unusual activity

3. User Data:
   - Implement proper authentication
   - Use RLS policies in Supabase
   - Regular security audits

## Performance Optimization

1. Enable automatic optimizations:
   ```json
   // vercel.json
   {
     "images": {
       "sizes": [640, 750, 828, 1080, 1200],
       "domains": ["your-domain.com"]
     }
   }
   ```

2. Configure caching:
   - Set cache headers
   - Enable CDN caching
   - Implement service worker

## Maintenance

Regular tasks:

1. Update dependencies monthly
2. Monitor error logs
3. Check performance metrics
4. Update API keys if needed
5. Backup database regularly

## Support

For deployment issues:
1. Check Vercel status page
2. Review application logs
3. Contact support team
4. Consult documentation