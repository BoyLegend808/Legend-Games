/**
 * Master Price List Controller
 */

const PriceListController = {
  activeCategory: 'all',
  searchQuery: '',

  init() {
    this.render();
  },

  setCategory(cat, btn) {
    this.activeCategory = cat;
    document.querySelectorAll('.filter-chips .chip').forEach(c => c.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.render();
  },

  filter(query) {
    this.searchQuery = (query || '').toLowerCase().trim();
    this.render();
  },

  getAllItems() {
    const items = [];

    // Consoles
    if (window.CONSOLES_DATA) {
      Object.values(CONSOLES_DATA).forEach(c => {
        c.variants.forEach(v => {
          items.push({
            category: 'consoles',
            title: `${c.name} — ${v.name}`,
            subtitle: `${v.storage} · ${v.specBlurb}`,
            price: v.basePrice
          });
        });
      });
    }

    // Games
    if (window.GAMES_CATALOG) {
      GAMES_CATALOG.forEach(g => {
        items.push({
          category: 'games',
          title: `${g.title} (Disc)`,
          subtitle: `${g.genre} · Platforms: ${g.platforms.join('/')}`,
          price: g.cdPrice
        });
      });
    }

    // Hard Disks
    const disks = [
      { size: '500GB HDD', desc: 'Pre-loaded ~10-15 games', price: 25000 },
      { size: '1TB HDD', desc: 'Pre-loaded ~20-30 games', price: 35000 },
      { size: '2TB HDD', desc: 'Pre-loaded ~45-60 games', price: 60000 },
      { size: '4TB HDD', desc: 'Pre-loaded ~90-120 games', price: 110000 }
    ];
    disks.forEach(d => {
      items.push({
        category: 'disks',
        title: `External Hard Drive (${d.size})`,
        subtitle: d.desc,
        price: d.price
      });
    });

    // Accessories
    if (window.ACCESSORIES_DATA) {
      ACCESSORIES_DATA.forEach(a => {
        items.push({
          category: 'accessories',
          title: a.name,
          subtitle: a.specs || a.category,
          price: a.price
        });
      });
    }

    return items;
  },

  render() {
    const container = document.getElementById('price-items-container');
    if (!container) return;

    let items = this.getAllItems();

    if (this.activeCategory !== 'all') {
      items = items.filter(i => i.category === this.activeCategory);
    }

    if (this.searchQuery) {
      items = items.filter(i => 
        i.title.toLowerCase().includes(this.searchQuery) ||
        (i.subtitle && i.subtitle.toLowerCase().includes(this.searchQuery))
      );
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:30px; color:var(--text-muted);">
          <p>No pricing found matching your search.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map(item => `
      <div class="price-row-card">
        <div class="price-row-left">
          <h4 class="price-row-title">${item.title}</h4>
          <span class="price-row-sub">${item.subtitle}</span>
        </div>
        <div class="price-row-val">${formatNaira(item.price)}</div>
      </div>
    `).join('');
  },

  sharePriceList() {
    if (navigator.share) {
      navigator.share({
        title: 'Legend Games Price List (2026)',
        text: 'Check out the official 2026 console and game price list from Legend Games Lagos:',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  PriceListController.init();
});
