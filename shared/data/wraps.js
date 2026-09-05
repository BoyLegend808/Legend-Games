/**
 * Legend Games - Custom Skin & Wrap Catalog
 * Available as console add-on or standalone customization service.
 */
const WRAPS_DATA = [
  {
    id: 'wrap-spiderman-symbiote',
    name: 'Spider-Man 2: Symbiote Tendrils & Red Logo',
    theme: 'Superhero / Marvel',
    badge: 'Trending #1',
    supportedPlatforms: ['PS5 Disc', 'PS5 Digital', 'PS5 Slim', 'PS4 Slim', 'PS4 Pro'],
    addonPrice: 15000,
    standalonePrice: 20000,
    image: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?auto=format&fit=crop&w=600&q=80',
    description: 'Ultra-matte 3M vinyl skin featuring aggressive black symbiote tendrils engulfing the iconic crimson spider emblem.'
  },
  {
    id: 'wrap-cyberpunk-samurai',
    name: 'Cyberpunk 2077: Samurai Neon Yellow',
    theme: 'Sci-Fi / Cyberpunk',
    badge: 'Popular',
    supportedPlatforms: ['PS5 Disc', 'PS5 Digital', 'PS4 Slim', 'PS4 Pro', 'Xbox Series X', 'Xbox Series S'],
    addonPrice: 15000,
    standalonePrice: 20000,
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    description: 'Electrifying Night City yellow with circuit board traces and high-durability scratch-resistant UV matte coating.'
  },
  {
    id: 'wrap-gow-ragnarok-nordic',
    name: 'God of War Ragnarök: Nordic Frost & Runes',
    theme: 'Mythological',
    badge: 'Best Seller',
    supportedPlatforms: ['PS5 Disc', 'PS5 Digital', 'PS5 Slim', 'PS4 Slim', 'PS4 Pro'],
    addonPrice: 16000,
    standalonePrice: 22000,
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
    description: 'Intricately etched gold runic inscriptions and Leviathan Axe ice motifs over battle-worn obsidian.'
  },
  {
    id: 'wrap-gta-los-santos',
    name: 'GTA Los Santos Heist Camo',
    theme: 'Street / Urban',
    badge: 'Classic',
    supportedPlatforms: ['PS4 Fat', 'PS4 Slim', 'PS4 Pro', 'PS3 Slim', 'Xbox One S'],
    addonPrice: 14000,
    standalonePrice: 18000,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    description: 'Dark urban camouflage pattern adorned with subtle Los Santos street map contours and graffiti accents.'
  },
  {
    id: 'wrap-carbon-stealth-black',
    name: '3D Carbon Fiber Stealth Matte Black',
    theme: 'Minimalist / Luxury',
    badge: 'Clean Aesthetic',
    supportedPlatforms: ['PS5 (All Models)', 'PS4 (All Models)', 'Xbox Series X/S', 'Xbox One'],
    addonPrice: 12000,
    standalonePrice: 16000,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    description: 'Authentic textured weave feel that repels fingerprints, heat, and scratches while giving a stealth aerospace look.'
  },
  {
    id: 'wrap-dragonball-ultra-instinct',
    name: 'Anime: Dragon Ball Super Ultra Instinct Glow',
    theme: 'Anime / Manga',
    badge: 'Fan Special',
    supportedPlatforms: ['PS5 Disc/Digital', 'PS4 Slim/Pro', 'Xbox Series S'],
    addonPrice: 15000,
    standalonePrice: 20000,
    image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=600&q=80',
    description: 'Silver and ethereal blue energy aura bursting across both console faceplates with matching controller skins.'
  }
];

if (typeof window !== 'undefined') {
  window.WRAPS_DATA = WRAPS_DATA;
}
