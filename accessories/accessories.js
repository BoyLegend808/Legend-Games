/**
 * Accessories Catalog Controller
 */

const AccessoriesCatalog = {
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

  filterItems(query) {
    this.searchQuery = (query || '').toLowerCase().trim();
    this.render();
  },

  render() {
    const grid = document.getElementById('accessories-grid');
    if (!grid || !window.ACCESSORIES_DATA) return;

    let list = ACCESSORIES_DATA;

    if (this.activeCategory !== 'all') {
      list = list.filter(item => item.category === this.activeCategory);
    }

    if (this.searchQuery) {
      list = list.filter(item => 
        item.name.toLowerCase().includes(this.searchQuery) ||
        (item.description && item.description.toLowerCase().includes(this.searchQuery))
      );
    }

    if (list.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding:30px; color:var(--text-muted);">
          <p>No gear found matching your search.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = list.map(item => `
      <div class="acc-card">
        <div class="acc-thumb">
          <img src="${item.image}" alt="${item.name}" loading="lazy">
        </div>
        <h4 class="acc-title">${item.name}</h4>
        <span class="acc-sub">${item.specs || item.category}</span>
        <div class="acc-price">${formatNaira(item.price)}</div>
        <button class="btn-add-mini" onclick="AccessoriesCatalog.addItem('${item.id}')">
          + Add to request
        </button>
      </div>
    `).join('');
  },

  addItem(itemId) {
    const item = ACCESSORIES_DATA.find(a => a.id === itemId);
    if (!item) return;

    LegendCart.addItem({
      type: 'accessory',
      title: item.name,
      name: item.name,
      price: item.price,
      totalPrice: item.price,
      quantity: 1,
      image: item.image,
      notes: item.specs || 'Gaming accessory'
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AccessoriesCatalog.init();
});
