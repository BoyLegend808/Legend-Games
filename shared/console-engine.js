/**
 * Legend Games / NaijaPlay - Interactive Console Configurator Engine
 * Powers PS5, PS4, Xbox, and PS3 configurator studios matching Figma/mockup screen.
 */

const ConsoleEngine = {
  activePlatform: 'ps4',
  activeVariant: null,
  activeMode: 'normal', // 'normal' (stock/online) | 'modded' (hacked/offline)
  enablePhysicalGames: true, // Master ON/OFF toggle for Physical Games section
  enableInstalledGames: true, // Master ON/OFF toggle for Installed Games section
  selectedPhysicalGames: [],
  selectedInstalledGames: [],
  selectedWrap: 'none',
  selectedBundle: 'none',
  customGameRequest: '',
  editingCartId: null,

  init(platformKey) {
    this.activePlatform = platformKey || 'ps4';
    const consoleData = CONSOLES_DATA[this.activePlatform];
    if (!consoleData) return;

    // Check if we are editing an existing item from the basket
    const urlParams = new URLSearchParams(window.location.search);
    const editCartId = urlParams.get('edit') || urlParams.get('editCartId');
    let editItem = null;

    if (editCartId) {
      const items = LegendCart.getItems();
      editItem = items.find(i => i.cartId === editCartId);
    }

    if (!editItem) {
      try {
        const raw = sessionStorage.getItem('legend_edit_cart_item');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && (!parsed.platform || parsed.platform === this.activePlatform)) {
            editItem = parsed;
          }
        }
      } catch (e) {}
    }

    if (editItem) {
      this.editingCartId = editItem.cartId;
      if (editItem.platform) this.activePlatform = editItem.platform;
      if (editItem.mode) this.activeMode = editItem.mode;
      
      const foundVariant = consoleData.variants.find(v => v.name === editItem.variant || v.id === editItem.variantId);
      this.activeVariant = foundVariant || consoleData.variants[0];

      if (editItem.physicalGames && Array.isArray(editItem.physicalGames)) {
        this.selectedPhysicalGames = editItem.physicalGames.map(g => typeof g === 'string' ? g : g.id);
        this.enablePhysicalGames = this.selectedPhysicalGames.length > 0;
      }
      if (editItem.installedGames && Array.isArray(editItem.installedGames)) {
        this.selectedInstalledGames = editItem.installedGames.map(g => typeof g === 'string' ? g : g.id);
        this.enableInstalledGames = this.selectedInstalledGames.length > 0;
      }
      if (editItem.wrap) {
        this.selectedWrap = editItem.wrap;
      }
      if (editItem.customGameRequest) {
        this.customGameRequest = editItem.customGameRequest;
      }
    } else {
      // Set default variant
      const defaultVar = consoleData.variants.find(v => v.popular) || consoleData.variants[0];
      this.activeVariant = defaultVar;
    }

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
      const cards = document.querySelectorAll('.variant-select-card');
      cards.forEach(c => c.classList.remove('active'));
      const activeCard = document.querySelector(`.variant-select-card[data-var-id="${variantId}"]`);
      if (activeCard) activeCard.classList.add('active');
    }
  },

  togglePhysicalSection() {
    this.enablePhysicalGames = !this.enablePhysicalGames;
    this.updateTotal();
    this.render();
  },

  toggleInstalledSection() {
    this.enableInstalledGames = !this.enableInstalledGames;
    this.updateTotal();
    this.render();
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
    this.updateCountBadges();
  },

  toggleInstalledGame(gameId) {
    const index = this.selectedInstalledGames.indexOf(gameId);
    if (index > -1) {
      this.selectedInstalledGames.splice(index, 1);
    } else {
      const cap = this.getConsoleStorageCapacity();
      const currentUsed = this.calculateStorageUsed();
      const g = (window.GAMES_CATALOG || []).find(item => item.id === gameId);
      const gameSize = this.activePlatform === 'ps5' ? (g?.ps5SizeGB || g?.ps4SizeGB || 50) : (g?.ps4SizeGB || 45);

      if (currentUsed + gameSize > cap.usableGB) {
        showToast('⚠️ Internal SSD/HDD limit reached! Remove titles or add an external game drive.');
      }
      this.selectedInstalledGames.push(gameId);
    }
    this.updateTotal();
    this.renderGamesList('installed', this.currentQueries.installed || '');
    this.updateCountBadges();
    this.updateStorageMeter();
  },

  getConsoleStorageCapacity() {
    const varName = (this.activeVariant?.name || '').toLowerCase();
    const plat = this.activePlatform;

    if (plat === 'ps5') {
      if (varName.includes('pro') || varName.includes('2tb')) {
        return { totalGB: 2000, usableGB: 1890, label: '2TB Ultra-High Speed NVMe SSD' };
      } else if (varName.includes('slim') || varName.includes('1tb')) {
        return { totalGB: 1000, usableGB: 848, label: '1TB Custom High-Speed SSD' };
      } else {
        return { totalGB: 825, usableGB: 667, label: '825GB Ultra-High Speed SSD' };
      }
    } else if (plat === 'ps4') {
      if (varName.includes('1tb') || varName.includes('pro')) {
        return { totalGB: 1000, usableGB: 861, label: '1TB Internal Hard Drive' };
      } else {
        return { totalGB: 500, usableGB: 408, label: '500GB Internal Hard Drive' };
      }
    } else if (plat === 'xbox') {
      if (varName.includes('series x') || varName.includes('1tb')) {
        return { totalGB: 1000, usableGB: 802, label: '1TB Custom NVMe SSD' };
      } else {
        return { totalGB: 512, usableGB: 364, label: '512GB Custom NVMe SSD' };
      }
    } else {
      return { totalGB: 500, usableGB: 450, label: '500GB Internal Storage' };
    }
  },

  calculateStorageUsed() {
    let totalGB = 0;
    if (!window.GAMES_CATALOG) return 0;
    this.selectedInstalledGames.forEach(gid => {
      const g = GAMES_CATALOG.find(item => item.id === gid);
      if (g) {
        const size = this.activePlatform === 'ps5' ? (g.ps5SizeGB || g.ps4SizeGB || 50) : (g.ps4SizeGB || 45);
        totalGB += Number(size);
      }
    });
    return totalGB;
  },

  updateStorageMeter() {
    const cap = this.getConsoleStorageCapacity();
    const used = this.calculateStorageUsed();
    const remaining = Math.max(0, cap.usableGB - used);
    const percentage = Math.min(100, (used / cap.usableGB) * 100);

    const usedDisplay = document.getElementById('console-storage-used-display');
    const maxDisplay = document.getElementById('console-storage-max-display');
    const remainingText = document.getElementById('console-storage-remaining-text');
    const countText = document.getElementById('console-storage-games-count');
    const fill = document.getElementById('console-storage-progress-fill');
    const capLabel = document.getElementById('console-storage-cap-label');
    const alertBox = document.getElementById('console-storage-alert');

    if (usedDisplay) usedDisplay.textContent = `${used} GB`;
    if (maxDisplay) maxDisplay.textContent = `/ ${cap.usableGB} GB usable (${cap.totalGB}GB raw)`;
    if (remainingText) remainingText.textContent = `${remaining} GB remaining`;
    if (countText) countText.textContent = `${this.selectedInstalledGames.length} digital titles`;
    if (capLabel) capLabel.textContent = cap.label;

    if (fill) {
      fill.style.width = `${percentage}%`;
      fill.className = 'storage-progress-bar-fill';
      if (percentage > 90) fill.classList.add('danger');
      else if (percentage > 70) fill.classList.add('warning');
    }

    if (alertBox) {
      alertBox.style.display = percentage > 85 ? 'flex' : 'none';
    }
  },

  updateCountBadges() {
    const physBadge = document.getElementById('phys-count-badge');
    if (physBadge) {
      const count = this.selectedPhysicalGames.length;
      physBadge.textContent = count > 0 ? `${count} selected` : 'None';
      physBadge.className = `section-count-pill ${count > 0 ? 'active' : ''}`;
    }
    const instBadge = document.getElementById('inst-count-badge');
    if (instBadge) {
      const count = this.selectedInstalledGames.length;
      instBadge.textContent = count > 0 ? `${count} selected` : 'None';
      instBadge.className = `section-count-pill ${count > 0 ? 'active' : ''}`;
    }
  },

  calculateTotal() {
    if (!this.activeVariant) return 0;
    let total = Number(this.activeVariant.basePrice || 0);

    // Physical games pricing (if section ON)
    if (this.enablePhysicalGames && window.GAMES_CATALOG) {
      this.selectedPhysicalGames.forEach(gid => {
        const g = GAMES_CATALOG.find(item => item.id === gid);
        if (g) total += Number(g.cdPrice || g.price || 18000);
      });
    }

    // Installed games pricing (if section ON)
    if (this.enableInstalledGames && window.GAMES_CATALOG) {
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
        if (this.enablePhysicalGames) {
          this.selectedPhysicalGames.forEach(gid => {
            const g = GAMES_CATALOG.find(item => item.id === gid);
            if (g) gamesTotal += Number(g.cdPrice || g.price || 18000);
          });
        }
        if (this.enableInstalledGames) {
          this.selectedInstalledGames.forEach(gid => {
            const g = GAMES_CATALOG.find(item => item.id === gid);
            if (g) gamesTotal += Number(this.activeMode === 'modded' ? (g.moddedPrice || 2000) : (g.onlinePrice || 6000));
          });
        }
      }
      gamesDisplay.textContent = gamesTotal > 0 ? formatNaira(gamesTotal) : '₦0';
    }
  },

  addToCart() {
    if (!this.activeVariant) return;
    const consoleData = CONSOLES_DATA[this.activePlatform];

    const physGameObjects = this.enablePhysicalGames ? this.selectedPhysicalGames.map(gid => {
      const g = GAMES_CATALOG.find(item => item.id === gid);
      return g ? { id: g.id, title: g.title, price: g.cdPrice || 18000 } : { id: gid, title: gid };
    }) : [];

    const instGameObjects = this.enableInstalledGames ? this.selectedInstalledGames.map(gid => {
      const g = GAMES_CATALOG.find(item => item.id === gid);
      const price = this.activeMode === 'modded' ? (g?.moddedPrice || 2000) : (g?.onlinePrice || 6000);
      return g ? { id: g.id, title: g.title, price } : { id: gid, title: gid };
    }) : [];

    const configItem = {
      cartId: this.editingCartId || undefined,
      type: 'console-config',
      platform: this.activePlatform,
      title: `${consoleData.name} (${this.activeVariant.name})`,
      variant: this.activeVariant.name,
      variantId: this.activeVariant.id,
      mode: this.activeMode,
      freeFC: consoleData.hasFCBundle,
      basePrice: this.activeVariant.basePrice,
      totalPrice: this.calculateTotal(),
      physicalGames: physGameObjects,
      installedGames: instGameObjects,
      wrap: this.selectedWrap !== 'none' ? this.selectedWrap : null,
      customGameRequest: (this.enableInstalledGames && this.customGameRequest) ? this.customGameRequest : null,
      quantity: 1,
      image: consoleData.image
    };

    if (this.editingCartId) {
      LegendCart.updateItem(this.editingCartId, configItem);
      try {
        sessionStorage.removeItem('legend_edit_cart_item');
      } catch (e) {}
      showToast('Configuration updated in basket!');
      setTimeout(() => {
        window.location.href = '../../cart/cart.html';
      }, 400);
    } else {
      LegendCart.addItem(configItem);
    }
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

      return `
        <div class="game-check-row ${isSelected ? 'selected' : ''}" onclick="${toggleMethod}('${g.id}')">
          <div class="game-check-left">
            <!-- Tactile Checkbox Box -->
            <div class="game-check-box ${isSelected ? 'checked' : ''}">
              ${isSelected ? '✓' : ''}
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
        ${this.editingCartId ? `
          <div class="edit-mode-banner">
            <div class="edit-mode-info">
              <span class="edit-mode-icon">✏️</span>
              <div>
                <strong>Editing Basket Item</strong>
                <p>Modify your variant, game discs, or preloaded titles below.</p>
              </div>
            </div>
            <a href="../../cart/cart.html" class="btn-cancel-edit">Back to Basket</a>
          </div>
        ` : ''}
        <div class="studio-header">
          <span class="badge badge-purple">${this.editingCartId ? 'EDIT CONFIGURATION' : 'REQUEST A QUOTE'}</span>
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
              <div class="variant-select-card ${this.activeVariant && this.activeVariant.id === v.id ? 'active' : ''}" data-var-id="${v.id}" onclick="ConsoleEngine.setVariant('${v.id}')">
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

        <!-- 3. Add Physical Game Discs (With Master Section ON/OFF Toggle Bar) -->
        <div class="form-section section-games-wrapper ${this.enablePhysicalGames ? 'section-active' : 'section-muted'}">
          <div class="section-toggle-bar ${this.enablePhysicalGames ? 'bar-on' : 'bar-off'}" onclick="ConsoleEngine.togglePhysicalSection()">
            <div class="section-toggle-left">
              <div class="section-title-line">
                <span class="section-title-num">3</span>
                <span class="section-title-text">Add Physical Game Discs</span>
                <span class="checklist-tag">CD / Optical Disc</span>
              </div>
              <p class="section-toggle-desc">Physical boxed discs included with console. Turn ON to select titles.</p>
            </div>
            <div class="section-toggle-right">
              <span class="section-count-pill ${this.selectedPhysicalGames.length > 0 ? 'active' : ''}" id="phys-count-badge">
                ${this.selectedPhysicalGames.length > 0 ? `${this.selectedPhysicalGames.length} selected` : '0 selected'}
              </span>
              <!-- Master Section ON / OFF Switch -->
              <div class="section-master-switch ${this.enablePhysicalGames ? 'on' : 'off'}" role="switch" aria-checked="${this.enablePhysicalGames}">
                <span class="master-switch-knob"></span>
                <span class="master-switch-label">${this.enablePhysicalGames ? 'ON' : 'OFF'}</span>
              </div>
            </div>
          </div>

          ${this.enablePhysicalGames ? `
            <div class="section-drawer open">
              <div class="search-mini-wrap">
                <input type="text" 
                       class="search-input-mini" 
                       id="search-physical-input"
                       placeholder="Search physical discs (GTA, COD, FIFA, GOW, Spider-Man)..." 
                       value="${this.currentQueries.physical || ''}"
                       oninput="ConsoleEngine.filterGamesList('physical', this.value)"
                       autocomplete="off">
              </div>
              <div class="games-check-list" id="physical-games-list">
                <!-- Dynamically populated via renderGamesList -->
              </div>
            </div>
          ` : `
            <div class="section-disabled-notice" onclick="ConsoleEngine.togglePhysicalSection()">
              <span>⚪ Physical discs disabled — Tap switch to turn <strong>ON</strong></span>
            </div>
          `}
        </div>

        <!-- 4. Add Installed Digital Games (With Master Section ON/OFF Toggle Bar) -->
        <div class="form-section section-games-wrapper ${this.enableInstalledGames ? 'section-active' : 'section-muted'}">
          <div class="section-toggle-bar ${this.enableInstalledGames ? 'bar-on' : 'bar-off'}" onclick="ConsoleEngine.toggleInstalledSection()">
            <div class="section-toggle-left">
              <div class="section-title-line">
                <span class="section-title-num">4</span>
                <span class="section-title-text">Add Installed Digital Games</span>
                <span class="checklist-tag">Internal Storage</span>
              </div>
              <p class="section-toggle-desc">${this.activeMode === 'modded' ? 'Preloaded games directly on SSD (₦2,000/game)' : 'Digital accounts preloaded on console'}. Turn ON to select titles.</p>
            </div>
            <div class="section-toggle-right">
              <span class="section-count-pill ${this.selectedInstalledGames.length > 0 ? 'active' : ''}" id="inst-count-badge">
                ${this.selectedInstalledGames.length > 0 ? `${this.selectedInstalledGames.length} selected` : '0 selected'}
              </span>
              <!-- Master Section ON / OFF Switch -->
              <div class="section-master-switch ${this.enableInstalledGames ? 'on' : 'off'}" role="switch" aria-checked="${this.enableInstalledGames}">
                <span class="master-switch-knob"></span>
                <span class="master-switch-label">${this.enableInstalledGames ? 'ON' : 'OFF'}</span>
              </div>
            </div>
          </div>

          ${this.enableInstalledGames ? `
            <div class="section-drawer open">
              <!-- Live Console Storage Capacity Visualizer -->
              <div class="storage-meter-card console-storage-meter">
                <div class="storage-meter-header">
                  <div>
                    <span class="storage-meter-label" id="console-storage-cap-label">Console Storage</span>
                    <div class="storage-meter-values">
                      <strong id="console-storage-used-display">0 GB</strong>
                      <span id="console-storage-max-display">/ 848 GB usable</span>
                    </div>
                  </div>
                  <span class="buffer-badge">Safe OS Buffer Reserved</span>
                </div>
                <div class="storage-progress-bar">
                  <div class="storage-progress-bar-fill" id="console-storage-progress-fill" style="width: 0%;"></div>
                </div>
                <div class="storage-meter-footer">
                  <span id="console-storage-remaining-text">Calculating free space...</span>
                  <span id="console-storage-games-count">0 digital titles</span>
                </div>
                <div class="storage-alert-box" id="console-storage-alert" style="display: none;">
                  <div class="storage-alert-text">
                    <strong>⚠️ Storage Approaching Limit</strong>
                    <span>Running out of room? You can also load 50+ titles on an external USB game drive!</span>
                  </div>
                  <a href="../../disk/disk.html" class="storage-alert-btn">View External Game Drives →</a>
                </div>
              </div>

              <div class="search-mini-wrap">
                <input type="text" 
                       class="search-input-mini" 
                       id="search-installed-input"
                       placeholder="Search digital titles (GTA, COD, FIFA, Wukong, GOW)..." 
                       value="${this.currentQueries.installed || ''}"
                       oninput="ConsoleEngine.filterGamesList('installed', this.value)"
                       autocomplete="off">
              </div>
              <div class="games-check-list" id="installed-games-list">
                <!-- Dynamically populated via renderGamesList -->
              </div>
              <!-- Request a game not listed -->
              <div class="custom-game-input-wrap">
                <label class="form-label" style="font-size:0.76rem;">Request any digital title not on this list:</label>
                <input type="text" class="form-input" placeholder="Enter custom game name (e.g. Mortal Kombat 1, Tekken 8)..." value="${this.customGameRequest || ''}" oninput="ConsoleEngine.customGameRequest = this.value">
              </div>
            </div>
          ` : `
            <div class="section-disabled-notice" onclick="ConsoleEngine.toggleInstalledSection()">
              <span>⚪ Installed games disabled — Tap switch to turn <strong>ON</strong></span>
            </div>
          `}
        </div>

        <!-- 5. Finish Setup / Custom Wrap -->
        <div class="form-section">
          <label class="section-label">5. Custom wrap skin (Optional)</label>
          <select class="form-select" onchange="ConsoleEngine.selectedWrap = this.value; ConsoleEngine.updateTotal();">
            <option value="none" ${this.selectedWrap === 'none' ? 'selected' : ''}>No wrap (Default console chassis)</option>
            <option value="spider-man" ${this.selectedWrap === 'spider-man' ? 'selected' : ''}>Spider-Man Edition Skin (+₦15,000)</option>
            <option value="god-of-war" ${this.selectedWrap === 'god-of-war' ? 'selected' : ''}>God of War Ragnarök Wrap (+₦15,000)</option>
            <option value="cyberpunk" ${this.selectedWrap === 'cyberpunk' ? 'selected' : ''}>Cyberpunk Neon Skin (+₦15,000)</option>
            <option value="carbon-black" ${this.selectedWrap === 'carbon-black' ? 'selected' : ''}>Carbon Matte Stealth Wrap (+₦15,000)</option>
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
          <span>${this.editingCartId ? '✓ Save Changes & Update Basket' : 'Add configuration to request'}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>

      </div>
    `;

    // Populate initial game lists if sections are active
    if (this.enablePhysicalGames) {
      this.renderGamesList('physical', this.currentQueries.physical || '');
    }
    if (this.enableInstalledGames) {
      this.renderGamesList('installed', this.currentQueries.installed || '');
      this.updateStorageMeter();
    }

    // Inject Configurator Styles if missing
    if (!document.getElementById('console-engine-styles')) {
      const style = document.createElement('style');
      style.id = 'console-engine-styles';
      style.textContent = `
        .studio-card {
          margin-top: 8px;
          margin-bottom: 24px;
        }
        .edit-mode-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(0, 212, 255, 0.08);
          border: 1px solid rgba(0, 212, 255, 0.35);
          border-radius: var(--radius-md);
          padding: 12px 14px;
          margin-bottom: 16px;
          gap: 12px;
        }
        .edit-mode-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .edit-mode-icon {
          font-size: 1.3rem;
        }
        .edit-mode-info strong {
          display: block;
          font-size: 0.88rem;
          color: var(--accent-cyan);
        }
        .edit-mode-info p {
          font-size: 0.72rem;
          color: var(--text-muted);
          margin: 0;
        }
        .btn-cancel-edit {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--border-light);
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          text-decoration: none;
          white-space: nowrap;
          transition: var(--transition-fast);
        }
        .btn-cancel-edit:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
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
        
        /* Master Section Toggle Bar Styles */
        .section-games-wrapper {
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 12px;
          background: rgba(255, 255, 255, 0.015);
          transition: all 0.25s ease;
        }
        .section-games-wrapper.section-active {
          border-color: rgba(0, 212, 255, 0.3);
          background: rgba(0, 212, 255, 0.02);
        }
        .section-games-wrapper.section-muted {
          opacity: 0.75;
          border-color: var(--border-subtle);
        }
        .section-toggle-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          padding: 4px 2px;
          user-select: none;
        }
        .section-toggle-left {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .section-title-line {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .section-title-num {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--accent-primary);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 800;
          font-family: var(--font-heading);
        }
        .section-title-text {
          font-family: var(--font-heading);
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .checklist-tag {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--accent-cyan);
          background: rgba(0, 212, 255, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        .section-toggle-desc {
          font-size: 0.72rem;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .section-toggle-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .section-count-pill {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-muted);
          white-space: nowrap;
        }
        .section-count-pill.active {
          background: rgba(0, 212, 255, 0.15);
          color: var(--accent-cyan);
          border: 1px solid rgba(0, 212, 255, 0.3);
        }
        
        /* Master Section ON/OFF Switch */
        .section-master-switch {
          width: 58px;
          height: 28px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          padding: 2px 5px;
          box-sizing: border-box;
          flex-shrink: 0;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        .section-master-switch.off {
          background: rgba(255, 255, 255, 0.08);
          justify-content: flex-start;
        }
        .section-master-switch.on {
          background: linear-gradient(135deg, #00d4ff 0%, #00ff88 100%);
          border-color: #00d4ff;
          justify-content: flex-end;
          box-shadow: 0 0 12px rgba(0, 212, 255, 0.4);
        }
        .master-switch-knob {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 2px 5px rgba(0,0,0,0.5);
          transition: all 0.25s ease;
        }
        .master-switch-label {
          font-family: 'Outfit', sans-serif;
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 0.5px;
          margin: 0 4px;
        }
        .section-master-switch.off .master-switch-label {
          color: var(--text-muted);
          order: 2;
        }
        .section-master-switch.off .master-switch-knob {
          order: 1;
        }
        .section-master-switch.on .master-switch-label {
          color: #080c14;
          order: 1;
        }
        .section-master-switch.on .master-switch-knob {
          order: 2;
        }

        .section-drawer {
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid var(--border-subtle);
          animation: drawerSlide 0.2s ease-out;
        }
        @keyframes drawerSlide {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .section-disabled-notice {
          margin-top: 10px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: var(--radius-sm);
          font-size: 0.76rem;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .section-disabled-notice strong {
          color: var(--accent-cyan);
        }

        .search-mini-wrap {
          margin-bottom: 8px;
        }
        .search-input-mini {
          width: 100%;
          padding: 9px 12px;
          border-radius: var(--radius-sm);
          background: var(--bg-input);
          border: 1px solid var(--border-light);
          font-size: 0.84rem;
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.2s ease;
        }
        .search-input-mini:focus {
          border-color: var(--accent-cyan);
          box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.15);
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
        /* Sleek game checkbox */
        .game-check-box {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          border: 1px solid var(--border-strong);
          background: rgba(255, 255, 255, 0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 900;
          color: #ffffff;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        .game-check-box.checked {
          background: var(--accent-cyan);
          border-color: var(--accent-cyan);
          color: #080c14;
          box-shadow: 0 0 8px rgba(0, 212, 255, 0.35);
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
