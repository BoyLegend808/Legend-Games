/**
 * Unified Cart & Quote Controller
 */

const LAGOS_MEETUP_HUBS = [
  // Mainland Hubs
  {
    id: 'icm',
    name: 'Ikeja City Mall (ICM)',
    area: 'Alausa, Ikeja',
    region: 'mainland',
    popular: true,
    desc: 'Public food court & central parking — monitored & safe'
  },
  {
    id: 'maryland',
    name: 'Maryland Mall',
    area: 'Ikorodu Rd, Anthony/Maryland',
    region: 'mainland',
    popular: false,
    desc: 'Underground parking & main lobby'
  },
  {
    id: 'festival',
    name: 'Festival Mall',
    area: 'Festac Town / Amuwo Odofin',
    region: 'mainland',
    popular: false,
    desc: 'Silverbird / Golden Tulip public safe zone'
  },
  {
    id: 'yaba',
    name: 'e-Center / Ozone Cinemas',
    area: 'Commercial Ave, Yaba',
    region: 'mainland',
    popular: false,
    desc: 'Central tech corridor meetup point'
  },
  {
    id: 'surulere',
    name: 'Adeniran Ogunsanya Mall (AOS)',
    area: 'Surulere',
    region: 'mainland',
    popular: false,
    desc: 'Shoprite atrium & secure parking'
  },
  // Island & Lekki Hubs
  {
    id: 'circle_mall',
    name: 'Circle Mall (Jakande)',
    area: 'Lekki Phase 1 / Osapa London',
    region: 'island',
    popular: true,
    desc: 'Anchor plaza & safe public parking'
  },
  {
    id: 'the_palms',
    name: 'The Palms Shopping Mall',
    area: 'BIS Way, Victoria Island',
    region: 'island',
    popular: true,
    desc: 'Cinema foyer & central atrium'
  },
  {
    id: 'novare',
    name: 'Novare Mall',
    area: 'Sangotedo, Ajah',
    region: 'island',
    popular: false,
    desc: 'Genesis cinema area & main concourse'
  }
];

