/**
 * Legend Games — Console Swap & Trade-In Valuation Controller
 */

const TRADEIN_DEVICES = [
  {
    id: 'ps4_slim_1tb',
    name: 'PlayStation 4 Slim (1TB)',
    platform: 'ps4',
    baseValue: 165000,
    popular: true,
    desc: 'Most common trade-in for PS5 upgrade'
  },
  {
    id: 'ps4_slim_500',
    name: 'PlayStation 4 Slim (500GB)',
    platform: 'ps4',
    baseValue: 140000,
    popular: false,
    desc: 'Standard slim chassis'
  },
  {
    id: 'ps4_pro_1tb',
    name: 'PlayStation 4 Pro 4K (1TB)',
    platform: 'ps4',
    baseValue: 210000,
    popular: true,
    desc: 'Enhanced 4K graphics model'
  },
  {
    id: 'ps4_fat_500',
    name: 'PlayStation 4 Fat / Original (500GB)',
    platform: 'ps4',
    baseValue: 120000,
    popular: false,
    desc: 'First-gen matte/glossy console'
  },
  {
    id: 'ps5_digital',
    name: 'PlayStation 5 Digital Edition',
    platform: 'ps5',
    baseValue: 460000,
    popular: false,
    desc: 'Upgrade to PS5 Slim / Disc / Pro'
  },
  {
    id: 'ps5_disc',
    name: 'PlayStation 5 Disc Edition',
    platform: 'ps5',
    baseValue: 540000,
    popular: false,
    desc: 'Trade-in for PS5 Pro / Cashout'
  },
  {
    id: 'xbox_one_s',
    name: 'Xbox One S (500GB/1TB)',
    platform: 'xbox',
    baseValue: 110000,
    popular: false,
    desc: 'White slim Xbox console'
  },
  {
    id: 'nintendo_switch',
    name: 'Nintendo Switch (V2 / OLED)',
    platform: 'nintendo',
    baseValue: 150000,
    popular: false,
    desc: 'Handheld hybrid gaming console'
  }
];

const TRADEIN_CONDITIONS = [
  {
    id: 'mint',
    name: 'Mint / Pristine',
    multiplier: 1.05,
    badge: 'TOP VALUE',
    desc: 'Like new, whisper quiet, no scratches, sealed/unopened'
  },
  {
    id: 'good',
    name: 'Good / Clean',
    multiplier: 1.00,
    badge: 'STANDARD',
    desc: 'Normal minor cosmetic wear, 100% working drive and ports'
  },
  {
    id: 'fair',
    name: 'Fair / Heavy Use',
    multiplier: 0.80,
    badge: 'REDUCED',
    desc: 'Visible scratches, loud fan, or cosmetic scuffs (must still turn on & play)'
  }
];

