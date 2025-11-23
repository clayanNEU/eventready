# EventReady - Quick Setup Guide

## 🚀 You're Almost Ready!

Your EventReady app is built and running at **http://localhost:3000**

## ⚡ Next Steps (5 minutes)

### 1. Get Your fal.ai API Key

1. Go to https://fal.ai/dashboard/usage-billing/credits
2. Sign up or log in
3. Click "Apply Credits" and enter coupon: **lovefluxfal**
4. Get $100 in free credits!
5. Copy your API key from the dashboard

### 2. Add API Key to .env.local

Open `.env.local` and add your API key:

```bash
FAL_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Restart the Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

## 📝 First Time Usage

### Step 1: Set Up Brand Assets
1. Click "🎨 Brand Assets" tab
2. Upload your run club logo
3. Add your brand colors (e.g., #FF6B35, #004E89)
4. Describe your style: "bold, energetic, community-focused"
5. Click "Save Brand Assets"

### Step 2: Add Reference Flyers
1. Click "📚 Flyer Library" tab
2. Click "+ Upload Flyer"
3. Upload 2-3 past flyers that worked well
4. Mark your favorites with ⭐
5. Add notes on why they worked

### Step 3: Generate Your First Flyer
1. Click "✨ Generate Flyer" tab
2. Fill in event details:
   - Event Name: "Tuesday Night Run"
   - Date: Next Tuesday
   - Time: 7:00 PM
   - Location: "Central Park"
   - Theme: "High energy, community vibes"
3. Select a favorite flyer as reference (optional)
4. Click "✨ Generate Flyer"
5. Wait 10-30 seconds
6. Download or save to library!

## 🎯 Demo Tips for Hackathon

### Before Your Demo:
- Have 2-3 example flyers uploaded
- Mark at least one as favorite ⭐
- Have your brand assets saved
- Prepare a real event to demo:
  - "Thanksgiving 5K Run"
  - Date: Nov 28, 2024
  - Time: 8:00 AM
  - Location: "Boston Common"
  - Theme: "Festive, family-friendly, community celebration"

### During Your Demo (3 minutes):
1. **Hook** (30 sec): "30 minutes in ChatGPT vs 10 seconds in EventReady"
2. **Problem** (30 sec): Show how tools forget your brand
3. **Solution** (1 min):
   - Show Brand Assets (pre-loaded)
   - Show Flyer Library with favorites
4. **Magic Moment** (1 min):
   - Generate new flyer in real-time
   - "Look - same style, new event, 10 seconds"
   - Download and show result
5. **Impact** (30 sec): "50M+ community Instagram posts need this"

### Key Talking Points:
- "Remembers your brand identity"
- "Learns from your favorites"
- "10 seconds vs 30 minutes"
- "Perfect for Instagram, Partiful, social media"
- "Every grassroots org has this problem"

## 🐛 Troubleshooting

### Error: "FAL_API_KEY environment variable is not set"
- Make sure you added the API key to `.env.local`
- Restart the dev server after adding it

### Images not showing up
- Check that `public/uploads/` directory exists
- Make sure file permissions are correct

### Build fails
```bash
rm -rf .next
npm run build
```

## 📦 Deployment to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard:
# - FAL_API_KEY
# - NEXT_PUBLIC_BASE_URL (your deployed URL)
```

## 🎨 Customization Ideas

- Change color scheme in `app/page.tsx`
- Add more image size options
- Implement batch generation
- Add template presets
- Connect to calendar API

## 💡 Cost Estimates

- Each flyer: ~$0.03-0.05
- Your $100 credits: ~2,000-3,000 flyers
- Perfect for hackathon demo!

## 📞 Support

If something's not working:
1. Check the browser console for errors
2. Check the terminal for server errors
3. Verify your API key is correct
4. Make sure all dependencies installed: `npm install`

---

**Good luck with your hackathon!** 🎉

Built with FLUX.2 + fal.ai + Next.js
