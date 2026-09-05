/**
 * Custom Console Wraps Catalog Controller
 */

const WrapsCatalog = {
  init() {
    this.render();
  },

  render() {
    const grid = document.getElementById('wraps-grid');
    if (!grid || !window.WRAPS_DATA) return;

    grid.innerHTML = WRAPS_DATA.map(wrap => `
      <div class="wrap-card">
        <div class="wrap-thumb">
          <img src="${wrap.image}" alt="${wrap.name}" loading="lazy">
        </div>
        <h4 class="wrap-title">${wrap.name}</h4>
        <span class="wrap-sub">${wrap.platforms.join(' · ')}</span>
        <div class="wrap-price">${formatNaira(wrap.standalonePrice || 18000)}</div>
        <button class="btn-add-mini" onclick="WrapsCatalog.addWrap('${wrap.id}')">
          + Add wrap service
        </button>
      </div>
    `).join('');
  },

  addWrap(wrapId) {
    const wrap = WRAPS_DATA.find(w => w.id === wrapId);
    if (!wrap) return;

    const price = wrap.standalonePrice || 18000;
    LegendCart.addItem({
      type: 'custom-wrap',
      title: `${wrap.name} (Console Skin)`,
      name: `${wrap.name} Wrap Service`,
      price: price,
      totalPrice: price,
      quantity: 1,
      image: wrap.image,
      notes: `Custom vinyl wrap for ${wrap.platforms.join('/')} (Includes application)`
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  WrapsCatalog.init();
});
