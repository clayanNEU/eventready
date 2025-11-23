# EventReady 🎉

**Brand-aware flyer generator for grassroots communities**

EventReady uses FLUX.2 AI to automatically generate on-brand event flyers for run clubs and grassroots organizations. It remembers your visual identity and learns from your favorite past designs.

Built for the FLUX Hackathon 2024.

## Problem

Creating consistent, on-brand event flyers is time-consuming and tedious:
- Designers have to manually recreate similar flyers for each event
- Generic AI tools have no memory of your brand
- Hard to maintain visual consistency across events
- 30+ minutes per flyer in ChatGPT or Canva

## Solution

EventReady is your brand-aware design assistant:
- **Remembers your brand**: Saves logos, colors, and style preferences
- **Learns from favorites**: Mark successful flyers to use as references
- **Generates in seconds**: New flyers in 10-30 seconds using FLUX.2
- **Perfect for social**: Optimized for Instagram, Partiful, and event platforms

## Features

### 🎨 Brand Asset Manager
- Upload your logo
- Define brand color palette
- Save style guidelines
- Consistent seed for reproducible results

### 📚 Flyer Library
- Store all your past flyers
- Mark favorites (⭐) for reference
- Add notes on what worked
- Quick download and sharing

### ✨ Smart Flyer Generator
- Input event details (name, date, time, location, theme)
- Select a favorite flyer as style reference
- FLUX.2 generates new flyer maintaining brand consistency
- Save successful flyers back to library

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **AI**: FLUX.2 via fal.ai (text-to-image & image-editing)
- **Storage**: JSON file-based (no database required)
- **Deployment**: Vercel (one-click deploy)

## Quick Start

### 1. Clone & Install

```bash
cd eventready
npm install
```

### 2. Set Up fal.ai API Key

1. Visit https://fal.ai/dashboard/usage-billing/credits
2. Sign up or log in
3. Apply coupon code: **lovefluxfal** for $100 credits
4. Get your API key from the dashboard
5. Create `.env.local`:

```bash
cp .env.local.example .env.local
```

6. Edit `.env.local` and add your API key:

```
FAL_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Usage Workflow

### First Time Setup:

1. **Brand Assets Tab**
   - Upload your logo
   - Set brand colors (hex codes)
   - Describe your style (e.g., "bold, energetic, minimalist")
   - Save brand assets

2. **Flyer Library Tab**
   - Upload 2-3 past flyers that worked well
   - Mark your favorites with ⭐
   - Add notes on why they worked

### Creating New Flyers:

1. **Generate Flyer Tab**
   - Fill in event details
   - Select a favorite flyer as reference (optional)
   - Click "Generate Flyer"
   - Wait 10-30 seconds for FLUX.2 to generate
   - Download or save to library
   - Mark as favorite if it turned out great!

## API Costs

Using fal.ai pricing:
- **Text-to-Image**: $0.015 + $0.015/megapixel
- **Image Editing**: $0.015 + $0.015/megapixel
- **Typical flyer** (portrait_4_3, ~1MP): ~$0.03-0.05 each

Your $100 credits = ~2,000-3,000 flyers!

## Deployment

### Deploy to Vercel:

```bash
npm install -g vercel
vercel
```

Set environment variables in Vercel dashboard:
- `FAL_API_KEY`
- `NEXT_PUBLIC_BASE_URL` (your deployed URL)

## Project Structure

```
eventready/
├── app/
│   ├── api/
│   │   ├── brand/route.ts          # Brand assets API
│   │   ├── flyers/route.ts         # Flyer library API
│   │   ├── flyers/[id]/route.ts    # Update/delete flyers
│   │   ├── upload/route.ts         # Image upload
│   │   └── generate/route.ts       # FLUX flyer generation
│   └── page.tsx                    # Main app UI
├── components/
│   ├── BrandAssets.tsx             # Brand management UI
│   ├── FlyerLibrary.tsx            # Flyer storage UI
│   └── FlyerGenerator.tsx          # Generation UI
├── lib/
│   ├── data.ts                     # JSON data management
│   └── fal-client.ts               # FLUX API client
├── types/
│   └── index.ts                    # TypeScript types
├── data/
│   └── app-data.json               # Persistent storage
└── public/uploads/                 # Uploaded images
```

## Hackathon Pitch

**Hook**: "Have you ever spent 30 minutes fighting with ChatGPT to make one event flyer that matches your brand?"

**Problem**: Run clubs and grassroots communities need consistent flyers for every event, but AI tools have no memory.

**Solution**: EventReady remembers your brand and learns from your favorites to generate consistent flyers in seconds.

**Impact**: 50M+ Instagram posts tagged #community. Every grassroots org needs this.

**Demo**: Brand setup → Library of favorites → Generate new flyer in 10 seconds

## Future Enhancements

- Multi-format export (Instagram Story, Post, Partiful)
- Team collaboration (share brand assets)
- Template marketplace
- Calendar integration
- A/B testing variants
- Batch generation for series

## License

MIT

## Built With

- FLUX.2 by Black Forest Labs
- fal.ai for fast inference
- Next.js & Vercel
- Tailwind CSS

---

**Made for grassroots communities who deserve beautiful, consistent design** 🏃‍♀️✨
