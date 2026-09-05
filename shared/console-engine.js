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
  gameSearch: { physical: '', installed: '' },
  GAMES_PREVIEW_COUNT: 8,

  init(platformKey) {
    this.activePlatform = platformKey || 'ps4';
    const consoleData = CONSOLES_DATA[this.activePlatform];
    if (!consoleData) return;

    // Set default variant
    const defaultVar = consoleData.variants.find(v => v.popular) || consoleData.variants[0];
    this.activeVariant = defaultVar;

    this.render();
  },

  setPlatform(platformKey) {
    if (!CONSOLES_DATA[platformKey]) return;
    this.activePlatform = platformKey;
    this.activeVariant = CONSOLES_DATA[platformKey].variants.find(v => v.popular) || CONSOLES_DATA[platformKey].variants[0];
    this.selectedPhysicalGames = [];
    this.selectedInstalledGames = [];
    this.gameSearch = { physical: '', installed: '' };
    this.render();
  },

  setMode(mode) {
    this.activeMode = mode;
    this.render();
  },

  setVariant(variantId) {
    const consoleData = CONSOLES_DATA[this.activePlatform];
    const found = consoleData.variants.find(v => v.id === variantId);
    if (!found) return;

    this.activeVariant = found;
    document.querySelectorAll('.variant-select-card').forEach(card => {
      const isActive = card.dataset.variantId === variantId;
      card.classList.toggle('active', isActive);
      card.setAttribute('aria-checked', isActive ? 'true' : 'false');
      const radio = card.querySelector('.v-radio');
      if (radio) radio.textContent = isActive ? '✓' : '';
    });
    this.updateTotal();
  },

  setWrap(wrapId) {
    this.selectedWrap = wrapId;
    this.updateTotal();
  },

  selectedWrapName() {
    if (this.selectedWrap === 'none' || !window.WRAPS_DATA) return null;
    const wrap = WRAPS_DATA.find(w => w.id === this.selectedWrap);
    return wrap ? wrap.name : null;
  },

  wrapAddonPrice() {
    if (this.selectedWrap === 'none' || !window.WRAPS_DATA) return 0;
    const wrap = WRAPS_DATA.find(w => w.id === this.selectedWrap);
    return wrap ? Number(wrap.addonPrice || 0) : 0;
  },

  gamesAddonTotal() {
    if (!window.GAMES_CATALOG) return 0;
    let total = 0;
    this.selectedPhysicalGames.forEach(gid => {
      const g = GAMES_CATALOG.find(item => item.id === gid);
      if (g) total += Number(g.cdPrice || 0);
    });
    this.selectedInstalledGames.forEach(gid => {
      const g = GAMES_CATALOG.find(item => item.id === gid);
      if (g) total += Number(this.activeMode === 'modded' ? (g.moddedPrice || 2500) : (g.onlinePrice || 6000));
    });
    return total;
  },

  togglePhysicalGame(gameId) {
    const index = this.selectedPhysicalGames.indexOf(gameId);
    if (index > -1) {
      this.selectedPhysicalGames.splice(index, 1);
    } else {
      this.selectedPhysicalGames.push(gameId);
    }
    this.updateTotal();
  },

  toggleInstalledGame(gameId) {
    const index = this.selectedInstalledGames.indexOf(gameId);
    if (index > -1) {
      this.selectedInstalledGames.splice(index, 1);
    } else {
      this.selectedInstalledGames.push(gameId);
    }
    this.updateTotal();
  },

  calculateTotal() {
    if (!this.activeVariant) return 0;
    return Number(this.activeVariant.basePrice || 0) + this.gamesAddonTotal() + this.wrapAddonPrice();
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
      gamesDisplay.textContent = formatNaira(this.gamesAddonTotal() + this.wrapAddonPrice());
    }
  },

  addToCart() {
    if (!this.activeVariant) return;
    const consoleData = CONSOLES_DATA[this.activePlatform];

    const physGameObjects = this.selectedPhysicalGames.map(gid => {
      const g = GAMES_CATALOG.find(item => item.id === gid);
      return g ? { id: g.id, title: g.title, price: g.cdPrice } : { id: gid, title: gid };
    });

    const instGameObjects = this.selectedInstalledGames.map(gid => {
      const g = GAMES_CATALOG.find(item => item.id === gid);
      const price = this.activeMode === 'modded' ? (g?.moddedPrice || 2500) : (g?.onlinePrice || 6000);
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
      wrap: this.selectedWrapName(),
      customGameRequest: this.customGameRequest || null,
      quantity: 1,
      image: consoleData.image
    };

    LegendCart.addItem(configItem);
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
              <div class="variant-select-card ${this.activeVariant && this.activeVariant.id === v.id ? 'active' : ''}" data-variant-id="${v.id}" role="radio" aria-checked="${this.activeVariant && this.activeVariant.id === v.id}" onclick="ConsoleEngine.setVariant('${v.id}')">
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
            <span class="checklist-tag">CD / Disc</span>
          </div>
          <div class="search-mini-wrap">
            <input type="text" class="search-input-mini" placeholder="Search titles (e.g. GTA, Spider-Man)..." oninput="ConsoleEngine.filterGamesList('physical', this.value)">
          </div>
          <div class="games-check-list" id="physical-games-list">${this.gamesListHtml('physical')}</div>
        </div>

        <!-- 4. Add Installed Digital Games -->
        <div class="form-section">
          <div class="checklist-header">
            <label class="section-label" style="margin-bottom:0;">4. Add installed games</label>
            <span class="checklist-tag">Digital install</span>
          </div>
          <p class="section-sub" style="margin-bottom:8px;">${this.activeMode === 'modded' ? 'Modded pricing active (cheaper)' : 'Standard online account pricing'}</p>
          <div class="search-mini-wrap">
            <input type="text" class="search-input-mini" placeholder="Search digital titles..." oninput="ConsoleEngine.filterGamesList('installed', this.value)">
          </div>
          <div class="games-check-list" id="installed-games-list">${this.gamesListHtml('installed')}</div>

          <!-- Request a game not listed -->
          <div class="custom-game-input-wrap">
            <label class="form-label" style="font-size:0.76rem;">Request any game not on this list:</label>
            <input type="text" class="form-input" placeholder="Enter game name (e.g. Mortal Kombat 1, Tekken 8)..." value="${this.customGameRequest}" oninput="ConsoleEngine.customGameRequest = this.value">
          </div>
        </div>

        <!-- 5. Finish Setup / Custom Wrap -->
        <div class="form-section">
          <label class="section-label" for="engine-wrap-select">5. Custom wrap skin (Optional)</label>
          <select class="form-select" id="engine-wrap-select" onchange="ConsoleEngine.setWrap(this.value)">
            <option value="none">No wrap (Default console chassis)</option>
            ${(window.WRAPS_DATA || []).map(w => `
              <option value="${w.id}" ${this.selectedWrap === w.id ? 'selected' : ''}>${w.name} (+${formatNaira(w.addonPrice)})</option>
            `).join('')}
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
            <strong id="bd-games-price">${formatNaira(this.gamesAddonTotal() + this.wrapAddonPrice())}</strong>
          </div>
          <div class="bd-divider"></div>
          <div class="bd-row total-row">
            <span>Estimated total</span>
            <strong id="engine-total-display">${formatNaira(this.calculateTotal())}</strong>
          </div>
          <p class="bd-note">💬 Final price, availability, and safe public meetup handover in Lagos are confirmed on WhatsApp.</p>
        </div>

        <!-- Action Button -->
        <button class="btn btn-primary btn-full btn-lg" id="engine-primary-cta" onclick="ConsoleEngine.addToCart()">
          <span>Add configuration to request</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>

      </div>
    `;

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
          font-size: 0.78rem;
          color: var(--text-muted);
          line-height: 1.3;
        }
        .mode-check {
          color: var(--accent-primary-text);
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
          font-size: 0.78rem;
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
          color: var(--accent-primary-text);
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
          font-size: 0.78rem;
          color: var(--text-secondary);
        }
        .checklist-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .checklist-tag {
          font-size: 0.78rem;
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
          max-height: 220px;
          overflow-y: auto;
          padding-right: 4px;
        }
        .game-check-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 12px;
          background: var(--bg-card-subtle);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          font-size: 0.84rem;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .game-check-row:hover {
          background: var(--bg-card-hover);
        }
        .game-check-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .game-check-left input {
          accent-color: var(--accent-primary);
          width: 16px;
          height: 16px;
        }
        .game-price {
          font-family: var(--font-heading);
          font-weight: 700;
          color: var(--accent-gold);
          font-size: 0.86rem;
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
          font-size: 0.78rem;
          color: var(--text-muted);
          line-height: 1.35;
          margin-top: 8px;
        }
        .engine-sticky-bar {
          position: fixed;
          left: 0;
          right: 0;
          bottom: var(--nav-height-btm);
          z-index: 90;
          padding: 10px 16px calc(10px + env(safe-area-inset-bottom, 0px));
          background: var(--bg-elevated, #171928);
          border-top: 1px solid var(--border-subtle);
          box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.35);
          transform: translateY(140%);
          transition: transform 0.22s ease;
          pointer-events: none;
        }
        .engine-sticky-bar.visible {
          transform: translateY(0);
          pointer-events: auto;
        }
        .sticky-bar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          max-width: var(--site-max-width);
          margin: 0 auto;
        }
        .sticky-bar-total {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .sticky-bar-total span {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        .sticky-bar-total strong {
          font-family: var(--font-heading);
          font-size: 1.05rem;
          color: var(--accent-gold);
        }
        .sticky-bar-inner .btn {
          white-space: nowrap;
        }
        body.engine-cta-visible #float-wa-btn {
          transform: translateY(-72px);
        }
        .games-empty-state,
        .games-list-hint {
          font-size: 0.76rem;
          color: var(--text-muted);
          line-height: 1.4;
          padding: 10px 4px 2px;
        }
        .games-empty-state {
          text-align: center;
          padding: 18px 12px;
        }
      `;
      document.head.appendChild(style);
    }

    this.mountStickyBar();
  },

  mountStickyBar() {
    let bar = document.getElementById('engine-sticky-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'engine-sticky-bar';
      bar.className = 'engine-sticky-bar';
      bar.innerHTML = `
        <div class="sticky-bar-inner">
          <div class="sticky-bar-total">
            <span>Estimated total</span>
            <strong id="engine-sticky-total">${formatNaira(this.calculateTotal())}</strong>
          </div>
          <button class="btn btn-primary" onclick="ConsoleEngine.addToCart()">Add to request</button>
        </div>
      `;
      document.body.appendChild(bar);
    }

    // Only surface the sticky bar while the in-page CTA is scrolled out of view.
    const cta = document.getElementById('engine-primary-cta');
    if (this.ctaObserver) this.ctaObserver.disconnect();
    if (cta && 'IntersectionObserver' in window) {
      this.ctaObserver = new IntersectionObserver(entries => {
        const show = !entries[0].isIntersecting;
        bar.classList.toggle('visible', show);
        document.body.classList.toggle('engine-cta-visible', show);
      }, { threshold: 0.05 });
      this.ctaObserver.observe(cta);
    } else {
      bar.classList.add('visible');
      document.body.classList.add('engine-cta-visible');
    }
  },

  platformGames() {
    return window.GAMES_CATALOG
      ? GAMES_CATALOG.filter(g => g.platforms.includes(this.activePlatform))
      : [];
  },

  gamesListHtml(type) {
    const term = (this.gameSearch[type] || '').trim().toLowerCase();
    const all = this.platformGames();
    const matches = term ? all.filter(g => g.title.toLowerCase().includes(term)) : all;
    const selected = type === 'physical' ? this.selectedPhysicalGames : this.selectedInstalledGames;
    const toggleFn = type === 'physical' ? 'togglePhysicalGame' : 'toggleInstalledGame';

    if (matches.length === 0) {
      return `<p class="games-empty-state">No titles match “${term}”. Type it into “Request any game not on this list” below and we will source it.</p>`;
    }

    // Without a search term the list is capped to a preview; searching reveals the whole catalogue.
    const visible = term ? matches : matches.slice(0, this.GAMES_PREVIEW_COUNT);
    const hidden = matches.length - visible.length;

    const rows = visible.map(g => {
      const price = type === 'physical'
        ? Number(g.cdPrice || 0)
        : Number(this.activeMode === 'modded' ? (g.moddedPrice || 2500) : (g.onlinePrice || 6000));
      return `
        <label class="game-check-row">
          <div class="game-check-left">
            <input type="checkbox" ${selected.includes(g.id) ? 'checked' : ''} onchange="ConsoleEngine.${toggleFn}('${g.id}')">
            <span class="game-title">${g.title}</span>
          </div>
          <span class="game-price">${formatNaira(price)}</span>
        </label>
      `;
    }).join('');

    const more = hidden > 0
      ? `<p class="games-list-hint">Search above to see ${hidden} more ${hidden === 1 ? 'title' : 'titles'}.</p>`
      : '';

    return rows + more;
  },

  filterGamesList(type, query) {
    this.gameSearch[type] = query || '';
    const container = document.getElementById(type === 'physical' ? 'physical-games-list' : 'installed-games-list');
    if (container) container.innerHTML = this.gamesListHtml(type);
  }
};

if (typeof window !== 'undefined') {
  window.ConsoleEngine = ConsoleEngine;
}
