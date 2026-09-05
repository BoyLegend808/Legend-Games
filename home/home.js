/**
 * Home Page Logic - Handles Search, Category Filter, and Popular Pick Additions
 */

function handleHomeSearch(query) {
  const term = (query || '').toLowerCase().trim();
  const popularSection = document.getElementById('popular-picks-section');
  if (!popularSection) return;

  const cards = popularSection.querySelectorAll('.product-mini-card');
  let hasMatches = false;

  cards.forEach(card => {
    const title = card.querySelector('.product-mini-title')?.textContent.toLowerCase() || '';
    const sub = card.querySelector('.product-mini-sub')?.textContent.toLowerCase() || '';
    const matches = title.includes(term) || sub.includes(term);
    card.style.display = matches ? 'flex' : 'none';
    if (matches) hasMatches = true;
  });
}

function filterHomeCategory(category, btn) {
  // Update chip active state
  document.querySelectorAll('.filter-chips .chip').forEach(c => c.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const catLinks = {
    consoles: '../consoles/ps5/ps5.html',
    games: '../discs-only/discs-only.html',
    accessories: '../accessories/accessories.html',
    wraps: '../wraps/wraps.html'
  };

  if (category !== 'all' && catLinks[category]) {
    window.location.href = catLinks[category];
  }
}

function addQuickPopularItem(title, price, subtitle, image) {
  LegendCart.addItem({
    type: 'popular-item',
    title: title,
    name: title,
    subtitle: subtitle,
    price: price,
    totalPrice: price,
    quantity: 1,
    image: image || null
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Check wishlist states for popular items
  document.querySelectorAll('.product-mini-fav').forEach(btn => {
    const onclickAttr = btn.getAttribute('onclick') || '';
    const match = onclickAttr.match(/toggleItem\('([^']+)'/);
    if (match && match[1]) {
      const id = match[1];
      btn.setAttribute('data-wishlist-id', id);
      if (LegendWishlist.has(id)) {
        btn.classList.add('active');
      }
    }
  });
});
