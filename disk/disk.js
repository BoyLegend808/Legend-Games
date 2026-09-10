/**
 * Hard Disk Game Loader Controller
 */

const DiskLoader = {
  activePurpose: 'ps4', // 'ps4' | 'pc'
  activeCapacityId: '1tb',
  selectedGames: [],
  editingCartId: null,

  init() {
    this.checkEditMode();
    this.renderCapacities();
    this.renderGames();
    this.updateMeter();
  },

  checkEditMode() {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('edit');
    if (!editId) return;

    this.editingCartId = editId;
    let editItem = null;

    try {
      const stored = sessionStorage.getItem('legend_edit_cart_item');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.cartId === editId) editItem = parsed;
      }
    } catch (e) {}

    if (!editItem && window.LegendCart) {
      editItem = LegendCart.getItems().find(i => i.cartId === editId);
    }

    if (editItem) {
      if (editItem.purpose) this.activePurpose = editItem.purpose;
      if (editItem.capacity) {
        const cLower = editItem.capacity.toLowerCase();
        if (cLower.includes('500')) this.activeCapacityId = '500gb';
        else if (cLower.includes('1tb') || cLower.includes('1 tb')) this.activeCapacityId = '1tb';
        else if (cLower.includes('2tb') || cLower.includes('2 tb')) this.activeCapacityId = '2tb';
        else if (cLower.includes('4tb') || cLower.includes('4 tb')) this.activeCapacityId = '4tb';
      }
      if (Array.isArray(editItem.installedGames)) {
        this.selectedGames = editItem.installedGames.map(g => typeof g === 'string' ? g : (g.id || g.title));
      }
      this.renderEditBanner();
    }
  },

  renderEditBanner() {
    const header = document.querySelector('.studio-header');
    if (!header) return;

    const banner = document.createElement('div');
    banner.className = 'edit-mode-banner';
    banner.style.cssText = 'background: rgba(255, 107, 0, 0.12); border: 1px solid rgba(255, 107, 0, 0.35); border-radius: 12px; padding: 12px 16px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; gap: 12px; animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);';
    banner.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 1.25rem;">✏️</span>
        <div>
          <strong style="display: block; font-size: 0.9rem; color: #ff8c33;">Editing Basket Item</strong>
          <span style="font-size: 0.78rem; color: var(--text-secondary);">Modify capacity or loaded games, then save changes to update your basket.</span>
        </div>
      </div>
      <a href="../cart/cart.html" style="font-size: 0.8rem; font-weight: 700; color: #fff; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); padding: 6px 12px; border-radius: 8px; text-decoration: none; white-space: nowrap;">Cancel</a>
    `;
    header.parentNode.insertBefore(banner, header);

    const btnText = document.querySelector('.btn-primary strong, #btn-add-disk-cart');
    if (btnText) {
      btnText.textContent = 'Save Changes & Update Basket';
    }
  },

  setPurpose(purpose) {
    this.activePurpose = purpose;
    document.getElementById('purpose-ps4')?.classList.toggle('active', purpose === 'ps4');
    document.getElementById('purpose-pc')?.classList.toggle('active', purpose === 'pc');
    const tag = document.getElementById('disk-platform-tag');
    if (tag) tag.textContent = purpose === 'ps4' ? 'PS4 Games' : 'PC Games';

    // Re-render games and calculate storage with the new platform values
    this.renderGames();
    this.updateMeter();
  },

  setCapacity(capId) {
    this.activeCapacityId = capId;
    this.renderCapacities();
    this.updateMeter();
  },

  toggleGame(gameId) {
    const index = this.selectedGames.indexOf(gameId);
    if (index > -1) {
      this.selectedGames.splice(index, 1);
    } else {
      // Check if adding this game would exceed the usable buffer
      const capData = this.getActiveCapacity();
      const currentUsed = this.calculateStorageUsed();
      const game = (window.GAMES_CATALOG || []).find(g => g.id === gameId);
      const gameSize = this.activePurpose === 'ps4' ? (game?.ps4SizeGB || 45) : (game?.pcSizeGB || 55);

      if (currentUsed + gameSize > capData.usableGB) {
        showToast('⚠️ Storage limit reached! Upgrade drive size to add more.');
        return;
      }
      this.selectedGames.push(gameId);
    }
    this.updateMeter();
  },

  getActiveCapacity() {
    const defaultList = [
      { id: '500gb', size: '500GB', capacityGB: 500, usableGB: 450, price: 25000, desc: '~10-15 Games' },
      { id: '1tb', size: '1TB', capacityGB: 1000, usableGB: 900, price: 35000, desc: '~20-30 Games', popular: true },
      { id: '2tb', size: '2TB', capacityGB: 2000, usableGB: 1800, price: 60000, desc: '~45-60 Games' },
      { id: '4tb', size: '4TB', capacityGB: 4000, usableGB: 3600, price: 110000, desc: '~90-120 Games' }
    ];
    return defaultList.find(c => c.id === this.activeCapacityId) || defaultList[1];
  },

  calculateStorageUsed() {
    let totalGB = 0;
    this.selectedGames.forEach(gid => {
      const g = (window.GAMES_CATALOG || []).find(item => item.id === gid);
      if (g) {
        const size = this.activePurpose === 'ps4' ? (g.ps4SizeGB || 45) : (g.pcSizeGB || 55);
        totalGB += Number(size);
      }
    });
    return totalGB;
  },

  renderCapacities() {
    const grid = document.getElementById('capacity-grid');
    if (!grid) return;

    const capacities = [
      { id: '500gb', size: '500GB', capacityGB: 500, usableGB: 450, price: 25000, desc: '~10-15 Games' },
      { id: '1tb', size: '1TB', capacityGB: 1000, usableGB: 900, price: 35000, desc: '~20-30 Games', popular: true },
      { id: '2tb', size: '2TB', capacityGB: 2000, usableGB: 1800, price: 60000, desc: '~45-60 Games' },
      { id: '4tb', size: '4TB', capacityGB: 4000, usableGB: 3600, price: 110000, desc: '~90-120 Games' }
    ];

    grid.innerHTML = capacities.map(c => `
      <div class="capacity-card ${this.activeCapacityId === c.id ? 'active' : ''}" onclick="DiskLoader.setCapacity('${c.id}')">
        <div class="cap-header">
          <span class="cap-size">${c.size}</span>
          <span class="cap-price">${formatNaira(c.price)}</span>
        </div>
        <div class="cap-desc">${c.desc} · ${c.usableGB}GB usable</div>
      </div>
    `).join('');
  },

  renderGames() {
    const list = document.getElementById('disk-games-list');
    if (!list || !window.GAMES_CATALOG) return;

    const relevantGames = (window.GAMES_CATALOG || []).filter(g => {
      const platforms = (g.platforms || []).map(p => p.toLowerCase());
      if (this.activePurpose === 'ps4') {
        return platforms.includes('ps4') || (g.ps4SizeGB || 0) > 0;
      }
      return platforms.includes('pc') || (g.pcSizeGB || 0) > 0;
    });

    list.innerHTML = relevantGames.map(g => {
      const sizeGB = this.activePurpose === 'ps4' ? (g.ps4SizeGB || 45) : (g.pcSizeGB || 55);
      return `
        <label class="game-check-row" data-game-id="${g.id}">
          <div class="game-check-left">
            <input type="checkbox" ${this.selectedGames.includes(g.id) ? 'checked' : ''} onchange="DiskLoader.toggleGame('${g.id}')">
            <div>
              <span class="game-title">${g.title}</span>
              <span style="display:block; font-size:0.7rem; color:var(--text-muted);">${g.genre}</span>
            </div>
          </div>
          <span class="game-price">${sizeGB} GB</span>
        </label>
      `;
    }).join('');
  },

  updateMeter() {
    const cap = this.getActiveCapacity();
    const used = this.calculateStorageUsed();
    const remaining = Math.max(0, cap.usableGB - used);
    const percentage = Math.min(100, (used / cap.usableGB) * 100);

    const usedDisplay = document.getElementById('storage-used-display');
    const maxDisplay = document.getElementById('storage-max-display');
    const remainingText = document.getElementById('storage-remaining-text');
    const countText = document.getElementById('storage-games-count');
    const fill = document.getElementById('storage-progress-fill');
    const upgradeBox = document.getElementById('upgrade-suggestion');

    if (usedDisplay) usedDisplay.textContent = `${used} GB`;
    if (maxDisplay) maxDisplay.textContent = `/ ${cap.usableGB} GB usable`;
    if (remainingText) remainingText.textContent = `${remaining} GB space remaining`;
    if (countText) countText.textContent = `${this.selectedGames.length} games selected`;

    if (fill) {
      fill.style.width = `${percentage}%`;
      fill.className = 'storage-progress-bar-fill';
      if (percentage > 85) fill.classList.add('danger');
      else if (percentage > 65) fill.classList.add('warning');
    }

    if (upgradeBox) {
      upgradeBox.style.display = percentage > 85 ? 'block' : 'none';
    }

    // Update Breakdown
    const driveName = document.getElementById('bd-drive-name');
    const drivePrice = document.getElementById('bd-drive-price');
    const totalDisplay = document.getElementById('disk-total-display');
    const gameCount = document.getElementById('bd-game-count');

    if (driveName) driveName.textContent = `${cap.size} (${this.activePurpose.toUpperCase()})`;
    if (drivePrice) drivePrice.textContent = formatNaira(cap.price);
    if (totalDisplay) totalDisplay.textContent = formatNaira(cap.price);
    if (gameCount) gameCount.textContent = this.selectedGames.length;
  },

  filterGames(query) {
    const container = document.getElementById('disk-games-list');
    if (!container) return;

    const rows = container.querySelectorAll('.game-check-row');
    rows.forEach(row => {
      const gameId = row.getAttribute('data-game-id');
      const game = (window.GAMES_CATALOG || []).find(g => g.id === gameId);
      const title = row.querySelector('.game-title')?.textContent || '';
      
      let isMatch = true;
      if (query && query.trim()) {
        if (window.LegendSearch && game) {
          isMatch = LegendSearch.matchGame(game, query);
        } else if (game) {
          const q = query.toLowerCase().trim();
          isMatch = (game.title || '').toLowerCase().includes(q) || (game.genre || '').toLowerCase().includes(q) || (game.id || '').includes(q);
        } else {
          isMatch = title.toLowerCase().includes(query.toLowerCase().trim());
        }
      }

      row.style.display = isMatch ? 'flex' : 'none';
    });
  },

  addToCart() {
    const cap = this.getActiveCapacity();
    const used = this.calculateStorageUsed();

    const loadedGamesList = this.selectedGames.map(gid => {
      const g = (window.GAMES_CATALOG || []).find(item => item.id === gid);
      const size = this.activePurpose === 'ps4' ? (g?.ps4SizeGB || 45) : (g?.pcSizeGB || 55);
      return { id: gid, title: g ? g.title : gid, sizeGB: size };
    });

    const item = {
      type: 'hard-disk',
      title: `${cap.size} Hard Disk (${this.activePurpose.toUpperCase()} Game Load)`,
      name: `${cap.size} Game Hard Drive`,
      capacity: cap.size,
      purpose: this.activePurpose,
      price: cap.price,
      totalPrice: cap.price,
      quantity: 1,
      installedGames: loadedGamesList,
      notes: `${this.selectedGames.length} games loaded (${used}GB of ${cap.usableGB}GB usable)`
    };

    if (this.editingCartId) {
      if (window.LegendCart && typeof LegendCart.updateItem === 'function') {
        LegendCart.updateItem(this.editingCartId, item);
      }
      try {
        sessionStorage.removeItem('legend_edit_cart_item');
      } catch (e) {}
      showToast('✓ Basket item updated successfully!');
      setTimeout(() => {
        window.location.href = '../cart/cart.html';
      }, 350);
      return;
    }

    LegendCart.addItem(item);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  DiskLoader.init();
});