const TradeInEngine = {
  selectedDeviceId: 'ps4_slim_1tb',
  selectedConditionId: 'good',
  accessories: {
    cables: true,
    box: false,
    controllers: 1
  },
  selectedGames: [],
  searchQuery: '',

  init() {
    this.renderDevices();
    this.renderConditions();
    this.renderGamesList();
    this.updateValuation();
  },

  renderDevices() {
    const grid = document.getElementById('tradein-devices-grid');
    if (!grid) return;

    grid.innerHTML = TRADEIN_DEVICES.map(dev => {
      const isSel = this.selectedDeviceId === dev.id;
      return `
        <div class="device-card ${isSel ? 'active' : ''}" onclick="TradeInEngine.selectDevice('${dev.id}')">
          <div class="device-card-top">
            <strong class="device-name">${dev.name}</strong>
            <span class="device-radio">${isSel ? '✓' : ''}</span>
          </div>
          <p class="device-desc">${dev.desc}</p>
          <div class="device-bottom">
            <span class="device-base-val">Est. Base: ${formatNaira(dev.baseValue)}</span>
            ${dev.popular ? '<span class="badge badge-gold">POPULAR TRADE</span>' : ''}
          </div>
        </div>
      `;
    }).join('');
  },

  selectDevice(devId) {
    this.selectedDeviceId = devId;
    this.renderDevices();
    this.updateValuation();
  },

  renderConditions() {
    const grid = document.getElementById('tradein-condition-grid');
    if (!grid) return;

    grid.innerHTML = TRADEIN_CONDITIONS.map(cond => {
      const isSel = this.selectedConditionId === cond.id;
      return `
        <div class="condition-card ${isSel ? 'active' : ''}" onclick="TradeInEngine.selectCondition('${cond.id}')">
          <div class="cond-header">
            <strong class="cond-name">${cond.name}</strong>
            <span class="badge ${cond.id === 'mint' ? 'badge-green' : (cond.id === 'good' ? 'badge-purple' : 'badge-gold')}">${cond.badge}</span>
          </div>
          <p class="cond-desc">${cond.desc}</p>
        </div>
      `;
    }).join('');
  },

  selectCondition(condId) {
    this.selectedConditionId = condId;
    this.renderConditions();
    this.updateValuation();
  },

  toggleAccessory(key) {
    this.accessories[key] = !this.accessories[key];
    this.updateValuation();
  },

  changeControllerCount(delta) {
    this.accessories.controllers = Math.max(0, Math.min(4, this.accessories.controllers + delta));
    const display = document.getElementById('trade-controller-count');
    if (display) display.textContent = this.accessories.controllers;
    this.updateValuation();
  },

  toggleGame(gameId) {
    const idx = this.selectedGames.indexOf(gameId);
    if (idx > -1) {
      this.selectedGames.splice(idx, 1);
    } else {
      this.selectedGames.push(gameId);
    }
    this.renderGamesList();
    this.updateValuation();
  },

  filterGames(query) {
    this.searchQuery = query || '';
    this.renderGamesList();
  },

  renderGamesList() {
    const container = document.getElementById('trade-games-list');
    const badge = document.getElementById('trade-games-count-badge');
    if (!container || !window.GAMES_CATALOG) return;

    if (badge) {
      badge.textContent = `${this.selectedGames.length} disc${this.selectedGames.length === 1 ? '' : 's'}`;
    }

    let matches = window.GAMES_CATALOG;
    if (this.searchQuery.trim()) {
      if (window.LegendSearch) {
        matches = LegendSearch.filterGames(matches, this.searchQuery);
      } else {
        const q = this.searchQuery.toLowerCase();
        matches = matches.filter(g => (g.title || '').toLowerCase().includes(q) || (g.genre || '').toLowerCase().includes(q));
      }
    }

    // Limit to top 24 for clean UI
    const displayList = matches.slice(0, 24);

    if (displayList.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:16px; font-size:0.8rem; color:var(--text-muted);">
          No games matching "${this.searchQuery}". You can mention any unlisted discs in your quote!
        </div>
      `;
      return;
    }

    container.innerHTML = displayList.map(g => {
      const isChecked = this.selectedGames.includes(g.id);
      // Trade credit is roughly 40-50% of disc retail
      const gameVal = Math.round(((g.cdPrice || g.price || 18000) * 0.45) / 1000) * 1000;

      return `
        <div class="trade-game-row ${isChecked ? 'checked' : ''}" onclick="TradeInEngine.toggleGame('${g.id}')">
          <div class="trade-game-left">
            <span class="trade-game-chk">${isChecked ? '✓' : ''}</span>
            <div>
              <strong class="trade-game-title">${g.title}</strong>
              <span class="trade-game-meta">${g.genre || 'Action'} · Blu-ray Disc</span>
            </div>
          </div>
          <span class="trade-game-val">+${formatNaira(gameVal)}</span>
        </div>
      `;
    }).join('');
  },

  calculateValuation() {
    const dev = TRADEIN_DEVICES.find(d => d.id === this.selectedDeviceId) || TRADEIN_DEVICES[0];
    const cond = TRADEIN_CONDITIONS.find(c => c.id === this.selectedConditionId) || TRADEIN_CONDITIONS[1];

    let base = dev.baseValue * cond.multiplier;

    // Accessories
    if (this.accessories.cables) base += 5000;
    if (this.accessories.box) base += 5000;
    if (this.accessories.controllers > 0) {
      // First pad included with base console, extra pads add +18,000 each
      if (this.accessories.controllers > 1) {
        base += (this.accessories.controllers - 1) * 18000;
      }
    } else {
      // No controllers deducts 15k
      base -= 15000;
    }

    // Games
    if (window.GAMES_CATALOG) {
      this.selectedGames.forEach(gid => {
        const g = GAMES_CATALOG.find(item => item.id === gid);
        if (g) {
          const gameVal = Math.round(((g.cdPrice || g.price || 18000) * 0.45) / 1000) * 1000;
          base += gameVal;
        }
      });
    }

    // Round to clean thousands
    return Math.max(20000, Math.round(base / 1000) * 1000);
  },

  updateValuation() {
    const totalVal = this.calculateValuation();
    const dev = TRADEIN_DEVICES.find(d => d.id === this.selectedDeviceId);
    const cond = TRADEIN_CONDITIONS.find(c => c.id === this.selectedConditionId);

    const display = document.getElementById('trade-val-display');
    const breakdown = document.getElementById('trade-val-breakdown');

    if (display) display.textContent = formatNaira(totalVal);

    if (breakdown) {
      const extraItems = [];
      if (this.accessories.controllers > 0) extraItems.push(`${this.accessories.controllers} Controller${this.accessories.controllers > 1 ? 's' : ''}`);
      if (this.accessories.cables) extraItems.push('Cords');
      if (this.accessories.box) extraItems.push('Box');
      if (this.selectedGames.length > 0) extraItems.push(`${this.selectedGames.length} Game Discs`);

      breakdown.textContent = `${dev?.name} (${cond?.name}) with ${extraItems.join(' + ')}. Final testing done at meetup.`;
    }
  },

  getTradeInSummaryData() {
    const dev = TRADEIN_DEVICES.find(d => d.id === this.selectedDeviceId);
    const cond = TRADEIN_CONDITIONS.find(c => c.id === this.selectedConditionId);
    const totalVal = this.calculateValuation();

    const inc = [];
    if (this.accessories.controllers > 0) inc.push(`${this.accessories.controllers} Official Pad(s)`);
    if (this.accessories.cables) inc.push('HDMI & Power Cords');
    if (this.accessories.box) inc.push('Original Box');

    const tradedGameTitles = this.selectedGames.map(gid => {
      const g = (window.GAMES_CATALOG || []).find(item => item.id === gid);
      return g ? g.title : gid;
    });

    return {
      tradeInId: 'trade_' + Date.now(),
      deviceId: this.selectedDeviceId,
      deviceName: dev?.name || 'Console',
      condition: cond?.name || 'Good',
      includedItems: inc,
      tradeGames: tradedGameTitles,
      estimatedValue: totalVal
    };
  },

  applyCreditToBasket() {
    const summary = this.getTradeInSummaryData();
    if (window.LegendTradeIn) {
      LegendTradeIn.setTradeIn(summary);
    }
    showToast('✓ Trade-in credit applied to your request!');
    setTimeout(() => {
      // If basket already has items, go to cart. If empty, go to PS5 page for easy upgrade
      if (window.LegendCart && LegendCart.getCount() > 0) {
        window.location.href = '../cart/cart.html';
      } else {
        window.location.href = '../consoles/ps5/ps5.html';
      }
    }, 400);
  },

  requestWhatsAppTradeIn() {
    const summary = this.getTradeInSummaryData();
    let msg = `*🔄 CONSOLE SWAP / TRADE-IN VALUATION REQUEST*\n`;
    msg += `------------------------------------\n`;
    msg += `• *Device:* ${summary.deviceName}\n`;
    msg += `• *Condition:* ${summary.condition}\n`;
    if (summary.includedItems.length) {
      msg += `• *Accessories:* ${summary.includedItems.join(', ')}\n`;
    }
    if (summary.tradeGames.length) {
      msg += `• *Trade Discs (${summary.tradeGames.length}):* ${summary.tradeGames.join(', ')}\n`;
    }
    msg += `• *Estimated Value:* *${formatNaira(summary.estimatedValue)}*\n`;
    try {
      const stored = JSON.parse(localStorage.getItem('legend_admin_tradeins') || '[]');
      stored.unshift({
        tradeInId: summary.tradeInId,
        deviceName: summary.deviceName,
        condition: summary.condition,
        includedItems: summary.includedItems,
        tradeGames: summary.tradeGames,
        estimatedValue: summary.estimatedValue,
        phone: '+234...',
        date: new Date().toISOString()
      });
      localStorage.setItem('legend_admin_tradeins', JSON.stringify(stored.slice(0, 30)));
    } catch (e) {
      console.warn('Trade-in save warn:', e);
    }

    openWhatsApp(msg);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  TradeInEngine.init();
});
