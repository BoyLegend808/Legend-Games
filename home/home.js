/**
 * Legend Games / NaijaPlay — Storefront JavaScript Engine
 * Handles Hero Carousel, 24-Hour Daily Drop PRNG, Dual-Format Card Toggling,
 * Live Storage Calculator, Instant Search/Filter/Sort, Modal, and WhatsApp Flow.
 */

// =========================================================================
// 1. STATE MANAGEMENT
// =========================================================================
const StoreState = {
  allGames: [],
  filteredGames: [],
  displayedCount: 8,
  activeTab: 'featured',
  activeCategory: 'all',
  activeSort: 'default',
  searchQuery: '',
  targetDriveCapacityGB: 500,
  cardFormats: {}, // gameId -> 'disc' | 'modded'
  currentHeroIndex: 0,
  heroTimer: null,
  heroGames: [],
  currentModalGame: null,
  selectedModalFormat: 'disc'
};

// =========================================================================
// 2. INITIALIZATION
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initStorefront();
});

function initStorefront() {
  // 1. Load games data from window.GAMES_CATALOG, window.GAMES_DATABASE, or window.games
  let rawGames = [];
  if (typeof GAMES_CATALOG !== 'undefined' && Array.isArray(GAMES_CATALOG)) {
    rawGames = GAMES_CATALOG;
  } else if (typeof GAMES_DATABASE !== 'undefined' && Array.isArray(GAMES_DATABASE)) {
    rawGames = GAMES_DATABASE;
  } else if (typeof games !== 'undefined' && Array.isArray(games)) {
    rawGames = games;
  }

  // Normalize game objects
  StoreState.allGames = rawGames.map(g => ({
    ...g,
    price: g.price || g.cdPrice || 18000,
    cdPrice: g.cdPrice || g.price || 18000,
    moddedPrice: g.moddedPrice || 2000,
    ps4Size: g.ps4Size || g.ps4SizeGB || 45,
    pcSize: g.pcSize || g.pcSizeGB || 0,
    coverImage: g.cover || g.coverImage || `../shared/assets/covers/${g.id}.jpg`
  }));

  // Initialize default card format state for each game
  StoreState.allGames.forEach(game => {
    StoreState.cardFormats[game.id] = 'disc';
  });

  // 2. Init Hero Carousel
  initHeroCarousel();

  // 3. Init 24-Hour Daily Countdown
  initDailyCountdown();

  // 4. Initial Catalog Render (8 Featured Daily Drop games)
  applyCatalogFilters();

  // 5. Update Storage Calculator & Bottom Floating Deck
  updateStorageWidget();
  updateFloatingLoadoutDeck();

  // 6. Listen for Cart and Wishlist Updates
  window.addEventListener('legend-cart-updated', () => {
    updateStorageWidget();
    updateFloatingLoadoutDeck();
    updateCartHeaderBadge();
  });

  window.addEventListener('legend-wishlist-updated', () => {
    syncWishlistButtons();
  });

  // 7. Search Input Keydown Listener (Enter triggers scroll to Vault)
  const searchInput = document.getElementById('g2a-search-input');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeSearch();
      }
    });
    searchInput.addEventListener('focus', () => {
      if (searchInput.value.trim()) {
        handleG2ASearch(searchInput.value);
      }
    });
  }

  // 8. Close Autocomplete on Click Outside
  document.addEventListener('click', (e) => {
    const searchHub = document.querySelector('.legend-search-hub');
    const autoDrawer = document.getElementById('g2a-autocomplete-results');
    if (searchHub && !searchHub.contains(e.target) && autoDrawer) {
      autoDrawer.style.display = 'none';
    }
  });

  // 9. Close Modal on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeGameModal();
    }
  });

  updateCartHeaderBadge();
}

// =========================================================================
// 3. HERO SPOTLIGHT CAROUSEL
// =========================================================================
function initHeroCarousel() {
  if (!StoreState.allGames.length) return;

  // Curate 6 top headline spotlight titles
  const spotlightIds = ['ea-sports-fc-26', 'gow-ragnarok', 'gta-v', 'spiderman-ps4', 'ghost-of-tsushima', 'elden-ring', 'tlou-1'];
  StoreState.heroGames = StoreState.allGames.filter(g => spotlightIds.includes(g.id));
  if (StoreState.heroGames.length === 0) {
    StoreState.heroGames = StoreState.allGames.slice(0, 6);
  }

  // Render hero navigation thumbnails
  const thumbsContainer = document.getElementById('hero-nav-thumbs');
  if (thumbsContainer) {
    thumbsContainer.innerHTML = StoreState.heroGames.map((g, idx) => `
      <div class="hero-thumb-btn ${idx === 0 ? 'active' : ''}" onclick="setHeroSlide(${idx})">
        <img src="${getGameCoverPath(g)}" alt="${g.title}" loading="lazy">
      </div>
    `).join('');
  }

  // Display initial hero slide
  renderHeroSlide(0);

  // Auto rotate every 6 seconds
  startHeroTimer();

  const heroCard = document.getElementById('hero-spotlight-card');
  if (heroCard) {
    heroCard.addEventListener('mouseenter', () => clearInterval(StoreState.heroTimer));
    heroCard.addEventListener('mouseleave', () => startHeroTimer());
  }
}