const CartController = {
  contactMethod: 'whatsapp',
  selectedHubId: 'icm',
  activeRegion: 'mainland',
  customLocationText: '',
  lastSubmittedRef: null,
  lastSubmittedMessage: null,

  init() {
    this.renderMeetupHubs();
    this.render();
    window.addEventListener('legend-cart-updated', () => this.render());
    window.addEventListener('legend-tradein-updated', () => this.render());
  },

  setContactMethod(method) {
    this.contactMethod = method;
    document.getElementById('opt-whatsapp')?.classList.toggle('active', method === 'whatsapp');
    document.getElementById('opt-phone')?.classList.toggle('active', method === 'phone');
  },

  filterMeetupRegion(region) {
    this.activeRegion = region;
    document.getElementById('chip-mainland')?.classList.toggle('active', region === 'mainland');
    document.getElementById('chip-island')?.classList.toggle('active', region === 'island');
    document.getElementById('chip-custom')?.classList.toggle('active', region === 'custom');

    const customWrap = document.getElementById('custom-location-wrap');
    if (customWrap) {
      customWrap.style.display = region === 'custom' ? 'block' : 'none';
      if (region === 'custom') {
        document.getElementById('cust-location-custom')?.focus();
      }
    }

    this.renderMeetupHubs();
  },

  renderMeetupHubs() {
    const grid = document.getElementById('meetup-grid');
    if (!grid) return;

    if (this.activeRegion === 'custom') {
      grid.innerHTML = `
        <div class="meetup-card custom-active active" style="grid-column: 1 / -1;">
          <div class="meetup-card-top">
            <strong>📍 Direct Courier / Custom Meetup Address</strong>
            <span class="meetup-check">✓</span>
          </div>
          <p class="meetup-desc">Enter your exact landmark, estate, or street address below. Handover details confirmed on WhatsApp.</p>
        </div>
      `;
      this.updateLocationInput();
      return;
    }

    const filtered = LAGOS_MEETUP_HUBS.filter(h => h.region === this.activeRegion);

    if (!filtered.some(h => h.id === this.selectedHubId)) {
      this.selectedHubId = filtered[0]?.id || 'icm';
    }

    grid.innerHTML = filtered.map(hub => {
      const isSel = this.selectedHubId === hub.id;
      return `
        <div class="meetup-card ${isSel ? 'active' : ''}" onclick="CartController.selectMeetupHub('${hub.id}')">
          <div class="meetup-card-top">
            <div>
              <strong class="meetup-name">${hub.name}</strong>
              <span class="meetup-area">${hub.area}</span>
            </div>
            <span class="meetup-check">${isSel ? '✓' : ''}</span>
          </div>
          <p class="meetup-desc">${hub.desc}</p>
          <div class="meetup-badges">
            <span class="badge badge-green">Monitored Zone</span>
            ${hub.popular ? '<span class="badge badge-gold">POPULAR HUB</span>' : ''}
          </div>
        </div>
      `;
    }).join('');

    this.updateLocationInput();
  },

  selectMeetupHub(hubId) {
    this.selectedHubId = hubId;
    this.renderMeetupHubs();
  },

  updateCustomLocation(text) {
    this.customLocationText = text || '';
    this.updateLocationInput();
  },

  updateLocationInput() {
    const locInput = document.getElementById('cust-location');
    const meetupSummary = document.getElementById('bd-meetup-name');

    if (this.activeRegion === 'custom') {
      const customVal = this.customLocationText.trim() || 'Custom Lagos Delivery Address';
      if (locInput) locInput.value = customVal;
      if (meetupSummary) meetupSummary.textContent = customVal;
    } else {
      const hub = LAGOS_MEETUP_HUBS.find(h => h.id === this.selectedHubId) || LAGOS_MEETUP_HUBS[0];
      const val = `${hub.name} (${hub.area})`;
      if (locInput) locInput.value = val;
      if (meetupSummary) meetupSummary.textContent = hub.name;
    }
  },

  render() {
    const list = document.getElementById('cart-items-list');
    const countText = document.getElementById('cart-items-count-text');
    const baseTotal = document.getElementById('bd-base-total');
    const grandTotal = document.getElementById('cart-total-display');

    const items = LegendCart.getItems();
    const count = LegendCart.getCount();
    const grossTotal = LegendCart.getTotal();

    const tradeIn = window.LegendTradeIn ? LegendTradeIn.getTradeIn() : null;
    const tradeInCredit = tradeIn ? Number(tradeIn.estimatedValue || 0) : 0;
    const netTotal = Math.max(0, grossTotal - tradeInCredit);

    if (countText) countText.textContent = `${count} product${count === 1 ? '' : 's'}`;
    if (grandTotal) grandTotal.textContent = formatNaira(netTotal);
    if (baseTotal) baseTotal.textContent = formatNaira(grossTotal);

    const tradeinRow = document.getElementById('bd-tradein-row');
    const tradeinTotal = document.getElementById('bd-tradein-total');
    const tradeinLabel = document.getElementById('bd-tradein-label');
    const bannerTitle = document.getElementById('tradein-banner-title');
    const bannerDesc = document.getElementById('tradein-banner-desc');
    const bannerAction = document.getElementById('tradein-banner-action');

    if (tradeIn && tradeInCredit > 0) {
      if (tradeinRow) {
        tradeinRow.style.display = 'flex';
        if (tradeinLabel) tradeinLabel.textContent = `Trade-In: ${tradeIn.deviceName || 'Old Console'}`;
        if (tradeinTotal) tradeinTotal.textContent = `-${formatNaira(tradeInCredit)}`;
      }
      if (bannerTitle) bannerTitle.textContent = `Applied: ${tradeIn.deviceName} (${formatNaira(tradeInCredit)} credit)`;
      if (bannerDesc) bannerDesc.textContent = `Condition: ${tradeIn.condition || 'Good'}. This discount is automatically deducted from your quote.`;
      if (bannerAction) {
        bannerAction.innerHTML = `
          <button type="button" class="btn btn-secondary btn-sm" onclick="LegendTradeIn.clearTradeIn()" style="color:var(--accent-red); border-color:rgba(239,68,68,0.3);">Remove Credit</button>
        `;
      }
    } else {
      if (tradeinRow) tradeinRow.style.display = 'none';
      if (bannerTitle) bannerTitle.textContent = 'Have an old PS4 or Game Discs?';
      if (bannerDesc) bannerDesc.textContent = 'Calculate instant trade-in value and deduct up to ₦250,000 from your order.';
      if (bannerAction) {
        bannerAction.innerHTML = `
          <a href="../trade-in/trade-in.html" class="btn btn-secondary btn-sm">Estimate Trade-In →</a>
        `;
      }
    }

    if (!list) return;

    if (items.length === 0) {
      list.innerHTML = `
        <div class="card" style="text-align:center; padding:36px 20px;">
          <div style="font-size:2.5rem; margin-bottom:8px;">🛒</div>
          <h4 style="font-size:1.1rem; margin-bottom:4px;">Your request basket is empty</h4>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:16px;">Browse consoles, games, or accessories and add items to your request.</p>
          <a href="../home/home.html" class="btn btn-primary" style="display:inline-flex;">Browse Store</a>
        </div>
      `;
      return;
    }

    list.innerHTML = items.map(item => {
      const unitPrice = Number(item.totalPrice || item.price || 0);
      const qty = item.quantity || 1;

      return `
        <div class="cart-item-card clickable-card" onclick="CartController.editItem('${item.cartId}')" title="Click to edit and change games in studio">
          <div class="cart-item-top">
            <div>
              <div class="cart-item-title-row">
                <h4 class="cart-item-title">${item.title || item.name}</h4>
                <span class="edit-pill-tag">✏️ Edit in Studio →</span>
              </div>
              <span class="cart-item-sub">${item.variant ? `Variant: ${item.variant}` : (item.subtitle || '')}</span>
            </div>
            <button class="cart-item-del-btn" onclick="event.stopPropagation(); LegendCart.removeItem('${item.cartId}')" title="Remove item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
          <div class="cart-item-specs-grid">
            ${item.mode ? `<span class="spec-key">Firmware:</span><span class="spec-val">${item.mode === 'modded' ? 'Hacked / Modded' : 'Original Stock (Online)'}</span>` : ''}
            ${item.freeFC ? `<span class="spec-key">Bonus:</span><span class="spec-val" style="color:var(--accent-green);">EA Sports FC 26 (Included Free)</span>` : ''}
            ${item.physicalGames && item.physicalGames.length ? `<span class="spec-key">Discs:</span><span class="spec-val">${item.physicalGames.map(g => typeof g === 'string' ? g : g.title).join(', ')}</span>` : ''}
            ${item.installedGames && item.installedGames.length ? `<span class="spec-key">Installed:</span><span class="spec-val">${item.installedGames.map(g => typeof g === 'string' ? g : g.title).join(', ')}</span>` : ''}
            ${item.capacity ? `<span class="spec-key">Capacity:</span><span class="spec-val">${item.capacity}</span>` : ''}
            ${item.wrap ? `<span class="spec-key">Wrap:</span><span class="spec-val">${item.wrap}</span>` : ''}
            ${item.notes ? `<span class="spec-key">Notes:</span><span class="spec-val">${item.notes}</span>` : ''}
          </div>
          <div class="cart-item-bottom" onclick="event.stopPropagation()">
            <div class="qty-counter">
              <button class="qty-btn" onclick="LegendCart.updateQuantity('${item.cartId}', -1)">−</button>
              <span class="qty-num">${qty}</span>
              <button class="qty-btn" onclick="LegendCart.updateQuantity('${item.cartId}', 1)">+</button>
            </div>
            <div class="cart-item-price">${formatNaira(unitPrice * qty)}</div>
          </div>
        </div>
      `;
    }).join('');
  },

  editItem(cartId) {
    const items = LegendCart.getItems();
    const item = items.find(i => i.cartId === cartId);
    if (!item) return;

    try {
      sessionStorage.setItem('legend_edit_cart_item', JSON.stringify(item));
    } catch (e) {}

    if (item.type === 'console-config' || item.platform) {
      const plat = (item.platform || 'ps5').toLowerCase();
      window.location.href = `../consoles/${plat}/${plat}.html?edit=${encodeURIComponent(cartId)}`;
    } else if (item.type === 'disk' || item.type === 'hard-disk' || item.type === 'hard_drive' || item.capacity) {
      window.location.href = `../disk/disk.html?edit=${encodeURIComponent(cartId)}`;
    } else if (item.type === 'pc' || item.type === 'pc_game') {
      window.location.href = `../pc-games/pc-games.html`;
    } else if (item.type === 'game_disc' || item.type === 'game_modded') {
      window.location.href = `../discs-only/discs-only.html`;
    } else if (item.type === 'accessory') {
      window.location.href = `../accessories/accessories.html`;
    } else if (item.type === 'wrap') {
      window.location.href = `../wraps/wraps.html`;
    } else {
      window.location.href = `../home/home.html`;
    }
  },

  submitRequest() {
    const items = LegendCart.getItems();
    if (items.length === 0) {
      showToast('Please add items to your request first');
      return;
    }

    const name = document.getElementById('cust-name')?.value.trim();
    const phone = document.getElementById('cust-phone')?.value.trim();
    const location = document.getElementById('cust-location')?.value.trim();
    const notes = document.getElementById('cust-notes')?.value.trim();

    if (!name) {
      showToast('Please enter your full name');
      document.getElementById('cust-name')?.focus();
      return;
    }

    if (!phone) {
      showToast('Please enter your WhatsApp phone number');
      document.getElementById('cust-phone')?.focus();
      return;
    }

    const orderRef = LegendCart.generateOrderReference();
    const { text } = LegendCart.buildWhatsAppMessage({
      orderRef,
      name,
      phone,
      contactMethod: this.contactMethod,
      meetupArea: location,
      notes
    });

    this.lastSubmittedRef = orderRef;
    this.lastSubmittedMessage = text;

    try {
      const pastOrders = JSON.parse(localStorage.getItem('naijaplay_orders') || '[]');
      pastOrders.unshift({
        ref: orderRef,
        date: new Date().toISOString(),
        items: items,
        total: LegendCart.getNetTotal(),
        customer: { name, phone, location }
      });
      localStorage.setItem('naijaplay_orders', JSON.stringify(pastOrders.slice(0, 10)));
    } catch (e) {
      console.error(e);
    }

    openWhatsApp(text);
    this.showConfirmationView(orderRef, items);
  },

  showConfirmationView(orderRef, items) {
    document.getElementById('cart-active-view').style.display = 'none';
    const submittedView = document.getElementById('cart-submitted-view');
    submittedView.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    document.getElementById('success-ref-code').textContent = orderRef;
    document.getElementById('success-time-text').textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const summaryContainer = document.getElementById('submitted-items-summary');
    if (summaryContainer) {
      summaryContainer.innerHTML = `
        <div style="font-size:0.75rem; font-weight:700; color:var(--text-muted); margin-bottom:8px; text-transform:uppercase;">
          Requested Items (${items.length})
        </div>
        ${items.map(item => `
          <div style="display:flex; justify-content:space-between; font-size:0.84rem; margin-bottom:4px;">
            <span>${item.title || item.name} (x${item.quantity || 1})</span>
            <strong style="color:var(--accent-gold);">${formatNaira((item.totalPrice || item.price || 0) * (item.quantity || 1))}</strong>
          </div>
        `).join('')}
        <div style="border-top:1px solid var(--border-light); margin-top:8px; padding-top:6px; display:flex; justify-content:space-between; font-size:0.95rem; font-weight:800;">
          <span>Estimated Total</span>
          <span style="color:var(--accent-gold);">${formatNaira(LegendCart.getTotal())}</span>
        </div>
      `;
    }

    // Bind follow-up WhatsApp button
    const btn = document.getElementById('btn-followup-wa');
    if (btn) {
      btn.onclick = () => openWhatsApp(`Hi NaijaPlay, I submitted order ${orderRef}. Following up on availability and meetup.`);
    }

    // Clear cart
    LegendCart.clear();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  CartController.init();
});
