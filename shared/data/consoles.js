/**
 * Legend Games - Console Catalog Data
 */
const CONSOLES_DATA = {
  ps3: {
    id: 'ps3',
    name: 'PlayStation 3',
    shortName: 'PS3',
    tagline: 'Classic Seventh-Gen Gaming Powerhouse',
    badge: 'Retro Value',
    accentColor: '#3b82f6',
    platform: 'PlayStation',
    hasModdedOption: true,
    hasFCBundle: false,
    image: 'https://images.unsplash.com/photo-1526509867162-5b0c0d1b4b33?auto=format&fit=crop&w=800&q=80',
    description: 'Relive iconic classics, jailbroken setups, and massive local game libraries with smooth performance.',
    variants: [
      {
        id: 'ps3-fat',
        name: 'PS3 Fat (Original)',
        storage: '80GB - 160GB HDD',
        basePrice: 65000,
        specBlurb: 'Classic original body design, backward compatibility capabilities, high durability hardware.',
        popular: false
      },
      {
        id: 'ps3-slim',
        name: 'PS3 Slim',
        storage: '160GB - 320GB HDD',
        basePrice: 85000,
        specBlurb: 'The community favorite: quiet whisper cooling, low power consumption, perfect for full CFW jailbreak & multiMAN.',
        popular: true
      },
      {
        id: 'ps3-superslim',
        name: 'PS3 Super Slim',
        storage: '250GB - 500GB HDD',
        basePrice: 95000,
        specBlurb: 'Ultra-compact sliding disc tray design, newest production run with enhanced reliability & cool temps.',
        popular: false
      }
    ]
  },
  ps4: {
    id: 'ps4',
    name: 'PlayStation 4',
    shortName: 'PS4',
    tagline: 'The Ultimate Modern Gaming Workhorse',
    badge: 'Best Seller',
    accentColor: '#006FCD',
    platform: 'PlayStation',
    hasModdedOption: true,
    hasFCBundle: true,
    image: 'https://images.unsplash.com/photo-1507457379470-08b800bebc67?auto=format&fit=crop&w=800&q=80',
    description: 'Immerse yourself in blockbuster PS4 titles in 1080p and HDR with immense library support & hard drive expansions.',
    variants: [
      {
        id: 'ps4-fat',
        name: 'PS4 Fat (Original Matte/Gloss)',
        storage: '500GB HDD',
        basePrice: 170000,
        specBlurb: 'Classic launch model delivering raw PS4 performance and optical audio output at the most affordable price point.',
        popular: false
      },
      {
        id: 'ps4-slim',
        name: 'PS4 Slim',
        storage: '500GB - 1TB HDD',
        basePrice: 215000,
        specBlurb: 'Sleek, power-efficient, whisper-quiet revision with 5GHz Wi-Fi and HDR support. High demand for modded firmware (9.00 / 11.00).',
        popular: true
      },
      {
        id: 'ps4-pro',
        name: 'PS4 Pro',
        storage: '1TB HDD',
        basePrice: 285000,
        specBlurb: 'Enhanced 4.2 TFLOP GPU enabling 4K gaming, boost mode for high frame rates, extra rear USB port for external hard drives.',
        popular: false
      }
    ]
  },
  ps5: {
    id: 'ps5',
    name: 'PlayStation 5',
    shortName: 'PS5',
    tagline: 'Performance Phenomenon with Ultra-High Speed SSD',
    badge: 'Next Gen',
    accentColor: '#ffffff',
    platform: 'PlayStation',
    hasModdedOption: false,
    hasFCBundle: true,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
    description: 'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback, and breathtaking 4K 120FPS graphics.',
    variants: [
      {
        id: 'ps5-digital',
        name: 'PS5 Digital Edition (Original)',
        storage: '825GB Custom NVMe SSD',
        basePrice: 620000,
        specBlurb: 'All-digital streamlined design, seamless PSN store access, Ray Tracing, Tempest 3D AudioTech.',
        popular: false
      },
      {
        id: 'ps5-disc',
        name: 'PS5 Disc Edition (Original)',
        storage: '825GB Custom NVMe SSD',
        basePrice: 695000,
        specBlurb: 'Plays 4K Ultra HD Blu-ray discs and physical PS4/PS5 games, unmatched backward compatibility with disc collections.',
        popular: true
      },
      {
        id: 'ps5-slim-digital',
        name: 'PS5 Slim Digital',
        storage: '1TB Custom NVMe SSD',
        basePrice: 660000,
        specBlurb: '30% smaller volume, upgraded 1TB internal storage, modular attachable disc drive capability.',
        popular: false
      },
      {
        id: 'ps5-slim-disc',
        name: 'PS5 Slim Disc Edition',
        storage: '1TB Custom NVMe SSD',
        basePrice: 740000,
        specBlurb: 'The complete Performance package with 1TB SSD storage, sleek modern lines, and built-in Ultra HD Blu-ray drive.',
        popular: true
      }
    ]
  },
  xbox: {
    id: 'xbox',
    name: 'Xbox Family',
    shortName: 'Xbox',
    tagline: 'Xbox One & Xbox Series X|S Performance',
    badge: 'Game Pass Power',
    accentColor: '#107c10',
    platform: 'Xbox',
    hasModdedOption: false,
    hasFCBundle: false,
    image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=800&q=80',
    description: 'Dive into Microsoft’s rich ecosystem with Quick Resume, Smart Delivery, and immense backwards compatibility across generations.',
    variants: [
      {
        id: 'xbox-one-s',
        name: 'Xbox One S',
        storage: '500GB - 1TB HDD',
        basePrice: 155000,
        specBlurb: 'HDR gaming, 4K video streaming, 40% smaller footprint with internal power supply.',
        popular: false
      },
      {
        id: 'xbox-one-x',
        name: 'Xbox One X',
        storage: '1TB HDD',
        basePrice: 210000,
        specBlurb: 'True 4K gaming powerhouse of the 8th gen with 6 Teraflops GPU & 12GB GDDR5 graphic memory.',
        popular: false
      },
      {
        id: 'xbox-series-s',
        name: 'Xbox Series S (Performance Digital)',
        storage: '512GB - 1TB SSD',
        basePrice: 380000,
        specBlurb: 'Performance speed up to 120 FPS, Ray Tracing, Quick Resume, all-digital compact chassis.',
        popular: true
      },
      {
        id: 'xbox-series-x',
        name: 'Xbox Series X (Flagship 4K)',
        storage: '1TB Custom NVMe SSD',
        basePrice: 710000,
        specBlurb: '12 Teraflops of raw processing speed, 4K @ 120Hz true gaming, Blu-ray disc drive, top-tier performance.',
        popular: true
      }
    ]
  }
};

if (typeof window !== 'undefined') {
  window.CONSOLES_DATA = CONSOLES_DATA;
}
