/**
 * Legend Games - Accessories Catalog Data
 */
const ACCESSORIES_DATA = [
  {
    id: 'ps5-dualsense-white',
    name: 'PS5 DualSense Wireless Controller (White / Midnight Black)',
    category: 'Controllers',
    platform: 'PS5 / PC',
    price: 68000,
    badge: 'Official Sony',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80',
    description: 'Haptic feedback, dynamic adaptive triggers, built-in microphone and headset jack.'
  },
  {
    id: 'ps5-dualsense-cosmic-red',
    name: 'PS5 DualSense Wireless Controller (Cosmic Red / Starlight Blue)',
    category: 'Controllers',
    platform: 'PS5 / PC',
    price: 72000,
    badge: 'Special Edition',
    image: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=600&q=80',
    description: 'Vibrant Galaxy collection colorways with premium grip and responsive controls.'
  },
  {
    id: 'ps4-dualshock-v2',
    name: 'PS4 DualShock 4 Wireless Controller (V2 Jet Black)',
    category: 'Controllers',
    platform: 'PS4 / PC / Mobile',
    price: 25000,
    badge: 'Top Seller',
    image: 'https://images.unsplash.com/photo-1593118247619-e2d6f056869e?auto=format&fit=crop&w=600&q=80',
    description: 'Refined analog sticks, lightbar touchpad, share button, and rechargeable lithium battery.'
  },
  {
    id: 'ps4-dualshock-camo',
    name: 'PS4 DualShock 4 (Green Camo / Glacier White)',
    category: 'Controllers',
    platform: 'PS4 / PC',
    price: 27000,
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?auto=format&fit=crop&w=600&q=80',
    description: 'Custom textured finish with military camo pattern and precision thumbsticks.'
  },
  {
    id: 'xbox-series-controller-robot-white',
    name: 'Xbox Wireless Controller (Robot White / Carbon Black)',
    category: 'Controllers',
    platform: 'Xbox / PC / Android / iOS',
    price: 58000,
    badge: 'Xbox Official',
    image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=600&q=80',
    description: 'Textured grip on triggers, hybrid D-pad, Bluetooth connectivity, and dedicated Share button.'
  },
  {
    id: 'ps3-dualshock-3',
    name: 'PS3 DualShock 3 Wireless Controller (OEM Quality)',
    category: 'Controllers',
    platform: 'PS3 / PC',
    price: 12000,
    badge: 'Retro Essential',
    image: 'https://images.unsplash.com/photo-1526509867162-5b0c0d1b4b33?auto=format&fit=crop&w=600&q=80',
    description: 'Sixaxis motion-sensing technology, dual vibration motors, and Bluetooth 2.0.'
  },
  {
    id: 'pulse-3d-headset',
    name: 'Sony PULSE 3D Wireless Headset for PS5 & PS4',
    category: 'Headsets',
    platform: 'PS5 / PS4 / PC',
    price: 95000,
    badge: '3D Audio King',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
    description: 'Fine-tuned for 3D Audio on PS5 consoles, dual noise-cancelling microphones, USB Type-C charging.'
  },
  {
    id: 'hyperx-cloud-stinger',
    name: 'HyperX Cloud Stinger 2 Gaming Headset',
    category: 'Headsets',
    platform: 'Multi-Platform (PS4/PS5/Xbox/PC)',
    price: 38000,
    badge: 'Pro Audio',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    description: 'Lightweight comfort, 50mm directional drivers, swivel-to-mute mic, durable steel sliders.'
  },
  {
    id: 'ps5-charging-station',
    name: 'DualSense Charging Station (Dual Dock)',
    category: 'Docks & Cables',
    platform: 'PS5',
    price: 24000,
    badge: 'Convenience',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
    description: 'Click-in design charges up to two DualSense controllers simultaneously without tying up USB ports.'
  },
  {
    id: 'hdmi-21-ultra-cable',
    name: 'High-Speed 8K / 4K 120Hz HDMI 2.1 Cable (2 Meters)',
    category: 'Docks & Cables',
    platform: 'PS5 / Xbox Series X / PC',
    price: 8500,
    badge: 'High Speed',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    description: 'Braided 48Gbps ultra bandwidth supporting eARC, HDR10+, VRR, and low latency 120Hz gaming.'
  },
  {
    id: 'thumb-grip-caps-set',
    name: 'Silicone Thumb Grip Extenders & Anti-Slip Caps (4-Pack)',
    category: 'Protection',
    platform: 'PS4 / PS5 / Xbox',
    price: 3000,
    badge: 'Add-On',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    description: 'Height boost for precision aiming in shooters and anti-sweat textured concave thumb rests.'
  },
  {
    id: 'ps4-cooling-vertical-stand',
    name: 'PS4 Multi-Function Vertical Stand with Dual Cooling Fans',
    category: 'Docks & Cables',
    platform: 'PS4 (Fat/Slim/Pro)',
    price: 18000,
    badge: 'Cooling Hub',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
    description: 'High-speed twin cooling fans, dual controller charging docks, and 12-game disc storage rack.'
  }
];

if (typeof window !== 'undefined') {
  window.ACCESSORIES_DATA = ACCESSORIES_DATA;
}
