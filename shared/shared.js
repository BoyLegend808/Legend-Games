/**
 * Legend Games / NaijaPlay - Master Shared JavaScript Engine
 * Powers Cart, Wishlist, WhatsApp Payload Generator, Dynamic Navigation, and Theming.
 */

const LEGEND_CONFIG = {
  shopName: 'NaijaPlay / Legend Games',
  shopSub: 'Consoles & Games Lagos',
  whatsappNumber: '2348012345678', // Shop WhatsApp Business Number
  whatsappDisplay: '+234 801 234 5678',
  location: 'Lagos, Nigeria (Safe Public Meetup Handover)',
  cartStorageKey: 'naijaplay_cart_v4',
  wishlistStorageKey: 'naijaplay_wishlist_v4',
  themeStorageKey: 'naijaplay_theme_v4'
};

// -------------------------------------------------------------
// 1. Currency & Formatting
// -------------------------------------------------------------
function formatNaira(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₦0';
  return '₦' + Number(amount).toLocaleString('en-NG');
}

// -------------------------------------------------------------
// 2. Theme Management (Dark / Light Mode)
// -------------------------------------------------------------
const LegendTheme = {
  init() {
    const saved = localStorage.getItem(LEGEND_CONFIG.themeStorageKey) || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    if (document.body) {
      document.body.setAttribute('data-theme', saved);
    }
  },
  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    if (document.body) {
      document.body.setAttribute('data-theme', next);
    }
    localStorage.setItem(LEGEND_CONFIG.themeStorageKey, next);
    showToast(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} mode`);
  }
};
LegendTheme.init();

// -------------------------------------------------------------
// 3. Wishlist Management
// -------------------------------------------------------------
const LegendWishlist = {
  getItems() {
    try {
      const data = localStorage.getItem(LEGEND_CONFIG.wishlistStorageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },
  toggleItem(id, title) {
    let items = LegendWishlist.getItems();
    const index = items.indexOf(id);
    let isAdded = false;
    if (index > -1) {
      items.splice(index, 1);
      showToast(`Removed from saved items`);
    } else {
      items.push(id);
      isAdded = true;
      showToast(`Saved to your wishlist!`);
    }
    localStorage.setItem(LEGEND_CONFIG.wishlistStorageKey, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('legend-wishlist-updated', { detail: items }));
    
    // Update active state on any matching buttons on page
    document.querySelectorAll(`[data-wishlist-id="${id}"]`).forEach(btn => {
      btn.classList.toggle('active', isAdded);
    });
    return isAdded;
  },
  has(id) {
    return LegendWishlist.getItems().includes(id);
  }
};

// -------------------------------------------------------------
// 4. Cart / Unified Quote Request Engine
// -------------------------------------------------------------
const LegendCart = {
  getItems() {
    try {
      const data = localStorage.getItem(LEGEND_CONFIG.cartStorageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveItems(items) {
    try {
      localStorage.setItem(LEGEND_CONFIG.cartStorageKey, JSON.stringify(items));
      LegendCart.updateBadge();
      window.dispatchEvent(new CustomEvent('legend-cart-updated', { detail: items }));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  },

  addItem(item) {
    const items = LegendCart.getItems();
    if (!item.cartId) {
      item.cartId = 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    }
    if (!item.quantity) {
      item.quantity = 1;
    }
    items.push(item);
    LegendCart.saveItems(items);
    showToast(`Added "${item.title || item.name}" to request basket`);
    return item;
  },

  updateQuantity(cartId, delta) {
    let items = LegendCart.getItems();
    const target = items.find(i => i.cartId === cartId);
    if (target) {
      target.quantity = (target.quantity || 1) + delta;
      if (target.quantity <= 0) {
        items = items.filter(i => i.cartId !== cartId);
        showToast('Item removed from request');
      }
      LegendCart.saveItems(items);
    }
  },

  removeItem(cartId) {
    let items = LegendCart.getItems();
    items = items.filter(item => item.cartId !== cartId);
    LegendCart.saveItems(items);
    showToast('Item removed from request');
  },

  clear() {
    LegendCart.saveItems([]);
  },

  getCount() {
    const items = LegendCart.getItems();
    return items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  },

  getTotal() {
    const items = LegendCart.getItems();
    return items.reduce((sum, item) => {
      const unitPrice = Number(item.totalPrice || item.price || item.basePrice || 0);
      return sum + (unitPrice * (item.quantity || 1));
    }, 0);
  },

  updateBadge() {
    const count = LegendCart.getCount();
    const badges = document.querySelectorAll('#nav-cart-badge, #bottom-cart-badge, .header-badge, .nav-tab-badge');
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  },

  generateOrderReference() {
    const num = Math.floor(10000 + Math.random() * 90000);
    return `NG-REQ-${num}`;
  },

  buildWhatsAppMessage(customerData = {}) {
    const items = LegendCart.getItems();
    const ref = customerData.orderRef || LegendCart.generateOrderReference();
    const total = LegendCart.getTotal();

    let msg = `*🎮 NEW ORDER REQUEST — ${LEGEND_CONFIG.shopName}*\n`;
    msg += `*Reference:* \`${ref}\`\n`;
    msg += `*Date:* ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}\n`;
    msg += `------------------------------------\n`;

    if (items.length === 0) {
      msg += `(Empty cart inquiry)\n`;
    } else {
      items.forEach((item, idx) => {
        const qty = item.quantity || 1;
        const price = Number(item.totalPrice || item.price || 0);
        msg += `*${idx + 1}. ${item.title || item.name}* (x${qty})\n`;
        if (item.variant) msg += `   • Variant: ${item.variant}\n`;
        if (item.mode) msg += `   • Firmware: ${item.mode === 'modded' ? 'Hacked / Modded (Offline)' : 'Original / Stock (Online PSN)'}\n`;
        if (item.freeFC) msg += `   • Free Bonus: EA Sports FC 26 (Included)\n`;
        if (item.physicalGames && item.physicalGames.length) {
          msg += `   • Physical Discs: ${item.physicalGames.map(g => typeof g === 'string' ? g : g.title).join(', ')}\n`;
        }
        if (item.installedGames && item.installedGames.length) {
          msg += `   • Installed Games: ${item.installedGames.map(g => typeof g === 'string' ? g : g.title).join(', ')}\n`;
        }
        if (item.capacity) msg += `   • Disk Size: ${item.capacity}\n`;
        if (item.purpose) msg += `   • Disk Purpose: ${item.purpose.toUpperCase()}\n`;
        if (item.wrap) msg += `   • Wrap Skin: ${item.wrap}\n`;
        if (item.notes) msg += `   • Note: ${item.notes}\n`;
        msg += `   • Subtotal: ${formatNaira(price * qty)}\n\n`;
      });
    }

    msg += `------------------------------------\n`;
    msg += `*ESTIMATED TOTAL:* *${formatNaira(total)}*\n`;
    msg += `------------------------------------\n\n`;

    msg += `*Customer Details:*\n`;
    msg += `• *Name:* ${customerData.name || 'Not specified'}\n`;
    msg += `• *WhatsApp/Phone:* ${customerData.phone || 'Not specified'}\n`;
    msg += `• *Preferred Meetup:* ${customerData.meetupArea || 'Safe public location in Lagos'}\n`;
    if (customerData.notes) {
      msg += `• *Additional Notes:* ${customerData.notes}\n`;
    }

    msg += `\n_I understand prices and availability are verified on WhatsApp before our safe meetup handover._`;
    return { text: msg, orderRef: ref };
  }
};

