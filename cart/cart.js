/**
 * Unified Cart & Quote Controller
 */

const CartController = {
  contactMethod: 'whatsapp',
  lastSubmittedRef: null,
  lastSubmittedMessage: null,

  init() {
    this.render();
    window.addEventListener('legend-cart-updated', () => this.render());
  },

  setContactMethod(method) {
    this.contactMethod = method;
    document.getElementById('opt-whatsapp')?.classList.toggle('active', method === 'whatsapp');
    document.getElementById('opt-phone')?.classList.toggle('active', method === 'phone');
  },

  render() {
    const list = document.getElementById('cart-items-list');
    const countText = document.getElementById('cart-items-count-text');
    const baseTotal = document.getElementById('bd-base-total');
    const addonsTotal = document.getElementById('bd-addons-total');
    const grandTotal = document.getElementById('cart-total-display');

    const items = LegendCart.getItems();
    const count = LegendCart.getCount();
    const total = LegendCart.getTotal();

    if (countText) countText.textContent = `${count} product${count === 1 ? '' : 's'}`;
    if (grandTotal) grandTotal.textContent = formatNaira(total);
    if (baseTotal) baseTotal.textContent = formatNaira(total);

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
        <div class="cart-item-card">
          <div class="cart-item-top">
            <div>
              <h4 class="cart-item-title">${item.title || item.name}</h4>
              <span class="cart-item-sub">${item.variant ? `Variant: ${item.variant}` : (item.subtitle || '')}</span>
            </div>
            <button class="cart-item-del-btn" onclick="LegendCart.removeItem('${item.cartId}')" title="Remove item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>

          <!-- Itemized Details Specs -->
          <div class="cart-item-specs-grid">
            ${item.mode ? `<span class="spec-key">Firmware:</span><span class="spec-val">${item.mode === 'modded' ? 'Hacked / Modded' : 'Original Stock (Online)'}</span>` : ''}
            ${item.freeFC ? `<span class="spec-key">Bonus:</span><span class="spec-val" style="color:var(--accent-green);">EA Sports FC 26 (Included Free)</span>` : ''}
            ${item.physicalGames && item.physicalGames.length ? `<span class="spec-key">Discs:</span><span class="spec-val">${item.physicalGames.map(g => typeof g === 'string' ? g : g.title).join(', ')}</span>` : ''}
            ${item.installedGames && item.installedGames.length ? `<span class="spec-key">Installed:</span><span class="spec-val">${item.installedGames.map(g => typeof g === 'string' ? g : g.title).join(', ')}</span>` : ''}
            ${item.capacity ? `<span class="spec-key">Capacity:</span><span class="spec-val">${item.capacity}</span>` : ''}
            ${item.wrap ? `<span class="spec-key">Wrap:</span><span class="spec-val">${item.wrap}</span>` : ''}
            ${item.customGameRequest ? `<span class="spec-key">Requested:</span><span class="spec-val">${item.customGameRequest}</span>` : ''}
            ${item.notes ? `<span class="spec-key">Notes:</span><span class="spec-val">${item.notes}</span>` : ''}
          </div>

          <div class="cart-item-bottom">
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

    // Save order reference in localStorage for tracking
    try {
      const pastOrders = JSON.parse(localStorage.getItem('naijaplay_orders') || '[]');
      pastOrders.unshift({
        ref: orderRef,
        date: new Date().toISOString(),
        items: items,
        total: LegendCart.getTotal(),
        customer: { name, phone, location }
      });
      localStorage.setItem('naijaplay_orders', JSON.stringify(pastOrders.slice(0, 10)));
    } catch (e) {
      console.error(e);
    }

    // Open WhatsApp
    openWhatsApp(text);

    // Show Confirmation Screen (Screen 6)
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
        <div style="font-size:0.78rem; font-weight:700; color:var(--text-muted); margin-bottom:8px; text-transform:uppercase;">
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
