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

  // Inject Header (unless page has custom header or is on home)
  if (!document.querySelector('.app-header') && !document.querySelector('.g2a-main-header') && !document.querySelector('.legend-master-header') && !isHome) {
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
// 8. Universal Intelligent Game Search & Alias Engine
// -------------------------------------------------------------
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

const LegendSearch = {
  aliases: GAME_SEARCH_ALIASES,

  normalize(text) {
    if (!text) return '';
    return text
      .toLowerCase()
      .replace(/['’]/g, '')
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  },

  matchGame(game, query) {
    if (!query || !query.trim()) return true;
    const normQ = this.normalize(query);
    const compactQ = normQ.replace(/\s+/g, '');

    if (!normQ) return true;

    const normTitle = this.normalize(game.title);
    const compactTitle = normTitle.replace(/\s+/g, '');
    const normGenre = this.normalize(game.genre);
    const normDesc = this.normalize(game.description);
    const normBadge = this.normalize(game.badge);
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
    for (const [aliasKey, targetMatches] of Object.entries(this.aliases)) {
      const normAlias = this.normalize(aliasKey);
      const compactAlias = normAlias.replace(/\s+/g, '');

      if (normQ === normAlias || compactQ === compactAlias || normQ.startsWith(normAlias) || compactQ.startsWith(compactAlias)) {
        for (const target of targetMatches) {
          const normTarget = this.normalize(target);
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

    // 4. Token-level partial match (all query words must match somewhere)
    const queryTokens = normQ.split(' ').filter(t => t.length > 1);
    if (queryTokens.length > 1) {
      const fullText = `${normTitle} ${normGenre} ${normDesc} ${normBadge} ${gameId}`;
      const allFound = queryTokens.every(token => fullText.includes(token));
      if (allFound) return true;
    }

    return false;
  },

  matchText(text, query) {
    if (!query || !query.trim()) return true;
    return this.matchGame({ title: text, genre: '', description: '' }, query);
  }
};

window.LegendSearch = LegendSearch;
window.matchGameQuery = (game, query) => LegendSearch.matchGame(game, query);

// -------------------------------------------------------------
// Auto-initialize on load
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initAppNavigation();
  initFloatingWhatsApp();
});