// -------------------------------------------------------------
// 5. Toast Notifications
// -------------------------------------------------------------
function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 250);
  }, 2800);
}

// -------------------------------------------------------------
// 6. WhatsApp Direct Trigger
// -------------------------------------------------------------
function openWhatsApp(customMessage) {
  const text = customMessage || 'Hi NaijaPlay! I am looking for a console/game setup in Lagos.';
  const encoded = encodeURIComponent(text);
  window.open(`https://wa.me/${LEGEND_CONFIG.whatsappNumber}?text=${encoded}`, '_blank');
}

// -------------------------------------------------------------
// 7. Path Detection & App Navigation Injection
// -------------------------------------------------------------
function getRootPath() {
  const path = window.location.pathname.replace(/\\/g, '/');
  if (path.includes('/consoles/ps3/') || path.includes('/consoles/ps4/') || 
      path.includes('/consoles/ps5/') || path.includes('/consoles/xbox/')) {
    return '../../';
  }
  if (path.includes('/home/') || path.includes('/disk/') || path.includes('/discs-only/') ||
      path.includes('/accessories/') || path.includes('/pc-games/') || path.includes('/wraps/') ||
      path.includes('/request-form/') || path.includes('/how-it-works/') || path.includes('/faq/') ||
      path.includes('/price-list/') || path.includes('/cart/') || path.includes('/order-tracking/')) {
    return '../';
  }
  return './';
}

