/**
 * PC Games Price List Controller
 */

const PCGamesCatalog = {
  searchQuery: '',

  init() {
    this.render();
  },

  filterGames(query) {
    this.searchQuery = (query || '').toLowerCase().trim();
    this.render();
  },

  render() {
    const listContainer = document.getElementById('pc-games-list');
    if (!listContainer || !window.GAMES_CATALOG) return;

    let list = GAMES_CATALOG.filter(g => g.platforms.includes('pc'));

    if (this.searchQuery) {
      list = list.filter(g => 
        window.LegendSearch ? LegendSearch.matchGame(g, this.searchQuery) : (
          g.title.toLowerCase().includes(this.searchQuery) ||
          g.genre.toLowerCase().includes(this.searchQuery)
        )
      );
    }

    if (list.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align:center; padding:30px; color:var(--text-muted);">
          <p>No PC titles found matching your search.</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = list.map(g => `
      <div class="pc-game-card">
        <div class="pc-thumb">
          <img src="${g.cover}" alt="${g.title}" loading="lazy">
        </div>
        <div class="pc-info">
          <h4 class="pc-title">${g.title}</h4>
          <span class="pc-meta">${g.genre} · ${g.pcSizeGB} GB</span>
        </div>
        <div class="pc-right">
          <span class="pc-price">${formatNaira(g.onlinePrice || 5000)}</span>
          <button class="btn-add-mini" style="width:auto; padding:6px 12px;" onclick="PCGamesCatalog.addPCGame('${g.id}')">
            + Install
          </button>
        </div>
      </div>
    `).join('');
  },

  addPCGame(gameId) {
    const game = GAMES_CATALOG.find(g => g.id === gameId);
    if (!game) return;

    const installPrice = game.onlinePrice || 5000;
    LegendCart.addItem({
      type: 'pc-install',
      title: `${game.title} (PC Installation)`,
      name: `${game.title} (PC Game Install)`,
      price: installPrice,
      totalPrice: installPrice,
      quantity: 1,
      image: game.cover,
      notes: `PC installation size: ${game.pcSizeGB}GB`
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  PCGamesCatalog.init();
});
