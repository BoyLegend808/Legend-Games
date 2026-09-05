/**
 * Legend Games - External Hard Disks & Storage Loading Config
 * Usable buffer: e.g. 90% of total stated capacity to ensure stability and file system overhead.
 */
const DISKS_DATA = {
  bufferPercentage: 0.90, // Max 90% fill rate allowed
  capacities: [
    {
      id: 'disk-500gb',
      capacityTB: 0.5,
      capacityGB: 500,
      label: '500 GB External HDD',
      usableGB: 450,
      ps4Price: 28000,
      pcPrice: 26000,
      badge: 'Starter',
      description: 'Fits approx. 8-12 blockbuster titles. High-speed USB 3.0 plug & play.'
    },
    {
      id: 'disk-1tb',
      capacityTB: 1,
      capacityGB: 1000,
      label: '1 TB External HDD',
      usableGB: 900,
      ps4Price: 42000,
      pcPrice: 39000,
      badge: 'Most Popular',
      description: 'Fits approx. 20-30 top tier games. High portability with protective silicone bumper.'
    },
    {
      id: 'disk-2tb',
      capacityTB: 2,
      capacityGB: 2000,
      label: '2 TB External HDD',
      usableGB: 1800,
      ps4Price: 65000,
      pcPrice: 60000,
      badge: 'Best Value',
      description: 'Massive library capacity (45-60 games). Never delete a game to make room again.'
    },
    {
      id: 'disk-3tb',
      capacityTB: 3,
      capacityGB: 3000,
      label: '3 TB External HDD',
      usableGB: 2700,
      ps4Price: 88000,
      pcPrice: 82000,
      badge: 'Collector Choice',
      description: 'Huge archive capacity for heavy gamers and comprehensive modded collections.'
    },
    {
      id: 'disk-4tb',
      capacityTB: 4,
      capacityGB: 4000,
      label: '4 TB External HDD',
      usableGB: 3600,
      ps4Price: 115000,
      pcPrice: 108000,
      badge: 'Ultimate Vault',
      description: 'The definitive complete gaming vault with room for 100+ titles and expansion updates.'
    }
  ]
};

if (typeof window !== 'undefined') {
  window.DISKS_DATA = DISKS_DATA;
}
