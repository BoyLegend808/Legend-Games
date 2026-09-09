# Image Replacement Strategy — Legend Games

## 🚨 Critical Issue: Generic Stock Photos

**Current Problem**: All product images use generic Unsplash stock photos instead of real product images, making the site look like a template/AI-generated site rather than an authentic gaming shop.

### Affected Files
- `shared/data/games.js` — 25+ game cover images
- `shared/data/consoles.js` — 4 console images  
- `shared/data/accessories.js` — Multiple accessory images
- `shared/data/bundles.js` — 4 bundle images
- `shared/data/wraps.js` — 6 wrap images
- `home/home.html` — 4 popular picks images

### Current Image Pattern
```javascript
// Current generic pattern (BAD)
cover: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80'
```

## 📋 Replacement Strategy

### Phase 1: Priority Product Images (High Impact)

**Consoles (4 images)**
- PS5 Slim: Replace with actual PS5 Slim product photo
- PS4 Slim: Replace with actual PS4 Slim product photo  
- PS3 Fat/Slim: Replace with actual PS3 product photo
- Xbox Series X: Replace with actual Xbox Series X product photo

**Top-Selling Games (10 images)**
- EA Sports FC 26
- GTA V
- Spider-Man 2
- God of War Ragnarok
- Mortal Kombat 1
- Call of Duty
- FIFA/FC series
- NBA 2K
- Resident Evil 4
- Tekken 8

### Phase 2: Accessories & Bundles (Medium Impact)

**Controllers & Headsets**
- DualSense Wireless Controller
- DualSense Edge
- Pulse 3D Headset
- Xbox Controller

**Bundle Images**
- PS4 Slim Ultimate Gamer Combo
- PS5 Digital Edition Bundle
- Xbox Series S Bundle

### Phase 3: Remaining Games & Wraps (Lower Priority)

Complete replacement of remaining game covers and console wrap images.

## 🎯 Image Sourcing Guidelines

### Recommended Sources
1. **Official Product Photos**: Download from manufacturer websites (Sony, Microsoft, EA, etc.)
2. **Press Kit Images**: Game publishers provide official press kits
3. **Local Photography**: Take actual photos of your inventory
4. **Authorized Retailers**: Reference images from authorized retailers

### Image Specifications
- **Format**: WebP (preferred) or high-quality JPEG
- **Size**: 600-800px width for product cards, 800-1200px for detail views
- **Background**: Clean, preferably white or neutral
- **Quality**: Product-focused, well-lit, professional appearance
- **Consistency**: Maintain similar lighting and styling across all images

### File Naming Convention
```
/images/products/consoles/ps5-slim-official.webp
/images/products/games/fc26-cover.webp
/images/products/accessories/dualsense-controller.webp
```

## 🔧 Implementation Steps

### Step 1: Create Image Directory Structure
```
/images/
  /products/
    /consoles/
    /games/
    /accessories/
    /bundles/
    /wraps/
```

### Step 2: Replace Image URLs in Data Files

**Example Replacement:**
```javascript
// Before (Generic Unsplash)
{
  id: 'ps5-slim-digital',
  title: 'PS5 Slim Digital Edition',
  image: 'https://images.unsplash.com/photo-1526509867162-5b0c0d1b4b33?auto=format&fit=crop&w=800&q=80'
}

// After (Real Product Image)
{
  id: 'ps5-slim-digital',
  title: 'PS5 Slim Digital Edition',
  image: '../images/products/consoles/ps5-slim-digital.webp'
}
```

### Step 3: Update Hardcoded HTML Images

Files with hardcoded image references:
- `home/home.html` — Popular picks section
- Any other static HTML with direct image URLs

## 📊 Image Inventory Checklist

### Consoles (4 total)
- [ ] PS5 Slim image
- [ ] PS4 Slim image  
- [ ] PS3 image
- [ ] Xbox Series X image

### Top Games (10 priority)
- [ ] EA Sports FC 26
- [ ] GTA V
- [ ] Spider-Man 2
- [ ] God of War Ragnarok
- [ ] Mortal Kombat 1
- [ ] Call of Duty
- [ ] NBA 2K
- [ ] Resident Evil 4
- [ ] Tekken 8
- [ ] FC series

### Accessories (4 priority)
- [ ] DualSense Controller
- [ ] DualSense Edge
- [ ] Pulse 3D Headset
- [ ] Xbox Controller

### Bundles (4 total)
- [ ] PS4 Slim Ultimate Combo
- [ ] PS5 Digital Bundle
- [ ] Xbox Series S Bundle
- [ ] PS5 Disc Bundle

## 🎨 Brand Consistency Tips

1. **Lighting**: Use consistent lighting across all product photos
2. **Angles**: Standardize product angles (front-facing, 45-degree, etc.)
3. **Background**: Keep backgrounds clean and consistent
4. **Sizing**: Maintain consistent aspect ratios
5. **Quality**: Ensure all images are high-resolution and professional

## ⚡ Quick Win Alternative

If immediate photography isn't possible, consider:
- Using manufacturer official product images from press kits
- Sourcing from authorized Nigerian gaming retailers' websites
- Using placeholder service with gaming-relevant images until real photos are available

## 🚀 Implementation Priority

**Week 1**: Replace console images (highest impact, lowest quantity)
**Week 2**: Replace top 10 selling games  
**Week 3**: Replace accessories and bundles
**Week 4**: Complete remaining games and wraps

## 📝 Notes

- This is the single most impactful change to make the site look authentic
- Generic stock photos immediately signal "template site" to customers
- Real product photos build trust and show actual inventory
- Consider this investment in brand credibility essential for conversion