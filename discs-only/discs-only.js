/**
 * Discs Only Catalog Controller
 */

const DiscsCatalog = {
  activePlatform: 'all',
  searchQuery: '',

  init() {
    this.render();
  },

  setPlatformFilter(platform, btn) {
    this.activePlatform = platform;
    document.querySelectorAll('.filter-chips .chip').forEach(c => c.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.render();
  },

  filterGames(query) {
    this.searchQuery = (query || '').toLowerCase().trim();
    this.render();
  },

  render() {
    const grid = document.getElementById('discs-grid');
    if (!grid || !window.GAMES_CATALOG) return;

    let list = GAMES_CATALOG;

    if (this.activePlatform !== 'all') {
      list = list.filter(g => g.platforms.includes(this.activePlatform));
    }

    if (this.searchQuery) {
      list = list.filter(g => 
        window.LegendSearch ? LegendSearch.matchGame(g, this.searchQuery) : (
          g.title.toLowerCase().includes(this.searchQuery) || 
          g.genre.toLowerCase().includes(this.searchQuery)
        )
      );
    }

    if (list.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding:30px; color:var(--text-muted);">
          <p>No titles found matching your search.</p>
          <p style="font-size:0.8rem; margin-top:4px;">Use the custom game request box below to ask for any title!</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = list.map(g => `
      <div class="disc-card">
        <div class="disc-thumb">
          <img src="${g.cover}" alt="${g.title}" loading="lazy">
        </div>
        <h4 class="disc-title">${g.title}</h4>
        <span class="disc-platforms">${g.platforms.join(' · ')}</span>
        <div class="disc-price">${formatNaira(g.cdPrice)}</div>
        <button class="btn-add-mini" onclick="DiscsCatalog.addDisc('${g.id}')">
          + Add disc
        </button>
      </div>
    `).join('');
  },

  addDisc(gameId) {
    const game = GAMES_CATALOG.find(g => g.id === gameId);
    if (!game) return;

    LegendCart.addItem({
      type: 'game-disc',
      title: `${game.title} (Game Disc)`,
      name: `${game.title} (Physical Disc)`,
      price: game.cdPrice,
      totalPrice: game.cdPrice,
      quantity: 1,
      image: game.cover,
      notes: `Physical disc for ${game.platforms.join('/')}`
    });
  },

  addCustomGameRequest() {
    const nameInput = document.getElementById('custom-game-name');
    const platSelect = document.getElementById('custom-game-platform');
    const title = nameInput?.value.trim();
    const platform = platSelect?.value || 'PS5';

    if (!title) {
      showToast('Please enter a game title');
      return;
    }

    LegendCart.addItem({
      type: 'custom-game-inquiry',
      title: `Custom Game Request: ${title}`,
      name: `${title} (${platform})`,
      price: 0,
      totalPrice: 0,
      quantity: 1,
      notes: `Custom sourced inquiry for ${platform}. Price to be quoted on WhatsApp.`
    });

    if (nameInput) nameInput.value = '';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  DiscsCatalog.init();
});