function startHeroTimer() {
  clearInterval(StoreState.heroTimer);
  StoreState.heroTimer = setInterval(() => {
    StoreState.currentHeroIndex = (StoreState.currentHeroIndex + 1) % StoreState.heroGames.length;
    renderHeroSlide(StoreState.currentHeroIndex);
  }, 6000);
}

function setHeroSlide(index) {
  StoreState.currentHeroIndex = index;
  renderHeroSlide(index);
  startHeroTimer();
}

function renderHeroSlide(index) {
  const game = StoreState.heroGames[index];
  if (!game) return;

  const titleEl = document.getElementById('hero-game-title');
  const descEl = document.getElementById('hero-game-desc');
  const discPriceEl = document.getElementById('hero-disc-price');
  const modPriceEl = document.getElementById('hero-mod-price');
  const backdropEl = document.querySelector('.hero-backdrop-layer');

  if (titleEl) titleEl.textContent = game.title;
  if (descEl) descEl.textContent = game.description || `${game.genre || 'Action'} blockbuster with verified disc and digital packages.`;
  if (discPriceEl) discPriceEl.textContent = formatNaira(game.price || 18000);
  if (modPriceEl) modPriceEl.textContent = formatNaira(game.moddedPrice || 2000);

  if (backdropEl) {
    const coverUrl = getGameCoverPath(game);
    backdropEl.style.backgroundImage = `url('${coverUrl}')`;
  }

  // Update active thumbnail
  const thumbBtns = document.querySelectorAll('.hero-thumb-btn');
  thumbBtns.forEach((btn, idx) => {
    btn.classList.toggle('active', idx === index);
  });
}

function addHeroGameToCart() {
  const game = StoreState.heroGames[StoreState.currentHeroIndex];
  if (!game) return;

  LegendCart.addItem({
    id: game.id,
    title: game.title,
    price: game.price || 18000,
    totalPrice: game.price || 18000,
    variant: 'Physical Boxed Disc',
    type: 'game_disc',
    ps4Size: game.ps4Size || 45,
    coverImage: getGameCoverPath(game)
  });
}

// =========================================================================
// 4. 24-HOUR DAILY DROP PRNG & COUNTDOWN ENGINE
// =========================================================================
/**
 * Mulberry32 seeded Pseudo-Random Number Generator.
 * Guarantees identical 8-game selection for everyone for the entire 24h day.
 */
