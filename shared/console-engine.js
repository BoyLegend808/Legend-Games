/**
 * Legend Games / NaijaPlay - Interactive Console Configurator Engine
 * Powers PS5, PS4, Xbox, and PS3 configurator studios matching Figma/mockup screen.
 */

const ConsoleEngine = {
  activePlatform: 'ps4',
  activeVariant: null,
  activeMode: 'normal', // 'normal' (stock/online) | 'modded' (hacked/offline)
  selectedPhysicalGames: [],
  selectedInstalledGames: [],
  selectedWrap: 'none',
  selectedBundle: 'none',
  customGameRequest: '',
  currentQueries: { physical: '', installed: '' },

  init(platformKey) {
    this.activePlatform = platformKey || 'ps4';
    const consoleData = CONSOLES_DATA[this.activePlatform];
    if (!consoleData) return;

    // Set default variant
    const defaultVar = consoleData.variants.find(v => v.popular) || consoleData.variants[0];
    this.activeVariant = defaultVar;

    this.render();
  },

  getPlatformGames() {
    if (!window.GAMES_CATALOG || !Array.isArray(window.GAMES_CATALOG)) return [];
    return window.GAMES_CATALOG.filter(g => {
      const p = (g.platforms || []).map(x => x.toLowerCase());
      if (this.activePlatform === 'ps4') {
        return p.includes('ps4') || (g.ps4SizeGB || 0) > 0;
      } else if (this.activePlatform === 'ps5') {
        // PS5 natively plays all PS5 and PS4 games
        return p.includes('ps5') || p.includes('ps4') || (g.ps4SizeGB || 0) > 0;
      } else if (this.activePlatform === 'xbox') {
        return p.includes('xbox');
      } else if (this.activePlatform === 'pc') {
        return p.includes('pc') || (g.pcSizeGB || 0) > 0;
      }
      return true;
    });
  },

  setPlatform(platformKey) {
    if (!CONSOLES_DATA[platformKey]) return;
    this.activePlatform = platformKey;
    this.activeVariant = CONSOLES_DATA[platformKey].variants.find(v => v.popular) || CONSOLES_DATA[platformKey].variants[0];
    this.selectedPhysicalGames = [];
    this.selectedInstalledGames = [];
    this.currentQueries = { physical: '', installed: '' };
    this.render();
  },

  setMode(mode) {
    this.activeMode = mode;
    this.render();
  },

  setVariant(variantId) {
    const consoleData = CONSOLES_DATA[this.activePlatform];
    const found = consoleData.variants.find(v => v.id === variantId);
    if (found) {
      this.activeVariant = found;
      this.updateTotal();
    }
  },

  togglePhysicalGame(gameId) {
    const index = this.selectedPhysicalGames.indexOf(gameId);
    if (index > -1) {
      this.selectedPhysicalGames.splice(index, 1);
    } else {
      this.selectedPhysicalGames.push(gameId);
    }
    this.updateTotal();
    this.renderGamesList('physical', this.currentQueries.physical || '');
  },

  toggleInstalledGame(gameId) {
    const index = this.selectedInstalledGames.indexOf(gameId);
    if (index > -1) {
      this.selectedInstalledGames.splice(index, 1);
    } else {
      this.selectedInstalledGames.push(gameId);
    }
    this.updateTotal();
    this.renderGamesList('installed', this.currentQueries.installed || '');
  },

  calculateTotal() {
    if (!this.activeVariant) return 0;
    let total = Number(this.activeVariant.basePrice || 0);

    // Physical games pricing
    if (window.GAMES_CATALOG) {
      this.selectedPhysicalGames.forEach(gid => {
        const g = GAMES_CATALOG.find(item => item.id === gid);
        if (g) total += Number(g.cdPrice || g.price || 18000);
      });

      // Installed games pricing (depends on modded vs online)
      this.selectedInstalledGames.forEach(gid => {
        const g = GAMES_CATALOG.find(item => item.id === gid);
        if (g) {
          const gamePrice = this.activeMode === 'modded' ? (g.moddedPrice || 2000) : (g.onlinePrice || 6000);
          total += Number(gamePrice);
        }
      });
    }

    // Wrap pricing
    if (this.selectedWrap !== 'none' && window.WRAPS_DATA) {
      const wrap = WRAPS_DATA.find(w => w.id === this.selectedWrap);
      if (wrap) total += Number(wrap.addonPrice || 15000);
    }

    return total;
  },

  updateTotal() {
    const total = this.calculateTotal();
    const display = document.getElementById('engine-total-display');
    const stickyDisplay = document.getElementById('engine-sticky-total');
    if (display) display.textContent = formatNaira(total);
    if (stickyDisplay) stickyDisplay.textContent = formatNaira(total);

    // Update breakdown items
    const baseDisplay = document.getElementById('bd-base-price');
    if (baseDisplay && this.activeVariant) {
      baseDisplay.textContent = formatNaira(this.activeVariant.basePrice);
    }
    const gamesDisplay = document.getElementById('bd-games-price');
    if (gamesDisplay) {
      let gamesTotal = 0;
      if (window.GAMES_CATALOG) {
        this.selectedPhysicalGames.forEach(gid => {
          const g = GAMES_CATALOG.find(item => item.id === gid);
          if (g) gamesTotal += Number(g.cdPrice || g.price || 18000);
        });
        this.selectedInstalledGames.forEach(gid => {
          const g = GAMES_CATALOG.find(item => item.id === gid);
          if (g) gamesTotal += Number(this.activeMode === 'modded' ? (g.moddedPrice || 2000) : (g.onlinePrice || 6000));
        });
      }
      gamesDisplay.textContent = gamesTotal > 0 ? formatNaira(gamesTotal) : '₦0';
    }
  },

  addToCart() {
    if (!this.activeVariant) return;
    const consoleData = CONSOLES_DATA[this.activePlatform];

    const physGameObjects = this.selectedPhysicalGames.map(gid => {
      const g = GAMES_CATALOG.find(item => item.id === gid);
      return g ? { id: g.id, title: g.title, price: g.cdPrice || 18000 } : { id: gid, title: gid };
    });

    const instGameObjects = this.selectedInstalledGames.map(gid => {
      const g = GAMES_CATALOG.find(item => item.id === gid);
      const price = this.activeMode === 'modded' ? (g?.moddedPrice || 2000) : (g?.onlinePrice || 6000);
      return g ? { id: g.id, title: g.title, price } : { id: gid, title: gid };
    });

    const configItem = {
      type: 'console-config',
      platform: this.activePlatform,
      title: `${consoleData.name} (${this.activeVariant.name})`,
      variant: this.activeVariant.name,
      mode: this.activeMode,
      freeFC: consoleData.hasFCBundle,
      basePrice: this.activeVariant.basePrice,
      totalPrice: this.calculateTotal(),
      physicalGames: physGameObjects,
      installedGames: instGameObjects,
      wrap: this.selectedWrap !== 'none' ? this.selectedWrap : null,
      customGameRequest: this.customGameRequest || null,
      quantity: 1,
      image: consoleData.image
    };

    LegendCart.addItem(configItem);
  },

  renderGamesList(type, query = '') {
    const listId = type === 'physical' ? 'physical-games-list' : 'installed-games-list';
    const container = document.getElementById(listId);
    if (!container) return;

    const allGames = this.getPlatformGames();
    let matches = allGames;

    if (query && query.trim()) {
      if (window.LegendSearch) {
        matches = allGames.filter(g => LegendSearch.matchGame(g, query));
      } else {
        const q = query.toLowerCase().trim();
        matches = allGames.filter(g => (g.title || '').toLowerCase().includes(q) || (g.genre || '').toLowerCase().includes(q) || (g.id || '').includes(q));
      }
    }

    if (matches.length === 0) {
      container.innerHTML = `
        <div class="games-empty-state">
          <span>🔍 No database title found matching "<strong>${query}</strong>"</span>
          <p>You can type any rare or custom title into the request box below!</p>
        </div>
      `;
      return;
    }

    const selectedList = type === 'physical' ? this.selectedPhysicalGames : this.selectedInstalledGames;
    const toggleMethod = type === 'physical' ? 'ConsoleEngine.togglePhysicalGame' : 'ConsoleEngine.toggleInstalledGame';

    container.innerHTML = matches.map(g => {
      const isSelected = selectedList.includes(g.id);
      let price = 0;
      let formatTag = '';
      if (type === 'physical') {
        price = g.cdPrice || g.price || 18000;
        formatTag = 'Blu-ray Disc';
      } else {
        price = this.activeMode === 'modded' ? (g.moddedPrice || 2000) : (g.onlinePrice || 6000);
        formatTag = this.activeMode === 'modded' ? 'HEN ₦2,000' : 'Digital PSN';
      }

      const coverSrc = g.cover || g.coverImage || `../../shared/assets/covers/${g.id}.jpg`;

      return `
        <div class="game-check-row ${isSelected ? 'selected' : ''}" onclick="${toggleMethod}('${g.id}')">
          <div class="game-check-left">
            <!-- Dedicated Tactile ON / OFF Button Switch -->
            <div class="game-switch-btn ${isSelected ? 'on' : 'off'}" role="switch" aria-checked="${isSelected}">
              <span class="switch-knob"></span>
              <span class="switch-label">${isSelected ? 'ON' : 'OFF'}</span>
            </div>
            <div class="game-title-block">
              <span class="game-title">${g.title}</span>
              <span class="game-meta-sub">${g.genre || 'Action'} · ${(g.platforms || []).join('/').toUpperCase()}</span>
            </div>
          </div>
          <div class="game-price-col">
            <span class="game-price">${formatNaira(price)}</span>
            <span class="game-format-tag">${formatTag}</span>
          </div>
        </div>
      `;
    }).join('');
  },

  filterGamesList(type, query) {
    this.currentQueries[type] = query || '';
    this.renderGamesList(type, query);
  },

  render() {
    const mount = document.getElementById('console-engine-mount');
    if (!mount) return;

    const consoleData = CONSOLES_DATA[this.activePlatform];

    mount.innerHTML = `
      <div class="studio-card card-elevated card">
        <div class="studio-header">
          <span class="badge badge-purple">REQUEST A QUOTE</span>
          <h2 class="studio-title">Configure your ${consoleData.name}</h2>
          <p class="studio-sub">Build your console and game list. We confirm everything before meetup.</p>
        </div>

        <!-- 1. Choose Platform (If multi-platform studio) -->
        <div class="form-section">
          <label class="section-label">1. Choose your platform</label>
          <div class="platform-pills-row">
            <button class="plat-pill ${this.activePlatform === 'ps4' ? 'active' : ''}" onclick="ConsoleEngine.setPlatform('ps4')">PS4</button>
            <button class="plat-pill ${this.activePlatform === 'ps5' ? 'active' : ''}" onclick="ConsoleEngine.setPlatform('ps5')">PS5</button>
            <button class="plat-pill ${this.activePlatform === 'xbox' ? 'active' : ''}" onclick="ConsoleEngine.setPlatform('xbox')">Xbox</button>
            <button class="plat-pill ${this.activePlatform === 'ps3' ? 'active' : ''}" onclick="ConsoleEngine.setPlatform('ps3')">PS3</button>
          </div>
        </div>

        <!-- 1b. Firmware Mode (Normal vs Modded) -->
        ${consoleData.hasModdedOption ? `
          <div class="form-section">
            <label class="section-label">Firmware system</label>
            <div class="mode-grid">
              <div class="mode-card ${this.activeMode === 'normal' ? 'active' : ''}" onclick="ConsoleEngine.setMode('normal')">
                <div class="mode-card-header">
                  <strong>Normal Console</strong>
                  <span class="mode-check">${this.activeMode === 'normal' ? '✓' : ''}</span>
                </div>
                <p>Original firmware — full PSN online access & multiplayer</p>
              </div>
              <div class="mode-card ${this.activeMode === 'modded' ? 'active' : ''}" onclick="ConsoleEngine.setMode('modded')">
                <div class="mode-card-header">
                  <strong>Hacked / Modded</strong>
                  <span class="mode-check">${this.activeMode === 'modded' ? '✓' : ''}</span>
                </div>
                <p>Offline only — play cheap installed games, huge savings</p>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- 2. Select a Variant -->
        <div class="form-section">
          <label class="section-label">2. Select a variant</label>
          <div class="variant-cards-list">
            ${consoleData.variants.map(v => `
              <div class="variant-select-card ${this.activeVariant && this.activeVariant.id === v.id ? 'active' : ''}" onclick="ConsoleEngine.setVariant('${v.id}')">
                <div class="v-card-left">
                  <div class="v-name-row">
                    <strong>${v.name}</strong>
                    ${v.popular ? '<span class="badge badge-gold">POPULAR</span>' : ''}
                  </div>
                  <p class="v-blurb">${v.specBlurb}</p>
                </div>
                <div class="v-card-right">
                  <div class="v-price">${formatNaira(v.basePrice)}</div>
                  <span class="v-radio">${this.activeVariant && this.activeVariant.id === v.id ? '✓' : ''}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Free FC Inclusion Banner (PS4 / PS5 Only) -->
        ${consoleData.hasFCBundle ? `
          <div class="fc-inclusion-card">
            <div class="fc-icon">⚽</div>
            <div class="fc-content">
              <strong>Free EA Sports FC 26 Included</strong>
              <p>Automatically bundled free with this console — no extra charge.</p>
            </div>
          </div>
        ` : ''}

        <!-- 3. Add Physical Game Discs (Optional) -->
        <div class="form-section">
          <div class="checklist-header">
            <label class="section-label" style="margin-bottom:0;">3. Add physical games</label>
            <span class="checklist-tag">CD / Optical Disc</span>
          </div>
          <div class="search-mini-wrap">
            <input type="text" 
                   class="search-input-mini" 
                   id="search-physical-input"
                   placeholder="Search 130+ games (GTA, COD, FIFA, GOW, Spider-Man)..." 
                   oninput="ConsoleEngine.filterGamesList('physical', this.value)"
                   autocomplete="off">
          </div>
          <div class="games-check-list" id="physical-games-list">
            <!-- Dynamically populated via renderGamesList -->
          </div>
        </div>

        <!-- 4. Add Installed Digital Games -->
        <div class="form-section">
          <div class="checklist-header">
            <label class="section-label" style="margin-bottom:0;">4. Add installed games</label>
            <span class="checklist-tag">Digital load</span>
          </div>
          <p class="section-sub" style="margin-bottom:8px;">${this.activeMode === 'modded' ? 'Modded pricing active (₦2,000 per game)' : 'Standard digital account pricing'}</p>
          <div class="search-mini-wrap">
            <input type="text" 
                   class="search-input-mini" 
                   id="search-installed-input"
                   placeholder="Search digital titles (GTA, COD, FIFA, Wukong)..." 
                   oninput="ConsoleEngine.filterGamesList('installed', this.value)"
                   autocomplete="off">
          </div>
          <div class="games-check-list" id="installed-games-list">
            <!-- Dynamically populated via renderGamesList -->
          </div>

          <!-- Request a game not listed -->
          <div class="custom-game-input-wrap">
            <label class="form-label" style="font-size:0.76rem;">Request any game not on this list:</label>
            <input type="text" class="form-input" placeholder="Enter custom game title (e.g. Mortal Kombat 1, Tekken 8)..." oninput="ConsoleEngine.customGameRequest = this.value">
          </div>
        </div>

        <!-- 5. Finish Setup / Custom Wrap -->
        <div class="form-section">
          <label class="section-label">5. Custom wrap skin (Optional)</label>
          <select class="form-select" onchange="ConsoleEngine.selectedWrap = this.value; ConsoleEngine.updateTotal();">
            <option value="none">No wrap (Default console chassis)</option>
            <option value="spider-man">Spider-Man Edition Skin (+₦15,000)</option>
            <option value="god-of-war">God of War Ragnarök Wrap (+₦15,000)</option>
            <option value="cyberpunk">Cyberpunk Neon Skin (+₦15,000)</option>
            <option value="carbon-black">Carbon Matte Stealth Wrap (+₦15,000)</option>
          </select>
        </div>

        <!-- Itemized Estimated Request Breakdown -->
        <div class="studio-breakdown-card">
          <div class="bd-row">
            <span>Base console</span>
            <strong id="bd-base-price">${formatNaira(this.activeVariant ? this.activeVariant.basePrice : 0)}</strong>
          </div>
          ${consoleData.hasFCBundle ? `
            <div class="bd-row highlight-green">
              <span>FC bundle inclusion</span>
              <strong>Included (FREE)</strong>
            </div>
          ` : ''}
          <div class="bd-row">
            <span>Games & Add-ons</span>
            <strong id="bd-games-price">₦0</strong>
          </div>
          <div class="bd-divider"></div>
          <div class="bd-row total-row">
            <span>Estimated total</span>
            <strong id="engine-total-display">${formatNaira(this.calculateTotal())}</strong>
          </div>
          <p class="bd-note">💬 Final price, availability, and safe public meetup handover in Lagos are confirmed on WhatsApp.</p>
        </div>

        <!-- Action Button -->
        <button class="btn btn-primary btn-full btn-lg" onclick="ConsoleEngine.addToCart()">
          <span>Add configuration to request</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>

      </div>
    `;

    // Populate initial game lists with all platform games
    this.renderGamesList('physical', this.currentQueries.physical || '');
    this.renderGamesList('installed', this.currentQueries.installed || '');

    // Inject Configurator Styles if missing
    if (!document.getElementById('console-engine-styles')) {
      const style = document.createElement('style');
      style.id = 'console-engine-styles';
      style.textContent = `
        .studio-card {
          margin-top: 8px;
          margin-bottom: 24px;
        }
        .studio-header {
          margin-bottom: 20px;
        }
        .studio-title {
          font-family: var(--font-heading);
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-top: 6px;
          line-height: 1.2;
        }
        .studio-sub {
          font-size: 0.84rem;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .form-section {
          margin-bottom: 22px;
        }
        .section-label {
          display: block;
          font-family: var(--font-heading);
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 10px;
        }
        .platform-pills-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        .plat-pill {
          padding: 10px;
          border-radius: var(--radius-md);
          background: var(--bg-card-subtle);
          border: 1px solid var(--border-light);
          font-weight: 700;
          font-size: 0.88rem;
          color: var(--text-secondary);
          transition: var(--transition-fast);
        }
        .plat-pill.active {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          color: #fff;
          box-shadow: 0 2px 10px rgba(99, 102, 241, 0.35);
        }
        .mode-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        .mode-card {
          padding: 14px;
          background: var(--bg-card-subtle);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .mode-card.active {
          border-color: var(--accent-primary);
          background: rgba(99, 102, 241, 0.08);
        }
        .mode-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.88rem;
          margin-bottom: 4px;
        }
        .mode-card p {
          font-size: 0.72rem;
          color: var(--text-muted);
          line-height: 1.3;
        }
        .mode-check {
          color: var(--accent-primary);
          font-weight: 900;
        }
        .variant-cards-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .variant-select-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px;
          background: var(--bg-card-subtle);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .variant-select-card:hover {
          border-color: var(--border-strong);
        }
        .variant-select-card.active {
          border-color: var(--accent-primary);
          background: rgba(99, 102, 241, 0.08);
        }
        .v-name-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .v-blurb {
          font-size: 0.74rem;
          color: var(--text-muted);
          margin-top: 2px;
          max-width: 320px;
        }
        .v-card-right {
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: right;
        }
        .v-price {
          font-family: var(--font-heading);
          font-size: 1.02rem;
          font-weight: 800;
          color: var(--accent-gold);
        }
        .v-radio {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1px solid var(--border-strong);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-primary);
          font-size: 0.8rem;
          font-weight: 900;
        }
        .variant-select-card.active .v-radio {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          color: #fff;
        }
        .fc-inclusion-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: var(--radius-md);
          padding: 12px 14px;
          margin-bottom: 20px;
        }
        .fc-icon {
          font-size: 1.5rem;
        }
        .fc-content strong {
          display: block;
          font-size: 0.88rem;
          color: var(--accent-green);
        }
        .fc-content p {
          font-size: 0.74rem;
          color: var(--text-secondary);
        }
        .checklist-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .checklist-tag {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .search-mini-wrap {
          margin-bottom: 8px;
        }
        .search-input-mini {
          width: 100%;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          background: var(--bg-input);
          border: 1px solid var(--border-light);
          font-size: 0.82rem;
          color: var(--text-primary);
        }
        .games-check-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 280px;
          overflow-y: auto;
          padding-right: 4px;
          border-radius: var(--radius-sm);
        }
        .game-check-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 12px;
          background: var(--bg-card-subtle);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
          user-select: none;
        }
        .game-check-row:hover {
          background: var(--bg-card-hover);
          border-color: var(--border-light);
        }
        .game-check-row.selected {
          background: rgba(0, 212, 255, 0.08);
          border-color: rgba(0, 212, 255, 0.45);
        }
        .game-check-left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
          flex: 1;
        }
        /* Custom High-Contrast ON / OFF Toggle Switch */
        .game-switch-btn {
          width: 54px;
          height: 26px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          padding: 2px 4px;
          box-sizing: border-box;
          flex-shrink: 0;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          position: relative;
        }
        .game-switch-btn.off {
          background: rgba(255, 255, 255, 0.08);
          justify-content: flex-start;
        }
        .game-switch-btn.on {
          background: linear-gradient(135deg, #00d4ff 0%, #00ff88 100%);
          border-color: #00d4ff;
          justify-content: flex-end;
          box-shadow: 0 0 10px rgba(0, 212, 255, 0.35);
        }
        .switch-knob {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.4);
          transition: all 0.2s ease;
        }
        .switch-label {
          font-family: 'Outfit', sans-serif;
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: 0.5px;
          margin: 0 3px;
        }
        .game-switch-btn.off .switch-label {
          color: var(--text-muted);
          order: 2;
        }
        .game-switch-btn.off .switch-knob {
          order: 1;
        }
        .game-switch-btn.on .switch-label {
          color: #080c14;
          order: 1;
        }
        .game-switch-btn.on .switch-knob {
          order: 2;
        }
        .game-title-block {
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
        }
        .game-title {
          font-family: 'Outfit', sans-serif;
          font-size: 0.86rem;
          font-weight: 700;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .game-meta-sub {
          font-size: 0.7rem;
          color: var(--text-muted);
        }
        .game-price-col {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
          flex-shrink: 0;
          margin-left: 8px;
        }
        .game-price {
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          color: var(--accent-gold);
          font-size: 0.88rem;
          font-variant-numeric: tabular-nums;
        }
        .game-format-tag {
          font-size: 0.66rem;
          font-weight: 700;
          color: var(--accent-cyan);
          text-transform: uppercase;
        }
        .games-empty-state {
          padding: 20px;
          text-align: center;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.02);
          border: 1px dashed var(--border-light);
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
        }
        .games-empty-state strong {
          color: var(--accent-cyan);
        }
        .games-empty-state p {
          font-size: 0.74rem;
          color: var(--text-muted);
          margin-top: 4px;
        }
        .custom-game-input-wrap {
          margin-top: 10px;
          background: var(--bg-card-subtle);
          border: 1px dashed var(--border-light);
          border-radius: var(--radius-md);
          padding: 12px;
        }
        .studio-breakdown-card {
          background: var(--bg-card-subtle);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 16px;
          margin-bottom: 20px;
        }
        .bd-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.84rem;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }
        .bd-row strong {
          color: var(--text-primary);
          font-family: var(--font-heading);
        }
        .bd-row.highlight-green strong {
          color: var(--accent-green);
        }
        .bd-divider {
          height: 1px;
          background: var(--border-light);
          margin: 10px 0;
        }
        .bd-row.total-row {
          font-size: 1rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 6px;
        }
        .bd-row.total-row strong {
          font-size: 1.25rem;
          color: var(--accent-gold);
        }
        .bd-note {
          font-size: 0.74rem;
          color: var(--text-muted);
          line-height: 1.35;
          margin-top: 8px;
        }
      `;
      document.head.appendChild(style);
    }
  }
};

if (typeof window !== 'undefined') {
  window.ConsoleEngine = ConsoleEngine;
}
