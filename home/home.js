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

function applyCatalogFilters() {
  let list = [...StoreState.allGames];

  // 1. Tab Filter
  if (StoreState.activeTab === 'featured') {
    list = getDailyRandomGames(list, 8);
  } else if (StoreState.activeTab === 'bestsellers') {
    list = list.filter(g => (g.rating || 0) >= 9.0 || g.badge === 'HOT');
  } else if (StoreState.activeTab === 'modded_budget') {
    list = list.filter(g => (g.moddedPrice || 0) <= 2000);
  } else if (StoreState.activeTab === 'goty') {
    list = list.filter(g => g.badge === 'GOTY' || g.badge === 'POPULAR' || (g.rating || 0) >= 9.5);
  } else if (StoreState.activeTab === 'sports') {
    list = list.filter(g => {
      const genre = (g.genre || '').toLowerCase();
// =========================================================================
// 4.1 INTELLIGENT GAME SEARCH ALIASES & NORMALIZATION ENGINE
// =========================================================================
const GAME_SEARCH_ALIASES = {
  // Grand Theft Auto / GTA
  'gta': ['grand theft auto', 'gta', 'san andreas', 'vice city'],
  'gta5': ['grand theft auto v', 'grand theft auto 5', 'gta 5', 'gta v'],
  'gta 5': ['grand theft auto v', 'gta5', 'gta v'],
  'gta v': ['grand theft auto v', 'gta5', 'gta 5'],
  'gtav': ['grand theft auto v', 'gta5', 'gta 5'],
  'gta iv': ['grand theft auto iv', 'gta4'],
  'gta4': ['grand theft auto iv', 'gta 4'],

  // Call of Duty / COD
  'cod': ['call of duty', 'cod', 'warzone', 'modern warfare', 'black ops', 'vanguard', 'cold war', 'wwii'],
  'cod mw': ['call of duty: modern warfare', 'modern warfare', 'cod mw2', 'mw2', 'mwii'],
  'mw2': ['call of duty: modern warfare ii', 'modern warfare 2', 'modern warfare ii', 'cod mw2'],
  'mwii': ['call of duty: modern warfare ii', 'modern warfare 2', 'mw2'],
  'cod bo': ['call of duty: black ops', 'black ops', 'bo3', 'bocw', 'cold war'],
  'bo3': ['call of duty: black ops iii', 'black ops 3', 'black ops iii', 'bo3'],
  'bo 3': ['call of duty: black ops iii', 'black ops 3', 'bo3'],
  'bocw': ['call of duty: black ops cold war', 'cold war', 'black ops cold war'],
  'cold war': ['call of duty: black ops cold war', 'bocw'],
  'vanguard': ['call of duty: vanguard'],
  'cod ww2': ['call of duty: wwii', 'cod wwii', 'ww2'],
  'ww2': ['call of duty: wwii', 'world war 2', 'battlefield v', 'battlefield 1'],

  // Football / FIFA / FC / PES
  'fifa': ['ea sports fc 26', 'ea sports fifa 23', 'efootball pes 2021', 'fifa', 'fc26', 'pes'],
  'fifa 23': ['ea sports fifa 23', 'fifa 23', 'fifa23'],
  'fifa23': ['ea sports fifa 23', 'fifa 23'],
  'fc': ['ea sports fc 26', 'fc 26', 'fc26'],
  'fc 26': ['ea sports fc 26', 'fc26', 'fifa 26', 'fifa'],
  'fc26': ['ea sports fc 26', 'fc 26', 'fifa 26'],
  'fc 25': ['ea sports fc 26', 'fc 26', 'fc26'],
  'fc25': ['ea sports fc 26', 'fc 26', 'fc26'],
  'fc 24': ['ea sports fc 26', 'fc 26', 'fc26'],
  'fc24': ['ea sports fc 26', 'fc 26', 'fc26'],
  'pes': ['efootball pes 2021 season update', 'pes 2021', 'efootball', 'pro evolution soccer'],
  'pes 2021': ['efootball pes 2021', 'pes2021', 'pes'],
  'pes2021': ['efootball pes 2021', 'pes 2021'],
  'football': ['ea sports fc 26', 'ea sports fifa 23', 'efootball pes 2021', 'captain tsubasa'],
  'soccer': ['ea sports fc 26', 'ea sports fifa 23', 'efootball pes 2021'],

  // God of War
  'gow': ['god of war', 'kratos', 'ragnarok', 'ragnarök', 'gow 2018', 'gow ragnarok'],
  'gow 2018': ['god of war (2018)', 'god of war 4', 'gow4'],
  'gow4': ['god of war (2018)', 'god of war 4'],
  'gow 4': ['god of war (2018)', 'god of war 4'],
  'gow ragnarok': ['god of war ragnarök', 'god of war ragnarok', 'ragnarok', 'ragnarök'],
  'ragnarok': ['god of war ragnarök', 'god of war ragnarok'],
  'ragnarök': ['god of war ragnarök'],
  'kratos': ['god of war (2018)', 'god of war ragnarök'],

  // Red Dead Redemption
  'rdr': ['red dead redemption 2', 'rdr2', 'rdr 2', 'arthur morgan'],
  'rdr2': ['red dead redemption 2', 'rdr 2', 'red dead 2'],
  'rdr 2': ['red dead redemption 2', 'rdr2'],
  'red dead': ['red dead redemption 2', 'rdr2'],
  'arthur morgan': ['red dead redemption 2'],

  // Mortal Kombat
  'mk': ['mortal kombat 11 ultimate', 'mortal kombat xl', 'mk11', 'mkx', 'mkxl', 'scorpion', 'sub zero'],
  'mk11': ['mortal kombat 11 ultimate', 'mortal kombat 11', 'mk 11'],
  'mk 11': ['mortal kombat 11 ultimate', 'mk11'],
  'mkx': ['mortal kombat xl', 'mortal kombat x', 'mkxl'],
  'mkxl': ['mortal kombat xl', 'mkx'],
  'mortal kombat': ['mortal kombat 11 ultimate', 'mortal kombat xl'],

  // Spider-Man
  'spiderman': ["marvel's spider-man", "marvel's spider-man: miles morales", 'spider-man 2', 'spider-man'],
  'spider-man': ["marvel's spider-man", "marvel's spider-man: miles morales"],
  'spider man': ["marvel's spider-man", "marvel's spider-man: miles morales"],
  'miles morales': ["marvel's spider-man: miles morales", 'miles', 'spider-man miles'],
  'miles': ["marvel's spider-man: miles morales"],
  'sm': ["marvel's spider-man", "marvel's spider-man: miles morales"],

  // The Last of Us
  'tlou': ['the last of us remastered', 'the last of us part ii', 'tlou1', 'tlou2', 'joel', 'ellie'],
  'tlou1': ['the last of us remastered', 'the last of us part 1', 'tlou 1'],
  'tlou 1': ['the last of us remastered', 'tlou1'],
  'tlou2': ['the last of us part ii', 'the last of us part 2', 'tlou 2'],
  'tlou 2': ['the last of us part ii', 'tlou2'],
  'the last of us': ['the last of us remastered', 'the last of us part ii'],
  'last of us': ['the last of us remastered', 'the last of us part ii'],

  // Assassin's Creed
  'ac': ["assassin's creed mirage", "assassin's creed valhalla", "assassin's creed odyssey", "assassin's creed origins", "assassins creed"],
  'ac mirage': ["assassin's creed mirage"],
  'ac valhalla': ["assassin's creed valhalla"],
  'ac odyssey': ["assassin's creed odyssey"],
  'ac origins': ["assassin's creed origins"],
  'assassins creed': ["assassin's creed mirage", "assassin's creed valhalla", "assassin's creed odyssey", "assassin's creed origins"],
  'assassin creed': ["assassin's creed mirage", "assassin's creed valhalla", "assassin's creed odyssey", "assassin's creed origins"],

  // Need for Speed
  'nfs': ['need for speed heat', 'need for speed payback', 'need for speed unbound', 'nfs heat', 'nfs unbound', 'nfs payback'],
  'nfs heat': ['need for speed heat'],
  'nfs unbound': ['need for speed unbound'],
  'nfs payback': ['need for speed payback'],
  'need for speed': ['need for speed heat', 'need for speed payback', 'need for speed unbound'],

  // Resident Evil
  're': ['resident evil 2 remake', 'resident evil 3 remake', 'resident evil 4 remake', 'resident evil 7: biohazard', 'resident evil village', 'resident evil 6'],
  're2': ['resident evil 2 remake', 're 2', 'resident evil 2'],
  're 2': ['resident evil 2 remake', 're2'],
  're3': ['resident evil 3 remake', 're 3', 'resident evil 3'],
  're 3': ['resident evil 3 remake', 're3'],
  're4': ['resident evil 4 remake', 're 4', 'resident evil 4', 'leon'],
  're 4': ['resident evil 4 remake', 're4'],
  're6': ['resident evil 6', 're 6'],
  're 6': ['resident evil 6', 're6'],
  're7': ['resident evil 7: biohazard', 're 7', 'biohazard'],
  're 7': ['resident evil 7: biohazard', 're7'],
  're8': ['resident evil village', 're 8', 'village'],
  're 8': ['resident evil village', 're8'],
  'village': ['resident evil village'],
  'biohazard': ['resident evil 7: biohazard'],

  // Black Myth / Wukong
  'wukong': ['black myth: wukong', 'black myth wukong', 'monkey king', 'sun wukong'],
  'black myth': ['black myth: wukong', 'wukong'],
  'monkey king': ['black myth: wukong'],

  // Fighting games
  'tekken': ['tekken 7', 'tekken 8', 'tk7', 'tk8'],
  'tekken 8': ['tekken 8', 'tk8'],
  'tk8': ['tekken 8', 'tk 8'],
  'tk 8': ['tekken 8', 'tk8'],
  'tekken 7': ['tekken 7', 'tk7'],
  'tk7': ['tekken 7', 'tk 7'],
  'tk 7': ['tekken 7', 'tk7'],
  'sf': ['street fighter 6', 'sf6', 'sf 6'],
  'sf6': ['street fighter 6', 'sf 6'],
  'sf 6': ['street fighter 6', 'sf6'],
  'street fighter': ['street fighter 6'],
  'dbz': ['dragon ball xenoverse 2', 'dragon ball fighterz', 'dragon ball: sparking! zero', 'sparking zero', 'goku'],
  'dragon ball': ['dragon ball xenoverse 2', 'dragon ball fighterz', 'dragon ball: sparking! zero'],
  'sparking zero': ['dragon ball: sparking! zero', 'sparking! zero', 'budokai tenkaichi'],
  'budokai': ['dragon ball: sparking! zero'],
  'kof': ['the king of fighters xv', 'kof 15', 'kof xv', 'king of fighters'],
  'kof 15': ['the king of fighters xv', 'kof xv'],
  'kof xv': ['the king of fighters xv'],
  'injustice': ['injustice 2: legendary edition', 'injustice 2', 'batman', 'superman'],

  // Anime & Manga
  'naruto': ['naruto shippuden: ultimate ninja storm 4', 'naruto x boruto ultimate ninja storm connections', 'storm 4', 'storm connections'],
  'storm 4': ['naruto shippuden: ultimate ninja storm 4', 'naruto storm 4'],
  'storm connections': ['naruto x boruto ultimate ninja storm connections'],
  'demon slayer': ['demon slayer: kimetsu no yaiba – the hinokami chronicles', 'tanjiro', 'kimetsu'],
  'kimetsu': ['demon slayer: kimetsu no yaiba – the hinokami chronicles'],
  'one piece': ['one piece: pirate warriors 4', 'luffy', 'pirate warriors 4', 'pw4'],
  'pw4': ['one piece: pirate warriors 4'],

  // Combat / Wrestling / Sports
  'ufc': ['ea sports ufc 4', 'ea sports ufc 5', 'ufc 4', 'ufc 5', 'ufc4', 'ufc5', 'mma'],
  'ufc 4': ['ea sports ufc 4', 'ufc4'],
  'ufc4': ['ea sports ufc 4', 'ufc 4'],
  'ufc 5': ['ea sports ufc 5', 'ufc5'],
  'ufc5': ['ea sports ufc 5', 'ufc 5'],
  'wwe': ['wwe 2k23', 'wwe 2k24', 'wwe 2k', 'smackdown', 'wrestling'],
  'wwe 2k24': ['wwe 2k24', 'wwe24', '2k24'],
  'wwe 2k23': ['wwe 2k23', 'wwe23', '2k23'],
  'nba': ['nba 2k24', 'nba 2k', 'basketball', '2k24'],
  'nba 2k24': ['nba 2k24', 'nba24'],

  // RPG / Souls
  'elden ring': ['elden ring', 'shadow of the erdtree', 'erdtree', 'fromsoftware', 'souls'],
  'bloodborne': ['bloodborne (playstation hits)', 'bloodborne', 'fromsoftware', 'souls'],
  'sekiro': ['sekiro: shadows die twice', 'fromsoftware', 'souls'],
  'witcher': ['the witcher 3: wild hunt - complete edition', 'witcher 3', 'geralt'],
  'witcher 3': ['the witcher 3: wild hunt - complete edition', 'witcher 3'],
  'cyberpunk': ['cyberpunk 2077', 'cyberpunk', 'night city', 'keanu reeves'],
  'cyberpunk 2077': ['cyberpunk 2077'],
  'cp2077': ['cyberpunk 2077'],
  'ff7': ['final fantasy vii remake', 'final fantasy 7 remake', 'ff vii', 'final fantasy', 'cloud'],
  'ffvii': ['final fantasy vii remake', 'final fantasy 7 remake'],
  'final fantasy': ['final fantasy vii remake'],
  'mgs': ['metal gear solid v: the phantom pain', 'mgs5', 'mgsv', 'phantom pain', 'snake', 'big boss'],
  'mgs5': ['metal gear solid v: the phantom pain', 'mgs 5', 'mgsv'],
  'mgsv': ['metal gear solid v: the phantom pain', 'mgs 5', 'mgs5'],
  'metal gear': ['metal gear solid v: the phantom pain'],
  'ghost of tsushima': ['ghost of tsushima', 'got', 'jin sakai', 'tsushima'],
  'tsushima': ['ghost of tsushima'],
  'horizon': ['horizon zero dawn: complete edition', 'horizon forbidden west', 'hzd', 'hfw', 'aloy'],
  'hzd': ['horizon zero dawn: complete edition', 'horizon zero dawn'],
  'hfw': ['horizon forbidden west'],
  'uncharted': ['uncharted 4: a thief’s end', 'uncharted: the nathan drake collection', 'nathan drake'],
  'nathan drake': ['uncharted 4: a thief’s end', 'uncharted: the nathan drake collection'],
  'hogwarts': ['hogwarts legacy', 'harry potter', 'magic', 'wizard'],
  'harry potter': ['hogwarts legacy'],

  // Shooters & War
  'bf': ['battlefield 1: revolution', 'battlefield v: definitive edition', 'battlefield 1', 'battlefield 5', 'bf1', 'bfv', 'bf5'],
  'bf1': ['battlefield 1: revolution', 'battlefield 1'],
  'bf 1': ['battlefield 1: revolution', 'battlefield 1'],
  'bfv': ['battlefield v: definitive edition', 'battlefield 5', 'bf 5'],
  'bf5': ['battlefield v: definitive edition', 'battlefield 5', 'bf v'],
  'bf 5': ['battlefield v: definitive edition', 'battlefield 5'],
  'battlefield': ['battlefield 1: revolution', 'battlefield v: definitive edition'],
  'sniper': ['sniper elite 4', 'sniper elite 5', 'se4', 'se5'],
  'se4': ['sniper elite 4', 'sniper 4'],
  'se5': ['sniper elite 5', 'sniper 5'],
  'sniper elite': ['sniper elite 4', 'sniper elite 5'],
  'star wars': ['star wars jedi: survivor', 'star wars jedi: fallen order', 'star wars battlefront ii: celebration edition', 'jedi'],
  'jedi': ['star wars jedi: survivor', 'star wars jedi: fallen order'],
  'far cry': ['far cry 6', 'far cry 5', 'far cry primal (apex edition)', 'fc6', 'fc5'],
  'fc6': ['far cry 6', 'far cry 6'],
  'fc5': ['far cry 5', 'far cry 5'],
  'watch dogs': ['watch dogs 2', 'watch dogs: legion', 'wd2', 'wd legion'],
  'wd2': ['watch dogs 2', 'watchdogs 2'],
  'wd legion': ['watch dogs: legion'],

  // Platformers & Family
  'crash': ['crash bandicoot n. sane trilogy', "crash bandicoot 4: it's about time", 'crash team racing nitro-fueled', 'ctr', 'crash 4'],
  'crash 4': ["crash bandicoot 4: it's about time", 'crash bandicoot 4'],
  'ctr': ['crash team racing nitro-fueled', 'crash racing', 'team racing'],
  'spyro': ['spyro reignited trilogy', 'spyro dragon'],
  'ratchet': ['ratchet & clank (playstation hits)', 'ratchet and clank', 'clank'],
  'minecraft': ['minecraft (playstation 4 edition)', 'minecraft'],
  'it takes two': ['it takes two', 'co-op', 'two players'],
  'a way out': ['a way out', 'co-op', 'prison escape'],
  'coop': ['a way out', 'it takes two', 'monster hunter: world', 'dead island 2', 'overcooked', 'borderlands'],
  'co-op': ['a way out', 'it takes two', 'monster hunter: world', 'dead island 2', 'overcooked', 'borderlands'],
  '2 player': ['a way out', 'it takes two', 'ea sports fc 26', 'mortal kombat 11 ultimate', 'tekken 8', 'street fighter 6', 'wwe 2k24']
};

function normalizeSearchText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchGameQuery(game, query) {
  if (!query || !query.trim()) return true;
  const rawQ = query.toLowerCase().trim();
  const normQ = normalizeSearchText(query);
  const compactQ = normQ.replace(/\s+/g, '');

  if (!normQ) return true;

  const normTitle = normalizeSearchText(game.title);
  const compactTitle = normTitle.replace(/\s+/g, '');
  const normGenre = normalizeSearchText(game.genre);
  const normDesc = normalizeSearchText(game.description);
  const normBadge = normalizeSearchText(game.badge);
  const gameId = (game.id || '').toLowerCase();
  const platformsStr = (game.platforms || []).join(' ').toLowerCase();

  // 1. Direct contains check
  if (
    normTitle.includes(normQ) ||
    compactTitle.includes(compactQ) ||
    normGenre.includes(normQ) ||
    normDesc.includes(normQ) ||
    normBadge.includes(normQ) ||
    gameId.includes(compactQ) ||
    platformsStr.includes(normQ)
  ) {
    return true;
  }

  // 2. Check alias dictionary
  for (const [aliasKey, targetMatches] of Object.entries(GAME_SEARCH_ALIASES)) {
    const normAlias = normalizeSearchText(aliasKey);
    const compactAlias = normAlias.replace(/\s+/g, '');

    if (normQ === normAlias || compactQ === compactAlias || normQ.startsWith(normAlias) || compactQ.startsWith(compactAlias)) {
      for (const target of targetMatches) {
        const normTarget = normalizeSearchText(target);
        const compactTarget = normTarget.replace(/\s+/g, '');
        if (normTitle.includes(normTarget) || compactTitle.includes(compactTarget) || gameId.includes(compactTarget)) {
          return true;
        }
      }
    }
  }

  // 3. Roman Numeral <-> Arabic Number Transliteration
  const romanTransliterated = normQ
    .replace(/\b1\b/g, 'i')
    .replace(/\b2\b/g, 'ii')
    .replace(/\b3\b/g, 'iii')
    .replace(/\b4\b/g, 'iv')
    .replace(/\b5\b/g, 'v')
    .replace(/\b6\b/g, 'vi')
    .replace(/\b7\b/g, 'vii')
    .replace(/\b8\b/g, 'viii');

  const arabicTransliterated = normQ
    .replace(/\bviii\b/g, '8')
    .replace(/\bvii\b/g, '7')
    .replace(/\bvi\b/g, '6')
    .replace(/\bv\b/g, '5')
    .replace(/\biv\b/g, '4')
    .replace(/\biii\b/g, '3')
    .replace(/\bii\b/g, '2')
    .replace(/\bi\b/g, '1');

  if (
    normTitle.includes(romanTransliterated) ||
    compactTitle.includes(romanTransliterated.replace(/\s+/g, '')) ||
    normTitle.includes(arabicTransliterated) ||
    compactTitle.includes(arabicTransliterated.replace(/\s+/g, ''))
  ) {
    return true;
  }

  // 4. Token-level partial match (all query words must match somewhere in title/genre/description)
  const queryTokens = normQ.split(' ').filter(t => t.length > 1);
  if (queryTokens.length > 1) {
    const fullText = `${normTitle} ${normGenre} ${normDesc} ${normBadge} ${gameId}`;
    const allFound = queryTokens.every(token => fullText.includes(token));
    if (allFound) return true;
  }

  return false;
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