function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getDailySeed() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getDailyRandomGames(allGames, count = 8) {
  if (!allGames || allGames.length <= count) return allGames || [];
  const seed = getDailySeed();
  const random = mulberry32(seed);

  const shuffled = [...allGames];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

function initDailyCountdown() {
  const timerDigits = document.getElementById('daily-countdown-val');
  if (!timerDigits) return;

  function update() {
    const now = new Date();
    // Midnight next day
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    const diffMs = tomorrow - now;

    if (diffMs <= 0) {
      timerDigits.textContent = '24h 00m 00s';
      // Trigger reshuffle
      applyCatalogFilters();
      return;
    }

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    timerDigits.textContent = `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  }

  update();
  setInterval(update, 1000);
}

// =========================================================================
// 5. CATALOG FILTERING, SORTING & PAGINATION
// =========================================================================
function filterGamesByTab(tabKey, btnElement) {
  StoreState.activeTab = tabKey;
  StoreState.displayedCount = 8; // Reset pagination slice

  // Update active tab button style
  if (btnElement) {
    document.querySelectorAll('.v-tab-btn').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
  }

  applyCatalogFilters();
}

function filterGamesByCategory(categoryKey) {
  StoreState.activeCategory = categoryKey;
  StoreState.displayedCount = 8;
  applyCatalogFilters();
}

function handleCatalogSort(sortKey) {
  StoreState.activeSort = sortKey;
  applyCatalogFilters();
}

// =========================================================================
// 4.1 INTELLIGENT GAME SEARCH ENGINE
// =========================================================================
function normalizeSearchText(text) {
  if (window.LegendSearch) return window.LegendSearch.normalize(text);
  if (!text) return '';
  return text.toLowerCase().replace(/['’]/g, '').replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function matchGameQuery(game, query) {
  if (window.LegendSearch) return window.LegendSearch.matchGame(game, query);
  if (!query || !query.trim()) return true;
  const q = query.toLowerCase().trim();
  return (game.title || '').toLowerCase().includes(q) || (game.genre || '').toLowerCase().includes(q);
}

// -------------------------------------------------------------
// 5. CATALOG FILTERING & RENDER ENGINE
// -------------------------------------------------------------
function applyCatalogFilters() {
  let list = [...StoreState.allGames];

  // 1. Tab Filtering
  if (StoreState.activeTab === 'featured') {
    if (!StoreState.searchQuery) {
      list = getDailyDropGames(StoreState.allGames);
    }
  } else if (StoreState.activeTab === 'bestsellers') {
    list = list.filter(g => (g.rating || 0) >= 9.2);
  } else if (StoreState.activeTab === 'modded_budget') {
    list = list.filter(g => (g.moddedPrice || 0) <= 2000);
  } else if (StoreState.activeTab === 'goty') {
    list = list.filter(g => (g.badge || '').toLowerCase().includes('goty') || (g.rating || 0) >= 9.5);
  } else if (StoreState.activeTab === 'sports') {
    list = list.filter(g => {
      const genre = (g.genre || '').toLowerCase();
      return genre.includes('sport') || genre.includes('football') || genre.includes('racing');
    });
  } else if (StoreState.activeTab === 'coop') {
    list = list.filter(g => {
      const genre = (g.genre || '').toLowerCase();
      return genre.includes('co-op') || genre.includes('multiplayer') || genre.includes('party') || genre.includes('action');
    });
  } else if (StoreState.activeTab === 'pc') {
    list = list.filter(g => (g.pcSize || 0) > 0 || (g.platforms || []).includes('PC'));
  }

  // 2. Search Bar Category Filter
  if (StoreState.activeCategory === 'ps4') {
    list = list.filter(g => (g.ps4Size || 0) > 0 || (g.platforms || []).includes('PS4') || (g.platforms || []).includes('ps4'));
  } else if (StoreState.activeCategory === 'ps5') {
    list = list.filter(g => (g.platforms || []).includes('PS5') || (g.platforms || []).includes('ps5') || (g.year || 0) >= 2021);
  } else if (StoreState.activeCategory === 'pc') {
    list = list.filter(g => (g.pcSize || 0) > 0 || (g.platforms || []).includes('PC') || (g.platforms || []).includes('pc'));
  } else if (StoreState.activeCategory === 'coop') {
    list = list.filter(g => (g.genre || '').toLowerCase().includes('co-op') || (g.genre || '').toLowerCase().includes('action'));
  }

  // 3. Search Query Text Filter (Intelligent Alias & Fuzzy Match)
  if (StoreState.searchQuery.trim()) {
    list = list.filter(g => matchGameQuery(g, StoreState.searchQuery));
  }

  // 4. Sorting
  if (StoreState.activeSort === 'rating_desc') {
    list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (StoreState.activeSort === 'disc_price_asc') {
    list.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (StoreState.activeSort === 'disc_price_desc') {
    list.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (StoreState.activeSort === 'mod_price_asc') {
    list.sort((a, b) => (a.moddedPrice || 0) - (b.moddedPrice || 0));
  } else if (StoreState.activeSort === 'size_asc') {
    list.sort((a, b) => (a.ps4Size || 0) - (b.ps4Size || 0));
  } else if (StoreState.activeSort === 'size_desc') {
    list.sort((a, b) => (b.ps4Size || 0) - (a.ps4Size || 0));
  } else if (StoreState.activeSort === 'year_desc') {
    list.sort((a, b) => (b.year || 0) - (a.year || 0));
  } else if (StoreState.activeSort === 'title_asc') {
    list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  }

  StoreState.filteredGames = list;
  renderCatalogGrid();
}

function loadMoreGames() {
  StoreState.displayedCount += 8;
  renderCatalogGrid();
}

// =========================================================================
// 6. DUAL-FORMAT GAME CARD RENDERING & TOGGLING
// =========================================================================
function renderCatalogGrid() {
  const gridContainer = document.getElementById('g2a-games-grid');
  const countBadge = document.getElementById('catalog-count-badge');
  const emptyNotice = document.getElementById('no-games-found');
  const footerActions = document.getElementById('catalog-footer-actions');
  const loadMoreBtn = document.getElementById('load-more-games-btn');

  if (!gridContainer) return;

  const total = StoreState.filteredGames.length;
  const isDailyDrop = StoreState.activeTab === 'featured' && !StoreState.searchQuery;
  const sliceLimit = isDailyDrop ? 8 : StoreState.displayedCount;
  const displayed = StoreState.filteredGames.slice(0, sliceLimit);

  // Update counts
  if (countBadge) {
    countBadge.textContent = `Showing ${displayed.length} of ${total} titles`;
  }

  // Handle empty search results
  if (total === 0) {
    gridContainer.innerHTML = '';
    if (emptyNotice) emptyNotice.style.display = 'block';
    if (footerActions) footerActions.style.display = 'none';
    return;
  }

  if (emptyNotice) emptyNotice.style.display = 'none';
  if (footerActions) footerActions.style.display = 'flex';

  // Toggle "Load More" button visibility
  if (loadMoreBtn) {
    if (isDailyDrop || displayed.length >= total) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'inline-flex';
    }
  }

  // Render cards
  gridContainer.innerHTML = displayed.map(game => createGameCardMarkup(game)).join('');

  // Sync wishlist hearts
  syncWishlistButtons();
}

function createGameCardMarkup(game) {
  const currentFormat = StoreState.cardFormats[game.id] || 'disc';
  const discPrice = game.price || 18000;
  const moddedPrice = game.moddedPrice || 2000;
  const activePrice = currentFormat === 'disc' ? discPrice : moddedPrice;
  const activePriceType = currentFormat === 'disc' ? 'Physical Disc' : 'HEN Modded';
  const coverUrl = getGameCoverPath(game);
  const isSaved = LegendWishlist.has(game.id);

  return `
    <article class="legend-game-card" data-game-id="${game.id}" onclick="openGameModal('${game.id}')">
      <!-- 3:4 Box Art Poster -->
      <div class="g2a-card-media">
        <img src="${coverUrl}" alt="${game.title} Poster" class="g2a-card-cover" loading="lazy">
        
        <div class="g2a-card-badge-row">
          ${game.badge ? `<span class="g2a-card-badge ${game.badge === 'HOT' ? 'hot' : ''}">${game.badge}</span>` : '<span></span>'}
          <button class="g2a-wishlist-toggle ${isSaved ? 'active' : ''}" 
                  data-wishlist-id="${game.id}" 
                  onclick="handleWishlistClick(event, '${game.id}', '${escapeQuotes(game.title)}')" 
                  title="Save to Wishlist">
            ♥
          </button>
        </div>

        <div class="g2a-card-spec-bar">
          <span class="g2a-card-platform-tag">${(game.platforms || ['PS4', 'PS5']).join(' · ')}</span>
          <span class="g2a-card-size-tag" id="card-size-${game.id}">${game.ps4Size || 45} GB</span>
        </div>
      </div>

      <!-- Card Metadata & Interactive Controls -->
      <div class="g2a-card-body">
        <div class="g2a-card-top-meta">
          <span class="g2a-card-genre">${game.genre || 'Action / Adventure'}</span>
          <span class="g2a-card-score">★ ${game.rating || '9.5'}</span>
        </div>

        <h3 class="g2a-card-title" title="${game.title}">${game.title}</h3>

        <!-- Dual Format On-Card Selector -->
        <div class="g2a-card-format-selector" onclick="event.stopPropagation()">
          <button class="card-format-pill ${currentFormat === 'disc' ? 'active' : ''}" 
                  id="pill-disc-${game.id}"
                  onclick="toggleCardFormat('${game.id}', 'disc', event)">
            💿 Disc
          </button>
          <button class="card-format-pill ${currentFormat === 'modded' ? 'active' : ''}" 
                  id="pill-mod-${game.id}"
                  onclick="toggleCardFormat('${game.id}', 'modded', event)">
            ⚡ HEN ₦2k
          </button>
        </div>

        <!-- Dynamic Price and Cart Action -->
        <div class="g2a-card-action-strip">
          <div class="g2a-card-price-block">
            <span class="g2a-active-price-type" id="card-price-type-${game.id}">${activePriceType}</span>
            <span class="g2a-active-price-val ${currentFormat === 'modded' ? 'modded' : ''}" id="card-price-val-${game.id}">
              ${formatNaira(activePrice)}
            </span>
          </div>
          <button class="g2a-card-add-btn" 
                  id="card-add-btn-${game.id}"
                  onclick="handleCardAddClick(event, '${game.id}')" 
                  title="Add to Request Loadout">
            + Add
          </button>
        </div>
      </div>
    </article>
  `;
}

function toggleCardFormat(gameId, format, event) {
  if (event) event.stopPropagation();

  StoreState.cardFormats[gameId] = format;
  const game = StoreState.allGames.find(g => g.id === gameId);
  if (!game) return;

  const discPill = document.getElementById(`pill-disc-${gameId}`);
  const modPill = document.getElementById(`pill-mod-${gameId}`);
  const priceType = document.getElementById(`card-price-type-${gameId}`);
  const priceVal = document.getElementById(`card-price-val-${gameId}`);
  const sizeTag = document.getElementById(`card-size-${gameId}`);

  if (discPill && modPill) {
    discPill.classList.toggle('active', format === 'disc');
    modPill.classList.toggle('active', format === 'modded');
  }

  if (priceType) {
    priceType.textContent = format === 'disc' ? 'Physical Disc' : 'HEN Modded';
  }

  if (priceVal) {
    const price = format === 'disc' ? (game.price || 18000) : (game.moddedPrice || 2000);
    priceVal.textContent = formatNaira(price);
    priceVal.classList.toggle('modded', format === 'modded');
  }

  if (sizeTag) {
    sizeTag.textContent = `${game.ps4Size || 45} GB`;
  }
}

function handleCardAddClick(event, gameId) {
  if (event) event.stopPropagation();

  const game = StoreState.allGames.find(g => g.id === gameId);
  if (!game) return;

  const format = StoreState.cardFormats[gameId] || 'disc';
  const price = format === 'disc' ? (game.price || 18000) : (game.moddedPrice || 2000);
  const variant = format === 'disc' ? 'Physical Boxed Disc' : 'HEN Modded Offline Install';

  LegendCart.addItem({
    id: game.id,
    title: game.title,
    price: price,
    totalPrice: price,
    variant: variant,
    type: format === 'disc' ? 'game_disc' : 'game_modded',
    mode: format === 'disc' ? 'original' : 'modded',
    ps4Size: game.ps4Size || 45,
    coverImage: getGameCoverPath(game)
  });
}

function handleWishlistClick(event, gameId, title) {
  if (event) event.stopPropagation();
  LegendWishlist.toggleItem(gameId, title);
}

function syncWishlistButtons() {
  const savedItems = LegendWishlist.getItems();
  document.querySelectorAll('.g2a-wishlist-toggle').forEach(btn => {
    const id = btn.getAttribute('data-wishlist-id');
    btn.classList.toggle('active', savedItems.includes(id));
  });
}

// =========================================================================
// 7. LIVE STORAGE SPACE & DRIVE FIT CALCULATOR
// =========================================================================
function setStorageCapacity(gb, btnElement) {
  StoreState.targetDriveCapacityGB = gb;

  // Update button active state
  document.querySelectorAll('.cap-chip').forEach(b => b.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  updateStorageWidget();
  updateFloatingLoadoutDeck();
}

function updateStorageWidget() {
  const cartItems = LegendCart.getItems();
  const totalUsedGB = cartItems.reduce((sum, item) => sum + (Number(item.ps4Size) || 40), 0);
  const capacityGB = StoreState.targetDriveCapacityGB;
  const freeGB = Math.max(0, capacityGB - totalUsedGB);
  const pct = Math.min(100, Math.round((totalUsedGB / capacityGB) * 100));

  const meterFill = document.getElementById('storage-meter-fill');
  const countLabel = document.getElementById('storage-selected-count');
  const usedStat = document.getElementById('storage-used-stat');
  const freeStat = document.getElementById('storage-free-stat');
  const statusStat = document.getElementById('storage-status-stat');

  if (meterFill) {
    meterFill.style.width = `${pct}%`;
    if (pct > 95) {
      meterFill.style.background = 'linear-gradient(90deg, #ff5500, #ff1744)';
    } else if (pct > 75) {
      meterFill.style.background = 'linear-gradient(90deg, #00f0ff, #ffaa00)';
    } else {
      meterFill.style.background = 'linear-gradient(90deg, #00ff88, #00f0ff)';
    }
  }

  if (countLabel) {
    countLabel.textContent = `${cartItems.length} game${cartItems.length === 1 ? '' : 's'} in request basket`;
  }

  if (usedStat) {
    usedStat.innerHTML = `Used: <strong>${totalUsedGB} GB</strong>`;
  }

  if (freeStat) {
    const freePct = Math.max(0, 100 - pct);
    freeStat.innerHTML = `Available: <strong>${freeGB} GB Free</strong> (${freePct}%)`;
  }

  if (statusStat) {
    if (totalUsedGB > capacityGB) {
      statusStat.className = 'tele-item overload';
      statusStat.textContent = `⚠ Over capacity by ${totalUsedGB - capacityGB} GB!`;
    } else {
      statusStat.className = 'tele-item safe';
      statusStat.textContent = `✓ Fits comfortably`;
    }
  }
}

// =========================================================================
// 8. FLOATING LIVE LOADOUT DECK & WHATSAPP
// =========================================================================
function updateFloatingLoadoutDeck() {
  const floatingDeck = document.getElementById('floating-loadout-deck');
  const countText = document.getElementById('loadout-count-text');
  const driveName = document.getElementById('loadout-drive-name');
  const driveGB = document.getElementById('loadout-drive-gb');
  const miniFill = document.getElementById('loadout-mini-fill');
  const priceVal = document.getElementById('loadout-price-val');

  const cartItems = LegendCart.getItems();
  const totalCount = LegendCart.getCount();
  const totalPrice = LegendCart.getTotal();

  if (floatingDeck) {
    if (totalCount > 0) {
      floatingDeck.classList.add('visible');
    } else {
      floatingDeck.classList.remove('visible');
    }
  }

  if (countText) {
    countText.textContent = `${totalCount} item${totalCount === 1 ? '' : 's'} in loadout`;
  }

  const totalUsedGB = cartItems.reduce((sum, item) => sum + (Number(item.ps4Size) || 40), 0);
  const cap = StoreState.targetDriveCapacityGB;
  const pct = Math.min(100, Math.round((totalUsedGB / cap) * 100));

  if (driveName) {
    driveName.textContent = cap >= 1000 ? `${cap / 1000}TB Drive:` : `${cap}GB Drive:`;
  }

  if (driveGB) {
    driveGB.textContent = `${totalUsedGB} GB / ${cap} GB (${pct}%)`;
  }

  if (miniFill) {
    miniFill.style.width = `${pct}%`;
  }

  if (priceVal) {
    priceVal.textContent = formatNaira(totalPrice);
  }
}

function updateCartHeaderBadge() {
  const count = LegendCart.getCount();
  const total = LegendCart.getTotal();

  const countBadge = document.getElementById('g2a-cart-count');
  const priceBadge = document.getElementById('g2a-cart-total-price');

  if (countBadge) countBadge.textContent = count;
  if (priceBadge) priceBadge.textContent = formatNaira(total);
}

function sendWhatsAppQuoteDirect() {
  const cartItems = LegendCart.getItems();
  if (cartItems.length === 0) {
    openWhatsApp('Hi Legend Games Lagos! I want to check availability and request a quote for PlayStation consoles and games.');
    return;
  }

  const { text } = LegendCart.buildWhatsAppMessage({
    meetupArea: 'Lagos (Safe Public Meetup: Ikeja / Lekki / Surulere / Festac)'
  });

  openWhatsApp(text);
}

// =========================================================================
// 9. INSTANT SEARCH & AUTOCOMPLETE (POWERED BY ALIAS & FUZZY MATCH ENGINE)
// =========================================================================
function handleG2ASearch(query) {
  StoreState.searchQuery = query;
  const autoDrawer = document.getElementById('g2a-autocomplete-results');
  const clearBtn = document.getElementById('search-clear-btn');

  if (clearBtn) {
    clearBtn.style.display = query && query.length > 0 ? 'flex' : 'none';
  }

  if (!query.trim()) {
    if (autoDrawer) autoDrawer.style.display = 'none';
    applyCatalogFilters();
    return;
  }

  // Filter top matches for dropdown using intelligent query matcher
  const matches = StoreState.allGames.filter(g => matchGameQuery(g, query)).slice(0, 8);

  if (autoDrawer) {
    if (matches.length > 0) {
      autoDrawer.innerHTML = matches.map(g => `
        <div class="search-auto-item" onclick="selectAutocompleteGame('${g.id}')">
          <img src="${getGameCoverPath(g)}" alt="${g.title}" class="auto-item-thumb">
          <div class="auto-item-info">
            <span class="auto-item-title">${g.title}</span>
            <span class="auto-item-sub">${g.genre || 'Action'} · ${(g.platforms || []).join(', ').toUpperCase()}</span>
          </div>
          <div class="auto-item-price">
            <strong>${formatNaira(g.price || 18000)}</strong>
            <small>HEN: ${formatNaira(g.moddedPrice || 2000)}</small>
          </div>
        </div>
      `).join('') + `
        <div class="search-auto-footer-action" onclick="requestCustomGameWhatsApp('${escapeQuotes(query)}')">
          <span class="req-icon">💬</span>
          <span>Looking for another edition? <strong>Request "${query}" on WhatsApp →</strong></span>
        </div>
      `;
      autoDrawer.style.display = 'block';
    } else {
      autoDrawer.innerHTML = `
        <div class="search-auto-empty">
          <span>No exact database match found for "<strong>${query}</strong>"</span>
          <button type="button" class="btn-request-unlisted" onclick="requestCustomGameWhatsApp('${escapeQuotes(query)}')">
            💬 Request "${query}" directly on WhatsApp
          </button>
        </div>
      `;
      autoDrawer.style.display = 'block';
    }
  }

  // Live filter grid
  applyCatalogFilters();
}

function clearSearchInput() {
  const searchInput = document.getElementById('g2a-search-input');
  const clearBtn = document.getElementById('search-clear-btn');
  if (searchInput) {
    searchInput.value = '';
    searchInput.focus();
  }
  if (clearBtn) clearBtn.style.display = 'none';
  handleG2ASearch('');
}

function selectAutocompleteGame(gameId) {
  const autoDrawer = document.getElementById('g2a-autocomplete-results');
  if (autoDrawer) autoDrawer.style.display = 'none';
  openGameModal(gameId);
}

function executeSearch() {
  const searchInput = document.getElementById('g2a-search-input');
  if (searchInput) {
    handleG2ASearch(searchInput.value);
  }
  const autoDrawer = document.getElementById('g2a-autocomplete-results');
  if (autoDrawer) autoDrawer.style.display = 'none';

  // Smooth scroll to vault catalog section
  const vaultSection = document.getElementById('vault');
  if (vaultSection) {
    vaultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function requestCustomGameWhatsApp(gameTitle) {
  const cleanTitle = (gameTitle || 'a custom game title').trim();
  const text = `Hi Legend Games Lagos! I searched your catalog for "${cleanTitle}". Is this game available in physical disc or external drive loading?`;
  openWhatsApp(text);
}

// =========================================================================
// 10. QUICK VIEW / GAME DETAILS MODAL
// =========================================================================
function openGameModal(gameId) {
  const game = StoreState.allGames.find(g => g.id === gameId);
  if (!game) return;

  StoreState.currentModalGame = game;
  StoreState.selectedModalFormat = 'disc';

  const modal = document.getElementById('g2a-game-modal');
  const coverEl = document.getElementById('modal-game-cover');
  const platformsEl = document.getElementById('modal-game-platforms');
  const badgeEl = document.getElementById('modal-game-badge');
  const ratingEl = document.getElementById('modal-game-rating');
  const titleEl = document.getElementById('modal-game-title');
  const genreEl = document.getElementById('modal-game-genre');
  const descEl = document.getElementById('modal-game-desc');
  const ps4SizeEl = document.getElementById('modal-ps4-size');
  const pcSizeEl = document.getElementById('modal-pc-size');
  const yearEl = document.getElementById('modal-game-year');
  const discPriceEl = document.getElementById('modal-disc-price');
  const moddedPriceEl = document.getElementById('modal-modded-price');

  if (coverEl) coverEl.src = getGameCoverPath(game);
  if (platformsEl) platformsEl.textContent = (game.platforms || ['PS4', 'PS5']).join(' · ');
  if (badgeEl) badgeEl.textContent = game.badge || 'Verified Title';
  if (ratingEl) ratingEl.textContent = `★ ${game.rating || '9.5'}`;
  if (titleEl) titleEl.textContent = game.title;
  if (genreEl) genreEl.textContent = game.genre || 'Action / Adventure';
  if (descEl) descEl.textContent = game.description || 'Experience high fidelity gaming with verified Lagos public meetup testing and safe handover.';
  if (ps4SizeEl) ps4SizeEl.textContent = `${game.ps4Size || 45} GB`;
  if (pcSizeEl) pcSizeEl.textContent = `${game.pcSize || 50} GB`;
  if (yearEl) yearEl.textContent = game.year || '2023';
  if (discPriceEl) discPriceEl.textContent = formatNaira(game.price || 18000);
  if (moddedPriceEl) moddedPriceEl.textContent = formatNaira(game.moddedPrice || 2000);

  selectModalOption('disc');

  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function selectModalOption(format) {
  StoreState.selectedModalFormat = format;

  const optDisc = document.getElementById('opt-disc');
  const optModded = document.getElementById('opt-modded');

  if (optDisc && optModded) {
    optDisc.classList.toggle('selected', format === 'disc');
    optModded.classList.toggle('selected', format === 'modded');

    const discRadio = optDisc.querySelector('input[type="radio"]');
    const modRadio = optModded.querySelector('input[type="radio"]');
    if (discRadio) discRadio.checked = format === 'disc';
    if (modRadio) modRadio.checked = format === 'modded';
  }
}

function addModalGameToCart() {
  const game = StoreState.currentModalGame;
  if (!game) return;

  const format = StoreState.selectedModalFormat;
  const price = format === 'disc' ? (game.price || 18000) : (game.moddedPrice || 2000);
  const variant = format === 'disc' ? 'Physical Boxed Disc' : 'HEN Modded Offline Install';

  LegendCart.addItem({
    id: game.id,
    title: game.title,
    price: price,
    totalPrice: price,
    variant: variant,
    type: format === 'disc' ? 'game_disc' : 'game_modded',
    mode: format === 'disc' ? 'original' : 'modded',
    ps4Size: game.ps4Size || 45,
    coverImage: getGameCoverPath(game)
  });

  closeGameModal();
}

function closeGameModal(event) {
  if (event && event.target && event.target.id !== 'g2a-game-modal' && !event.target.classList.contains('modal-close-trigger')) {
    return;
  }
  const modal = document.getElementById('g2a-game-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
  StoreState.currentModalGame = null;
}

function requestCustomGameModal() {
  openWhatsApp('Hi Legend Games Lagos! I am looking for a specific game title that is not listed on your storefront. Can you source it for me?');
}

// =========================================================================
// 11. HELPER UTILITIES
// =========================================================================
function getGameCoverPath(game) {
  if (!game) return '../shared/assets/covers/ea-sports-fc-26.jpg';
  if (game.cover) {
    if (game.cover.startsWith('http') || game.cover.startsWith('../') || game.cover.startsWith('./')) {
      return game.cover;
    }
    return `../shared/assets/covers/${game.cover}`;
  }
  if (game.coverImage) {
    if (game.coverImage.startsWith('http') || game.coverImage.startsWith('../') || game.coverImage.startsWith('./')) {
      return game.coverImage;
    }
    return `../shared/assets/covers/${game.coverImage}`;
  }
  return `../shared/assets/covers/${game.id}.jpg`;
}

function escapeQuotes(str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// =========================================================================
// 12. FEATURED COMBO & CONDITION TRADE-IN HANDLERS
// =========================================================================
function addFeaturedBundleToCart() {
  LegendCart.addItem({
    id: 'bundle-ps4-champion',
    title: 'PS4 Slim Ultimate Gamer Combo (1TB + 2 Pads + FC26 + 10 Games)',
    price: 245000,
    totalPrice: 245000,
    variant: 'Full Hardware Combo Deal',
    type: 'bundle',
    mode: 'offline-modded',
    ps4Size: 250,
    coverImage: 'https://images.unsplash.com/photo-1507457379470-08b800bebc67?auto=format&fit=crop&w=600&q=80'
  });
}

function selectConditionGrade(condition, btnElement) {
  const chips = document.querySelectorAll('.condition-chip');
  chips.forEach(c => c.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  const notesMap = {
    'like-new': 'Mint PS4 and PS5 units receive top cash payouts on the spot at our safe meetup locations.',
    'good': 'Tested 100% functional consoles with light cosmetic wear get payouts up to 75% market value.',
    'fair': 'Consoles with scuffs or scratches accepted. Inspected and paid on the spot.',
    'for-parts': 'Loud fan, disk drive issues, or unbootable hardware accepted for parts scrap valuation.'
  };

  const textMap = {
    'like-new': 'Like New (10/10)',
    'good': 'Good Condition (8/10)',
    'fair': 'Fair / Heavy Use (6/10)',
    'for-parts': 'For Parts / Faulty (3/10)'
  };

  const noteEl = document.getElementById('condition-summary-note');
  const btnEl = document.getElementById('tradein-whatsapp-btn');

  if (noteEl && notesMap[condition]) {
    noteEl.textContent = notesMap[condition];
  }

  if (btnEl && textMap[condition]) {
    btnEl.href = `https://wa.me/2348012345678?text=${encodeURIComponent(`Hello Legend Games, I want to sell/trade-in my console. Condition: ${textMap[condition]}`)}`;
  }
}

