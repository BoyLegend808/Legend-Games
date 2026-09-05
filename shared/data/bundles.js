/**
 * Legend Games - Curated Bundles & Combo Deals
 * Fixed bundles with exact variant support and clear savings breakdown.
 */
const BUNDLES_DATA = [
  {
    id: 'bundle-ps4-champion',
    name: 'PS4 Slim Ultimate Gamer Combo',
    tagline: 'Best-Selling Home Setup with Free FC Football Bundle',
    badge: 'HOT DEAL ',
    category: 'PS4 Deals',
    consolePlatform: 'ps4',
    variantId: 'ps4-slim',
    moddedStatus: 'offline-modded', // 'online-added' or 'offline-modded'
    bundlePrice: 245000,
    originalPrice: 285000,
    savings: 40000,
    image: 'https://images.unsplash.com/photo-1507457379470-08b800bebc67?auto=format&fit=crop&w=600&q=80',
    includedItems: [
      'PS4 Slim Console (500GB/1TB, Clean Condition)',
      '2x DualShock 4 Wireless Controllers (Black + Blue)',
      'Free EA SPORTS FC (Current Year Edition)',
      '10x Pre-installed Blockbuster Games (GTA V, God of War, MK11, PES 2021, etc.)',
      'Power Cable, HDMI 2.0 Cable, Controller Charging Cable'
    ]
  },
  {
    id: 'bundle-ps5-pro-setup',
    name: 'PS5 Performance Duo Power Bundle',
    tagline: 'Ultra HD Blu-Ray Console + 2nd DualSense + 2 Top Games',
    badge: 'FLAGSHIP Performance',
    category: 'PS5 Deals',
    consolePlatform: 'ps5',
    variantId: 'ps5-slim-disc',
    moddedStatus: 'online-added',
    bundlePrice: 830000,
    originalPrice: 895000,
    savings: 65000,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80',
    includedItems: [
      'PS5 Slim Disc Edition (1TB NVMe SSD)',
      '2x DualSense Wireless Controllers (White & Midnight Black)',
      'Free EA SPORTS FC (Current Year Edition)',
      'Marvel’s Spider-Man 2 or Call of Duty BO6 Disc',
      'High-Speed 8K Ultra HDMI 2.1 Cable & Official Power Cord'
    ]
  },
  {
    id: 'bundle-ps3-retro-vault',
    name: 'PS3 Super Slim Retro Juggernaut',
    tagline: 'Loaded 500GB HDD with 40+ Pre-Installed Classics',
    badge: 'RETRO SPECIAL',
    category: 'PS3 Deals',
    consolePlatform: 'ps3',
    variantId: 'ps3-superslim',
    moddedStatus: 'offline-modded',
    bundlePrice: 110000,
    originalPrice: 135000,
    savings: 25000,
    image: 'https://images.unsplash.com/photo-1526509867162-5b0c0d1b4b33?auto=format&fit=crop&w=600&q=80',
    includedItems: [
      'PS3 Super Slim Console (500GB HDD)',
      '2x DualShock 3 Wireless Controllers',
      'CFW / HEN MultiMAN Modded Setup',
      '40+ Installed Classics (GTA V, God of War 3, Blur, PES 2021 Mod, NFS, etc.)',
      'Power Cable & Gold Plated HDMI'
    ]
  },
  {
    id: 'bundle-xbox-series-s-kickstart',
    name: 'Xbox Series S GamePass Ready Starter',
    tagline: 'All-Digital Speed Monster with Extra Wireless Controller',
    badge: 'SMART VALUE',
    category: 'Xbox Deals',
    consolePlatform: 'xbox',
    variantId: 'xbox-series-s',
    moddedStatus: 'online-added',
    bundlePrice: 425000,
    originalPrice: 468000,
    savings: 43000,
    image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=600&q=80',
    includedItems: [
      'Xbox Series S 512GB Performance Console',
      '2x Xbox Wireless Controllers (Robot White + Carbon Black)',
      'Quick Resume and 120 FPS High Refresh Setup',
      'High Speed Ultra HDMI & AC Power Cable'
    ]
  }
];

if (typeof window !== 'undefined') {
  window.BUNDLES_DATA = BUNDLES_DATA;
}