function initAppNavigation(options = {}) {
  const root = getRootPath();
  const path = window.location.pathname.replace(/\\/g, '/');
  const isHome = path.includes('/home/') || path.endsWith('/index.html') || path.endsWith('/Legend%20Games/');

  // Inject Header
  if (!document.querySelector('.app-header')) {
    const headerHtml = `
      <header class="app-header">
        <div class="site-container header-inner">
          <div class="header-left">
            ${!isHome ? `
              <button class="back-btn" onclick="history.back()" title="Go Back">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
            ` : ''}
            <div class="header-brand-wrap">
              <span class="header-brand-title">
                ${options.title || (isHome ? 'NaijaPlay' : 'Store')}
              </span>
              <span class="header-brand-sub">${options.subtitle || (isHome ? 'Consoles & Games' : 'Quote Request')}</span>
            </div>
          </div>

          <div class="header-right">
            <button class="header-icon-btn" title="Toggle Dark/Light Mode" onclick="LegendTheme.toggle()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            </button>
            <a href="${root}cart/cart.html" class="header-icon-btn" title="View Request Basket">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              <span class="header-badge" id="nav-cart-badge">0</span>
            </a>
          </div>
        </div>
      </header>
    `;
    document.body.insertAdjacentHTML('afterbegin', headerHtml);
  }

  // Inject Bottom Tab Bar
  if (!document.querySelector('.bottom-nav')) {
    const bottomNavHtml = `
      <nav class="bottom-nav">
        <div class="bottom-nav-inner">
          <a href="${root}home/home.html" class="nav-tab ${isHome ? 'active' : ''}" id="tab-home">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span>Home</span>
          </a>
          <a href="${root}consoles/ps5/ps5.html" class="nav-tab ${path.includes('/consoles/') ? 'active' : ''}" id="tab-consoles">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"></rect><path d="M6 12h4m-2-2v4m8-2h.01m3.99 0h.01"></path></svg>
            <span>Consoles</span>
          </a>
          <a href="${root}discs-only/discs-only.html" class="nav-tab ${path.includes('/discs-only/') || path.includes('/disk/') ? 'active' : ''}" id="tab-games">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
            <span>Games</span>
          </a>
          <a href="${root}accessories/accessories.html" class="nav-tab ${path.includes('/accessories/') ? 'active' : ''}" id="tab-accessories">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
            <span>Accessories</span>
          </a>
          <a href="${root}cart/cart.html" class="nav-tab ${path.includes('/cart/') || path.includes('/order-tracking/') ? 'active' : ''}" id="tab-cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            <span>Cart</span>
            <span class="nav-tab-badge" id="bottom-cart-badge">0</span>
          </a>
        </div>
      </nav>
    `;
    document.body.insertAdjacentHTML('beforeend', bottomNavHtml);
  }

  LegendCart.updateBadge();
}

// -------------------------------------------------------------
// 8. Floating WhatsApp Button
// -------------------------------------------------------------
function initFloatingWhatsApp() {
  if (document.getElementById('float-wa-btn')) return;

  const btn = document.createElement('button');
  btn.id = 'float-wa-btn';
  btn.title = 'Chat with us on WhatsApp';
  btn.setAttribute('aria-label', 'Chat with us on WhatsApp');
  btn.innerHTML = `
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
    <span class="float-wa-label">Chat</span>
  `;
  btn.onclick = () => openWhatsApp('Hi Legend Games! I saw your website and want to ask about console and game prices.');

  if (!document.getElementById('float-wa-style')) {
    const style = document.createElement('style');
    style.id = 'float-wa-style';
    style.textContent = `
      #float-wa-btn {
        position: fixed;
        bottom: calc(var(--nav-height-btm) + 16px);
        right: 18px;
        z-index: 9000;
        background: #25d366;
        color: #fff;
        border: none;
        border-radius: 50px;
        width: 52px;
        height: 52px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 18px rgba(37,211,102,0.45);
        cursor: pointer;
        transition: all 0.2s ease;
        overflow: hidden;
      }
      #float-wa-btn:hover {
        width: 106px;
        box-shadow: 0 6px 24px rgba(37,211,102,0.6);
        transform: translateY(-2px);
      }
      #float-wa-btn:hover .float-wa-label {
        max-width: 60px;
        opacity: 1;
        margin-left: 6px;
      }
      .float-wa-label {
        font-size: 0.8rem;
        font-weight: 800;
        max-width: 0;
        opacity: 0;
        overflow: hidden;
        transition: all 0.2s;
        white-space: nowrap;
      }
      @media (min-width: 768px) {
        #float-wa-btn {
          right: max(18px, calc(50vw - 384px + 18px));
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(btn);
}

// -------------------------------------------------------------
// Auto-initialize on load
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initAppNavigation();
  initFloatingWhatsApp();
});
