/**
 * Legend Games — Master Admin Command Center Controller
 * Impeccable Design System • High-Octane Operations Engine
 */

const STORE_COVERS_LIBRARY = [
  'a-way-out.jpg', 'ac-mirage.jpg', 'ac-valhalla.jpg', 'alan-wake-remastered.jpg',
  'batman-arkham-knight.jpg', 'batman-telltale-series.jpg', 'battlefield-1.jpg', 'battlefield-v.jpg',
  'black-myth-wukong.jpg', 'bloodborne.jpg', 'captain-tsubasa.jpg', 'cod-bo3.jpg',
  'cod-cold-war.jpg', 'cod-mw2.jpg', 'cod-vanguard.jpg', 'cod-wwii.jpg',
  'control.jpg', 'crash-4.jpg', 'crash-bandicoot-n-sane-trilogy.jpg', 'ctr-nitro-fueled.jpg',
  'cyberpunk-2077.jpg', 'days-gone.jpg', 'dbz-kakarot.jpg', 'dead-island-2.jpg',
  'dead-space-remake.jpg', 'death-stranding.jpg', 'demon-slayer.jpg', 'dirt-5.jpg',
  'dirt-rally-2.jpg', 'dishonored-2.jpg', 'dmc-5.jpg', 'doom-eternal.jpg',
  'dragon-ball-sparking-zero.jpg', 'dying-light-2.jpg', 'ea-sports-fc-26.jpg', 'elden-ring.jpg',
  'far-cry-5.jpg', 'far-cry-6.jpg', 'far-cry-primal.jpg', 'fifa-23.jpg',
  'final-fantasy-7-remake.jpg', 'ghost-of-tsushima.jpg', 'god-of-war-2018.jpg', 'gow-3-remastered.jpg',
  'gow-ragnarok.jpg', 'gran-turismo-7.jpg', 'gta-trilogy.jpg', 'gta-v.jpg',
  'hitman-3.jpg', 'hogwarts-legacy.jpg', 'horizon-forbidden-west.jpg', 'horizon-zero-dawn.jpg',
  'hot-wheels-unleashed.jpg', 'infamous-second-son.jpg', 'injustice-2.jpg', 'it-takes-two.jpg',
  'jurassic-world-evolution.jpg', 'just-cause-4.jpg', 'kena-bridge-of-spirits.jpg', 'kof-xv.jpg',
  'lego-incredibles.jpg', 'lego-marvel-collection.jpg', 'lies-of-p.jpg', 'like-a-dragon-infinite-wealth.jpg',
  'mafia-3.jpg', 'metal-gear-solid-v.jpg', 'metal-slug-tactics.jpg', 'minecraft.jpg',
  'monster-hunter-world.jpg', 'mortal-kombat-11.jpg', 'motogp-19.jpg', 'motogp-24.jpg',
  'naruto-storm-4.jpg', 'naruto-storm-connections.jpg', 'nfs-heat.jpg', 'nfs-payback.jpg',
  'nfs-unbound.jpg', 'nioh-2.jpg', 'one-piece-pw4.jpg', 'overcooked-2.jpg',
  'persona-5-royal.jpg', 'pes-2021.jpg', 'ratchet-and-clank.jpg', 'rdr2.jpg',
  're2-remake.jpg', 're3-remake.jpg', 're4-remake.jpg', 're6.jpg',
  're7-biohazard.jpg', 're8-village.jpg', 'rise-of-the-tomb-raider.jpg', 'sekiro.jpg',
  'shadow-tomb-raider.jpg', 'sifu.jpg', 'sleeping-dogs.jpg', 'sniper-elite-4.jpg',
  'sniper-elite-5.jpg', 'spiderman-miles-morales.jpg', 'spiderman-ps4.jpg', 'spongebob-cosmic-shake.jpg',
  'spyro-reignited-trilogy.jpg', 'star-wars-battlefront-2.jpg', 'star-wars-jedi-fallen-order.jpg', 'star-wars-jedi-survivor.jpg',
  'stray.jpg', 'street-fighter-6.jpg', 'team-sonic-racing.jpg', 'tekken-7.jpg',
  'tekken-8.jpg', 'tennis-world-tour.jpg', 'the-callisto-protocol.jpg', 'the-crew-motorfest.jpg',
  'tlou-1.jpg', 'tlou-2.jpg', 'ufc-4.jpg', 'ufc-5.jpg',
  'uncharted-4.jpg', 'uncharted-nathan-drake-collection.jpg', 'until-dawn.jpg', 'upin-ipin-universe.jpg',
  'watch-dogs-2.jpg', 'watch-dogs-legion.jpg', 'witcher-3.jpg', 'wolfenstein-2.jpg',
  'wwe-2k23.jpg', 'wwe-2k24.jpg'
];

const DEFAULT_HUBS = [
  { id: 'icm', name: 'Ikeja City Mall (ICM)', area: 'Alausa, Ikeja', hours: '10:00 AM - 7:00 PM', active: true, desc: 'Central food court or cinema lobby' },
  { id: 'maryland', name: 'Maryland Mall (Big Black Box)', area: 'Ikorodu Road, Maryland', hours: '10:00 AM - 7:30 PM', active: true, desc: 'Ground floor atrium & safe parking' },
  { id: 'circle_mall', name: 'Circle Mall (Jakande)', area: 'Lekki Phase 1 / Osapa', hours: '10:00 AM - 8:00 PM', active: true, desc: 'Anchor plaza & safe public parking' },
  { id: 'the_palms', name: 'The Palms Shopping Mall', area: 'BIS Way, Victoria Island', hours: '10:00 AM - 8:00 PM', active: true, desc: 'Cinema foyer & central concourse' },
  { id: 'novare', name: 'Novare Mall', area: 'Sangotedo, Ajah', hours: '10:00 AM - 7:00 PM', active: true, desc: 'Genesis cinema area & main entrance' }
];

const DEFAULT_DRIVES = [
  { id: 'hdd-500', name: '500GB External HDD', capacity: '500GB', gamesEst: 15, price: 25000, desc: 'Pre-loaded ~10-15 top PS4/PC games', stock: 'in' },
  { id: 'hdd-1tb', name: '1TB High-Speed External HDD', capacity: '1TB', gamesEst: 30, price: 35000, desc: 'Pre-loaded ~25-30 blockbuster games', stock: 'in' },
  { id: 'hdd-2tb', name: '2TB Mega Gaming Storage Drive', capacity: '2TB', gamesEst: 60, price: 60000, desc: 'Pre-loaded ~50-60 games + updates', stock: 'in' },
  { id: 'hdd-4tb', name: '4TB Pro Archive External HDD', capacity: '4TB', gamesEst: 120, price: 110000, desc: 'Ultimate library ~100-120 games', stock: 'in' }
];

const AdminApp = {
  currentTab: 'overview',
  supabase: null,
  isOnline: false,

  // In-Memory & Local Catalogs
  games: [],
  consoles: [],
  drives: [],
  accessories: [],
  wraps: [],
  orders: [],
  tradeins: [],
  services: [],
  hubs: [],
  activities: [],

  // Pending Confirm Action Callback
  pendingConfirmCallback: null,

  // ── 1. INITIALIZATION & AUTH ──
  init() {
    this.checkAuth();
    this.initSupabaseClient();
    this.loadLocalData();
    this.bindEvents();
    this.renderAll();
    this.pingDatabase();
    this.listenToRealtimeOrders();
  },

  checkAuth() {
    const isAuth = sessionStorage.getItem('legend_admin_auth') === 'true' || localStorage.getItem('legend_admin_auth') === 'true';
    if (!isAuth) {
      window.location.href = 'login.html';
      return;
    }

    const userName = sessionStorage.getItem('legend_admin_user') || 'Shop Admin';
    const userRole = sessionStorage.getItem('legend_admin_role') || 'Operations Lead';
    document.getElementById('admin-user-name').textContent = userName;
    document.getElementById('admin-user-role').textContent = userRole;
    document.getElementById('admin-avatar').textContent = userName.slice(0, 2).toUpperCase();
  },

  logout() {
    sessionStorage.removeItem('legend_admin_auth');
    sessionStorage.removeItem('legend_admin_user');
    sessionStorage.removeItem('legend_admin_role');
    localStorage.removeItem('legend_admin_auth');
    this.showToast('Session terminated. Goodbye!', 'success');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 400);
  },

  initSupabaseClient() {
    if (window.LegendSupabase && typeof window.LegendSupabase.getClient === 'function') {
      this.supabase = window.LegendSupabase.getClient();
    }
  },

  loadLocalData() {
    // 1. Games Catalog
    const storedGames = localStorage.getItem('legend_admin_games');
    if (storedGames) {
      this.games = JSON.parse(storedGames);
    } else if (window.GAMES_CATALOG && Array.isArray(window.GAMES_CATALOG)) {
      this.games = window.GAMES_CATALOG.map(g => ({
        id: g.id,
        title: g.title,
        genre: g.genre || 'Action',
        rating: g.rating || 9.0,
        releaseYear: g.releaseYear || 2023,
        badge: g.badge || '',
        platforms: Array.isArray(g.platforms) ? g.platforms : ['PS4'],
        ps4Size: g.ps4Size || 45,
        pcSize: g.pcSize || 50,
        cdPrice: g.cdPrice || 18000,
        onlinePrice: g.onlinePrice || 5000,
        moddedPrice: g.moddedPrice || 2000,
        coverPath: g.coverPath || '../shared/assets/covers/ea-sports-fc-26.jpg',
        description: g.description || '',
        stock: 'in'
      }));
      this.saveLocal('legend_admin_games', this.games);
    }

    // 2. Consoles
    const storedConsoles = localStorage.getItem('legend_admin_consoles');
    if (storedConsoles) {
      this.consoles = JSON.parse(storedConsoles);
    } else if (window.CONSOLES_DATA) {
      const list = [];
      Object.entries(window.CONSOLES_DATA).forEach(([familyKey, family]) => {
        if (family.variants && Array.isArray(family.variants)) {
          family.variants.forEach(v => {
            list.push({
              id: v.id || (familyKey + '-' + v.storage.toLowerCase().replace(/\s+/g, '-')),
              family: familyKey,
              variantName: `${family.name} (${v.name || v.storage})`,
              storage: v.storage || '1TB',
              basePrice: v.basePrice || 450000,
              specBlurb: v.specBlurb || 'Complete unit with accessories',
              hasFcBundle: true,
              hasModdedOption: true,
              stock: 'in'
            });
          });
        }
      });
      this.consoles = list;
      this.saveLocal('legend_admin_consoles', this.consoles);
    }

    // 3. Drives
    const storedDrives = localStorage.getItem('legend_admin_drives');
    this.drives = storedDrives ? JSON.parse(storedDrives) : DEFAULT_DRIVES;

    // 4. Accessories
    const storedAcc = localStorage.getItem('legend_admin_accessories');
    if (storedAcc) {
      this.accessories = JSON.parse(storedAcc);
    } else if (window.ACCESSORIES_DATA && Array.isArray(window.ACCESSORIES_DATA)) {
      this.accessories = window.ACCESSORIES_DATA.map(a => ({
        id: a.id,
        name: a.name,
        category: a.category || 'Gear',
        price: a.price || 25000,
        compatibility: a.compatibility || 'PS5 / PS4',
        stock: a.stockStatus === 'In Stock' ? 'in' : (a.stockStatus === 'Low Stock' ? 'low' : 'out')
      }));
      this.saveLocal('legend_admin_accessories', this.accessories);
    }

    // 5. Wraps
    const storedWraps = localStorage.getItem('legend_admin_wraps');
    if (storedWraps) {
      this.wraps = JSON.parse(storedWraps);
    } else if (window.WRAPS_DATA && Array.isArray(window.WRAPS_DATA)) {
      this.wraps = window.WRAPS_DATA.map(w => ({
        id: w.id,
        name: w.name,
        compatible: w.compatible || 'PS5 Disc / Digital',
        price: w.price || 12000,
        stock: 'in'
      }));
      this.saveLocal('legend_admin_wraps', this.wraps);
    }

    // 6. Hubs
    const storedHubs = localStorage.getItem('legend_admin_hubs');
    this.hubs = storedHubs ? JSON.parse(storedHubs) : DEFAULT_HUBS;

    // 7. Orders
    const storedOrders = localStorage.getItem('naijaplay_orders');
    this.orders = storedOrders ? JSON.parse(storedOrders) : [];

    // 8. Trade-Ins
    const storedTradeins = localStorage.getItem('legend_admin_tradeins');
    this.tradeins = storedTradeins ? JSON.parse(storedTradeins) : [];

    // 9. Services
    const storedServices = localStorage.getItem('legend_admin_services');
    this.services = storedServices ? JSON.parse(storedServices) : [];

    // 10. Activities
    const storedAct = localStorage.getItem('legend_admin_activities');
    this.activities = storedAct ? JSON.parse(storedAct) : [
      { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: 'Admin Operations Command Center initialized.' }
    ];
  },

  saveLocal(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.warn('[Admin] LocalStorage quota exceeded or disabled:', e);
    }
  },

  logActivity(text) {
    const item = {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text
    };
    this.activities.unshift(item);
    if (this.activities.length > 30) this.activities.pop();
    this.saveLocal('legend_admin_activities', this.activities);
    this.renderActivities();
  },

  showToast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `admin-toast ${type}`;
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        ${type === 'success' ? '<polyline points="20 6 9 17 4 12"/>' : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'}
      </svg>
      <span>${msg}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 200);
    }, 2800);
  },

  formatNaira(val) {
    const num = Number(val) || 0;
    return '₦' + num.toLocaleString('en-NG');
  },

  // ── 2. SUPABASE INTEGRATION & REALTIME ──
  async pingDatabase() {
    const dot = document.getElementById('db-status-dot');
    const txt = document.getElementById('db-status-text');
    const diagState = document.getElementById('diag-conn-state');
    const diagPing = document.getElementById('diag-conn-ping');
    const diagRemoteGames = document.getElementById('diag-remote-games');
    const diagRemoteOrders = document.getElementById('diag-remote-orders');

    if (!this.supabase) {
      dot.className = 'status-dot offline';
      txt.textContent = 'Supabase Offline';
      if (diagState) diagState.textContent = 'Disconnected';
      return;
    }

    const start = performance.now();
    try {
      const { data, count, error } = await this.supabase
        .from('games')
        .select('id', { count: 'exact', head: true });

      const duration = Math.round(performance.now() - start);

      if (error && error.code !== 'PGRST116') {
        dot.className = 'status-dot offline';
        txt.textContent = 'Supabase Error';
        if (diagState) diagState.textContent = 'Auth/Table Pending';
        if (diagPing) diagPing.textContent = `Latency: ${duration}ms (${error.message})`;
      } else {
        this.isOnline = true;
        dot.className = 'status-dot';
        txt.textContent = `Supabase Live (${duration}ms)`;
        if (diagState) diagState.textContent = 'Online & Active';
        if (diagPing) diagPing.textContent = `Latency: ${duration}ms (Optimal)`;
        if (diagRemoteGames) diagRemoteGames.textContent = count !== null ? count : 'Ready';

        // Also check remote orders count
        const ordersRes = await this.supabase.from('orders').select('order_id', { count: 'exact', head: true });
        if (diagRemoteOrders && ordersRes.count !== null) {
          diagRemoteOrders.textContent = ordersRes.count;
        }
      }
    } catch (e) {
      dot.className = 'status-dot offline';
      txt.textContent = 'Supabase Offline';
      if (diagState) diagState.textContent = 'Unreachable';
    }
  },

  listenToRealtimeOrders() {
    if (!this.supabase) return;
    try {
      this.supabase
        .channel('admin-orders-stream')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, payload => {
          this.showToast(`🔔 New Live Order: ${payload.new.order_id || 'Quote'} received!`, 'success');
          this.orders.unshift({
            ref: payload.new.order_id,
            date: payload.new.created_at || new Date().toISOString(),
            items: payload.new.items_json || [],
            total: payload.new.total_price || 0,
            status: payload.new.status || 'Pending WhatsApp Confirmation',
            customer: {
              name: payload.new.customer_name,
              phone: payload.new.whatsapp_number,
              location: payload.new.meetup_location
            }
          });
          this.saveLocal('naijaplay_orders', this.orders);
          this.renderOrders();
          this.renderOverview();
        })
        .subscribe();
    } catch (e) {
      console.warn('[Admin] Realtime subscription skipped:', e);
    }
  },

  async refreshOrdersFromSupabase() {
    if (!this.supabase) {
      this.showToast('Supabase client not connected', 'error');
      return;
    }
    this.showToast('Fetching orders from Supabase...', 'success');
    try {
      const { data, error } = await this.supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length) {
        this.orders = data.map(o => ({
          ref: o.order_id,
          date: o.created_at,
          items: typeof o.items_json === 'string' ? JSON.parse(o.items_json) : (o.items_json || []),
          total: o.total_price,
          status: o.status || 'Pending WhatsApp Confirmation',
          customer: {
            name: o.customer_name,
            phone: o.whatsapp_number,
            location: o.meetup_location
          }
        }));
        this.saveLocal('naijaplay_orders', this.orders);
        this.renderOrders();
        this.renderOverview();
        this.showToast(`Loaded ${data.length} orders from Supabase!`, 'success');
      } else {
        this.showToast('No remote orders found in Supabase table.', 'success');
      }
    } catch (err) {
      this.showToast(err.message || 'Error fetching orders', 'error');
    }
  },

  async pushLocalCatalogToSupabase() {
    if (!this.supabase) {
      this.showToast('Supabase not connected', 'error');
      return;
    }
    this.showToast('Uploading catalog to Supabase Postgres...', 'success');
    let successCount = 0;

    for (const g of this.games) {
      try {
        const { error } = await this.supabase.from('games').upsert({
          id: g.id,
          title: g.title,
          genre: g.genre,
          rating: g.rating,
          release_year: g.releaseYear,
          badge: g.badge,
          ps4_size_gb: g.ps4Size,
          pc_size_gb: g.pcSize,
          cd_price: g.cdPrice,
          online_price: g.onlinePrice,
          modded_price: g.moddedPrice,
          cover_path: g.coverPath,
          description: g.description
        });
        if (!error) successCount++;
      } catch (e) {
        console.warn('Game sync error:', g.id, e);
      }
    }

    this.showToast(`Pushed ${successCount} games to Supabase!`, 'success');
    this.logActivity(`Synchronized ${successCount} games to Supabase Postgres.`);
  },

  async pullSupabaseCatalogToLocal() {
    if (!this.supabase) {
      this.showToast('Supabase not connected', 'error');
      return;
    }
    this.showToast('Pulling games from Supabase...', 'success');
    try {
      const { data, error } = await this.supabase.from('games').select('*');
      if (error) throw error;
      if (data && data.length) {
        this.games = data.map(g => ({
          id: g.id,
          title: g.title,
          genre: g.genre,
          rating: g.rating,
          releaseYear: g.release_year,
          badge: g.badge,
          platforms: ['PS4', 'PS5'],
          ps4Size: g.ps4_size_gb,
          pcSize: g.pc_size_gb,
          cdPrice: g.cd_price,
          onlinePrice: g.online_price,
          moddedPrice: g.modded_price,
          coverPath: g.cover_path,
          description: g.description,
          stock: 'in'
        }));
        this.saveLocal('legend_admin_games', this.games);
        this.renderGames();
        this.renderOverview();
        this.showToast(`Pulled ${data.length} games from Supabase into local state!`, 'success');
        this.logActivity(`Pulled ${data.length} games from live database.`);
      }
    } catch (e) {
      this.showToast(e.message || 'Pull failed', 'error');
    }
  },

  exportCatalogJSON() {
    const payload = {
      exportDate: new Date().toISOString(),
      store: 'Legend Games Command Center',
      games: this.games,
      consoles: this.consoles,
      drives: this.drives,
      accessories: this.accessories,
      wraps: this.wraps,
      orders: this.orders
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legend_games_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('Complete catalog exported as JSON backup!', 'success');
    this.logActivity('Exported complete store catalog backup as JSON.');
  },

  copySupabaseMigrationSQL() {
    const sql = `-- Legend Games / NaijaPlay Supabase Master Migration
CREATE TABLE IF NOT EXISTS public.games (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    genre TEXT NOT NULL,
    rating NUMERIC(3, 1) DEFAULT 9.0,
    release_year INTEGER DEFAULT 2024,
    badge TEXT,
    ps4_size_gb INTEGER DEFAULT 0,
    pc_size_gb INTEGER DEFAULT 0,
    cd_price NUMERIC(10, 2) NOT NULL DEFAULT 18000.00,
    online_price NUMERIC(10, 2) NOT NULL DEFAULT 5000.00,
    modded_price NUMERIC(10, 2) NOT NULL DEFAULT 2000.00,
    cover_path TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
    order_id TEXT PRIMARY KEY,
    customer_name TEXT,
    whatsapp_number TEXT NOT NULL,
    meetup_location TEXT,
    items_json JSONB NOT NULL,
    total_price NUMERIC(12, 2) NOT NULL,
    status TEXT DEFAULT 'Pending WhatsApp Confirmation',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public games read" ON public.games FOR SELECT USING (true);
CREATE POLICY "Public orders create" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public orders view" ON public.orders FOR SELECT USING (true);`;

    navigator.clipboard.writeText(sql).then(() => {
      this.showToast('Master Supabase SQL copied to clipboard!', 'success');
    }).catch(() => {
      this.showToast('Failed to copy. Please allow clipboard permissions.', 'error');
    });
  },

  // ── 3. NAVIGATION & VIEW SWITCHING ──
  switchTab(tabId) {
    this.currentTab = tabId;

    // Update active button
    document.querySelectorAll('.sidebar-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // Update view panels
    document.querySelectorAll('.admin-tab-view').forEach(view => {
      view.classList.toggle('active', view.id === `view-${tabId}`);
    });

    // Close mobile sidebar if open
    document.getElementById('admin-sidebar')?.classList.remove('open');

    // Title / Description mapping
    const titleMap = {
      'overview': ['Overview & KPIs', 'Store telemetry, inventory counts, and pending customer requests'],
      'games': ['Games Catalog Management', 'Add, edit, remove, and calibrate pricing across all disc & digital titles'],
      'consoles': ['Consoles & Hardware', 'Manage PS5, PS4, Xbox console variants, FC bundle inclusions, and storage'],
      'drives': ['External Hard Drives', 'Pre-loaded external storage drive packages and capacity pricing'],
      'accessories': ['Gaming Accessories & Gear', 'Controllers, headsets, charging docks, and replacement cables'],
      'wraps': ['Console Wraps & Skins', 'Custom vinyl skins for PS5, PS4, and Xbox controllers and consoles'],
      'batch-pricing': ['Batch Price Recalibrator', 'Mass percentage and fixed Naira price adjustments for FX / inflation shifts'],
      'broadcast': ['WhatsApp Broadcast Composer', 'Compose and preview formatted marketing broadcasts for customer groups'],
      'hubs': ['Lagos Meetup Hubs', 'Safe public handover inspection locations and pickup operating hours'],
      'orders': ['Live Orders & Quote Pipeline', 'Real-time order requests with 1-click WhatsApp customer contact'],
      'tradeins': ['Trade-In Valuations Queue', 'Incoming console trade-in requests, valuations, and counter-offers'],
      'services': ['Repairs & Services Desk', 'Customer console repair tickets, HDMI repairs, and jailbreak installs'],
      'customers': ['Customer Phone Directory', 'Customer contact records, order history, and preferred meetup points'],
      'database': ['Supabase Diagnostic Center', 'Live Postgres status, latency benchmarks, and catalog sync utilities'],
      'activity': ['Real-Time Audit Trail', 'Chronological log of administrative changes and updates']
    };

    const info = titleMap[tabId] || ['Command Center', 'Administrative suite'];
    document.getElementById('page-current-title').textContent = info[0];
    document.getElementById('page-current-desc').textContent = info[1];

    if (tabId === 'batch-pricing') this.updateBatchPreview();
    if (tabId === 'broadcast') this.updateBroadcastPreview();
  },

  toggleMobileSidebar() {
    document.getElementById('admin-sidebar')?.classList.toggle('open');
  },

  // ── 4. RENDERERS ──
  renderAll() {
    this.renderOverview();
    this.renderGames();
    this.renderConsoles();
    this.renderDrives();
    this.renderAccessories();
    this.renderWraps();
    this.renderHubs();
    this.renderOrders();
    this.renderTradeins();
    this.renderServices();
    this.renderCustomers();
    this.renderActivities();
    this.populateGalleryModal();
    this.loadBroadcastTemplate('weekend-flash');
  },

  renderOverview() {
    document.getElementById('stat-total-games').textContent = this.games.length;
    document.getElementById('stat-total-consoles').textContent = this.consoles.length;
    document.getElementById('stat-total-orders').textContent = this.orders.length;

    const pendingCount = this.orders.filter(o => !o.status || o.status.includes('Pending')).length;
    document.getElementById('stat-pending-orders-sub').textContent = `${pendingCount} Pending Confirmation`;
    document.getElementById('overview-orders-badge').textContent = `${pendingCount} Pending`;

    const totalPipeline = this.orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    document.getElementById('stat-pipeline-value').textContent = this.formatNaira(totalPipeline);

    // Update nav counters
    document.getElementById('badge-games-count').textContent = this.games.length;
    document.getElementById('badge-consoles-count').textContent = this.consoles.length;
    document.getElementById('badge-accessories-count').textContent = this.accessories.length;
    document.getElementById('badge-wraps-count').textContent = this.wraps.length;
    document.getElementById('badge-orders-count').textContent = pendingCount;
    document.getElementById('badge-tradeins-count').textContent = this.tradeins.length;
    document.getElementById('badge-services-count').textContent = this.services.length;

    // Overview recent orders table
    const tbody = document.getElementById('overview-orders-tbody');
    if (!tbody) return;

    if (!this.orders.length) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #7c889b; padding: 24px;">No incoming orders yet. Place a test order from the cart!</td></tr>`;
      return;
    }

    tbody.innerHTML = this.orders.slice(0, 5).map(o => {
      const itemCount = (o.items && Array.isArray(o.items)) ? o.items.length : 1;
      const custName = o.customer?.name || 'Customer';
      const custPhone = o.customer?.phone || 'No phone';
      const hub = o.customer?.location || 'Lagos Hub';
      const statusClass = o.status?.includes('Completed') ? 'in-stock' : (o.status?.includes('Scheduled') ? 'low-stock' : 'out-stock');

      return `
        <tr>
          <td><strong style="color: #ccff00; font-family: 'Chakra Petch';">${o.ref || 'LG-ORDER'}</strong></td>
          <td><span class="product-title-bold">${custName}</span></td>
          <td><span style="font-family: 'Chakra Petch';">${custPhone}</span></td>
          <td><span style="color: #00e5ff; font-size: 0.8rem;">${hub}</span></td>
          <td><span>${itemCount} item(s)</span></td>
          <td><strong style="color: #ffd600;">${this.formatNaira(o.total)}</strong></td>
          <td><span class="stock-toggle-btn ${statusClass}">${o.status || 'Pending'}</span></td>
          <td>
            <button class="btn-table-icon" title="Chat on WhatsApp" onclick="AdminApp.chatCustomerWhatsApp('${custPhone}', '${custName}', '${o.ref}')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#25d366" stroke-width="2"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  // ── 5. GAMES CATALOG CRUD ──
  renderGames() {
    const tbody = document.getElementById('games-tbody');
    const totalPill = document.getElementById('games-total-pill');
    if (!tbody) return;

    const query = (document.getElementById('games-search-input')?.value || '').toLowerCase().trim();
    const platFilter = document.getElementById('games-platform-filter')?.value || 'all';
    const stockFilter = document.getElementById('games-stock-filter')?.value || 'all';

    let filtered = this.games.filter(g => {
      const matchQuery = !query || g.title.toLowerCase().includes(query) || g.genre.toLowerCase().includes(query);
      const matchPlat = platFilter === 'all' || (g.platforms && g.platforms.includes(platFilter));
      const matchStock = stockFilter === 'all' || (g.stock || 'in') === stockFilter;
      return matchQuery && matchPlat && matchStock;
    });

    if (totalPill) totalPill.textContent = `${filtered.length} of ${this.games.length} Titles`;

    if (!filtered.length) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #7c889b; padding: 32px;">No games match your search criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(g => {
      const stockState = g.stock || 'in';
      const stockLabel = stockState === 'in' ? 'In Stock' : (stockState === 'low' ? 'Low Stock' : 'Out of Stock');
      const platformsHtml = (g.platforms || ['PS4']).map(p => `<span class="platform-tag">${p}</span>`).join('');

      return `
        <tr>
          <td>
            <div class="table-product-cell">
              <img src="${g.coverPath}" alt="${g.title}" class="table-cover-thumb" onerror="this.src='../shared/assets/covers/ea-sports-fc-26.jpg'">
              <div>
                <span class="product-title-bold">${g.title}</span>
                <span class="product-sub-meta">
                  ${g.badge ? `<span style="color:#ccff00; font-weight:700;">★ ${g.badge}</span> · ` : ''}
                  Rating: ${g.rating || 9.0} / 10
                </span>
              </div>
            </div>
          </td>
          <td>
            <span style="font-size: 0.82rem; color: #fff;">${g.genre}</span>
            <div style="font-size: 0.72rem; color: #7c889b;">Year: ${g.releaseYear || 2023}</div>
          </td>
          <td>
            <div class="platform-chips-wrap">${platformsHtml}</div>
          </td>
          <td>
            <span style="font-family: 'Chakra Petch'; font-size: 0.82rem;">${g.ps4Size || 45} GB</span>
          </td>
          <td>
            <strong style="color: #ffd600;">${this.formatNaira(g.cdPrice)}</strong>
          </td>
          <td>
            <strong style="color: #00ff66;">${this.formatNaira(g.moddedPrice)}</strong>
          </td>
          <td>
            <button class="stock-toggle-btn ${stockState === 'in' ? 'in-stock' : (stockState === 'low' ? 'low-stock' : 'out-stock')}"
              onclick="AdminApp.toggleGameStock('${g.id}')" title="Click to change stock status">
              ● ${stockLabel}
            </button>
          </td>
          <td style="text-align: right;">
            <div class="table-action-group" style="justify-content: flex-end;">
              <button class="btn-table-icon" title="Edit Game" onclick="AdminApp.openEditGameModal('${g.id}')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </button>
              <button class="btn-table-icon delete" title="Remove Game" onclick="AdminApp.confirmDeleteGame('${g.id}')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  filterGames() {
    this.renderGames();
  },

  toggleGameStock(id) {
    const g = this.games.find(item => item.id === id);
    if (!g) return;
    const states = ['in', 'low', 'out'];
    const next = states[(states.indexOf(g.stock || 'in') + 1) % states.length];
    g.stock = next;
    this.saveLocal('legend_admin_games', this.games);
    this.renderGames();
    this.showToast(`Stock updated for ${g.title}: ${next.toUpperCase()}`);
    this.logActivity(`Changed stock status of "${g.title}" to ${next}.`);
  },

  openAddGameModal() {
    document.getElementById('game-form-mode').value = 'add';
    document.getElementById('game-id-hidden').value = '';
    document.getElementById('game-drawer-title').innerHTML = `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ccff00" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/></svg>
      Add Game to Catalog
    `;

    document.getElementById('game-title').value = '';
    document.getElementById('game-genre').value = '';
    document.getElementById('game-year').value = 2024;
    document.getElementById('game-rating').value = 9.0;
    document.getElementById('game-badge').value = '';
    document.getElementById('game-cover-url').value = '';
    document.getElementById('game-cd-price').value = 18000;
    document.getElementById('game-online-price').value = 5000;
    document.getElementById('game-modded-price').value = 2000;
    document.getElementById('game-ps4-size').value = 45;
    document.getElementById('game-pc-size').value = 50;
    document.getElementById('game-desc').value = '';

    ['ps5', 'ps4'].forEach(p => document.getElementById(`plat-${p}`).checked = true);
    ['pc', 'xbox', 'ps3'].forEach(p => document.getElementById(`plat-${p}`).checked = false);

    this.updateCoverPreview('');
    this.openModal('modal-game-drawer');
  },

  openEditGameModal(id) {
    const g = this.games.find(item => item.id === id);
    if (!g) return;

    document.getElementById('game-form-mode').value = 'edit';
    document.getElementById('game-id-hidden').value = g.id;
    document.getElementById('game-drawer-title').innerHTML = `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
      Edit "${g.title}"
    `;

    document.getElementById('game-title').value = g.title || '';
    document.getElementById('game-genre').value = g.genre || '';
    document.getElementById('game-year').value = g.releaseYear || 2024;
    document.getElementById('game-rating').value = g.rating || 9.0;
    document.getElementById('game-badge').value = g.badge || '';
    document.getElementById('game-cover-url').value = g.coverPath || '';
    document.getElementById('game-cd-price').value = g.cdPrice || 18000;
    document.getElementById('game-online-price').value = g.onlinePrice || 5000;
    document.getElementById('game-modded-price').value = g.moddedPrice || 2000;
    document.getElementById('game-ps4-size').value = g.ps4Size || 45;
    document.getElementById('game-pc-size').value = g.pcSize || 50;
    document.getElementById('game-desc').value = g.description || '';

    const plats = g.platforms || [];
    ['ps5', 'ps4', 'pc', 'xbox', 'ps3'].forEach(p => {
      const chk = document.getElementById(`plat-${p}`);
      if (chk) chk.checked = plats.some(pl => pl.toLowerCase() === p);
    });

    this.updateCoverPreview(g.coverPath || '');
    this.openModal('modal-game-drawer');
  },

  saveGame(e) {
    e.preventDefault();
    const mode = document.getElementById('game-form-mode').value;
    const existingId = document.getElementById('game-id-hidden').value;

    const title = document.getElementById('game-title').value.trim();
    const genre = document.getElementById('game-genre').value.trim();
    const releaseYear = Number(document.getElementById('game-year').value) || 2024;
    const rating = Number(document.getElementById('game-rating').value) || 9.0;
    const badge = document.getElementById('game-badge').value.trim();
    const coverPath = document.getElementById('game-cover-url').value.trim() || '../shared/assets/covers/ea-sports-fc-26.jpg';

    const cdPrice = Number(document.getElementById('game-cd-price').value) || 18000;
    const onlinePrice = Number(document.getElementById('game-online-price').value) || 5000;
    const moddedPrice = Number(document.getElementById('game-modded-price').value) || 2000;
    const ps4Size = Number(document.getElementById('game-ps4-size').value) || 45;
    const pcSize = Number(document.getElementById('game-pc-size').value) || 50;
    const description = document.getElementById('game-desc').value.trim();

    const platforms = [];
    ['ps5', 'ps4', 'pc', 'xbox', 'ps3'].forEach(p => {
      const chk = document.getElementById(`plat-${p}`);
      if (chk && chk.checked) platforms.push(chk.value);
    });
    if (!platforms.length) platforms.push('PS4');

    if (mode === 'add') {
      const newId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(Math.random() * 1000);
      const newGame = {
        id: newId,
        title, genre, releaseYear, rating, badge,
        platforms, ps4Size, pcSize,
        cdPrice, onlinePrice, moddedPrice,
        coverPath, description, stock: 'in'
      };

      this.games.unshift(newGame);
      this.showToast(`"${title}" added to catalog!`);
      this.logActivity(`Added new game: "${title}" (₦${cdPrice.toLocaleString()}).`);

      // Attempt Supabase async insert
      if (this.supabase) {
        this.supabase.from('games').insert([{
          id: newId,
          title, genre, rating,
          release_year: releaseYear,
          badge,
          ps4_size_gb: ps4Size,
          pc_size_gb: pcSize,
          cd_price: cdPrice,
          online_price: onlinePrice,
          modded_price: moddedPrice,
          cover_path: coverPath,
          description
        }]).then(({ error }) => {
          if (error) console.warn('[Supabase] Insert game warn:', error);
        });
      }
    } else {
      const idx = this.games.findIndex(g => g.id === existingId);
      if (idx !== -1) {
        this.games[idx] = {
          ...this.games[idx],
          title, genre, releaseYear, rating, badge,
          platforms, ps4Size, pcSize,
          cdPrice, onlinePrice, moddedPrice,
          coverPath, description
        };
        this.showToast(`Updated "${title}"!`);
        this.logActivity(`Edited game: "${title}".`);

        // Attempt Supabase async update
        if (this.supabase) {
          this.supabase.from('games').update({
            title, genre, rating,
            release_year: releaseYear,
            badge,
            ps4_size_gb: ps4Size,
            pc_size_gb: pcSize,
            cd_price: cdPrice,
            online_price: onlinePrice,
            modded_price: moddedPrice,
            cover_path: coverPath,
            description
          }).eq('id', existingId).then(({ error }) => {
            if (error) console.warn('[Supabase] Update game warn:', error);
          });
        }
      }
    }

    this.saveLocal('legend_admin_games', this.games);
    this.closeModal('modal-game-drawer');
    this.renderGames();
    this.renderOverview();
  },

  confirmDeleteGame(id) {
    const g = this.games.find(item => item.id === id);
    if (!g) return;

    this.pendingConfirmCallback = () => {
      this.games = this.games.filter(item => item.id !== id);
      this.saveLocal('legend_admin_games', this.games);
      this.renderGames();
      this.renderOverview();
      this.showToast(`Removed "${g.title}" from catalog.`);
      this.logActivity(`Deleted game: "${g.title}".`);

      if (this.supabase) {
        this.supabase.from('games').delete().eq('id', id).then(() => {});
      }
      this.closeModal('modal-confirm');
    };

    document.getElementById('confirm-modal-message').textContent = `Are you sure you want to delete "${g.title}"? This cannot be undone.`;
    this.openModal('modal-confirm');
  },

  // ── 6. ⭐ COVER ART STUDIO & GALLERY PICKER ENGINE ──
  handleCoverFileUpload(files) {
    if (!files || !files.length) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      this.showToast('Please select a valid image file', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      document.getElementById('game-cover-url').value = dataUrl;
      this.updateCoverPreview(dataUrl);
      this.showToast('Cover loaded from your gallery!');
      this.logActivity(`Uploaded new cover artwork image (${Math.round(file.size / 1024)} KB).`);
    };
    reader.readAsDataURL(file);
  },

  updateCoverPreview(url) {
    const previewImg = document.getElementById('game-cover-preview');
    const emptyBox = document.getElementById('game-cover-empty');
    if (!url) {
      previewImg.style.display = 'none';
      emptyBox.style.display = 'flex';
      return;
    }

    previewImg.src = url;
    previewImg.onload = () => {
      previewImg.style.display = 'block';
      emptyBox.style.display = 'none';
    };
    previewImg.onerror = () => {
      previewImg.style.display = 'none';
      emptyBox.style.display = 'flex';
    };
  },

  openCoverGalleryBrowser() {
    this.openModal('modal-cover-gallery');
    this.filterGalleryCovers('');
  },

  populateGalleryModal() {
    const container = document.getElementById('gallery-grid-container');
    if (!container) return;

    container.innerHTML = STORE_COVERS_LIBRARY.map(filename => {
      const title = filename.replace('.jpg', '').replace(/-/g, ' ');
      const path = `../shared/assets/covers/${filename}`;

      return `
        <div class="gallery-item-card" onclick="AdminApp.selectGalleryCover('${path}')" title="${title}">
          <img src="${path}" class="gallery-thumb" alt="${title}" loading="lazy">
          <div class="gallery-thumb-title">${title}</div>
        </div>
      `;
    }).join('');
  },

  filterGalleryCovers(query) {
    const q = (query || '').toLowerCase().trim();
    document.querySelectorAll('.gallery-item-card').forEach(card => {
      const title = card.getAttribute('title').toLowerCase();
      card.style.display = !q || title.includes(q) ? 'block' : 'none';
    });
  },

  selectGalleryCover(path) {
    document.getElementById('game-cover-url').value = path;
    this.updateCoverPreview(path);
    this.closeModal('modal-cover-gallery');
    this.showToast('Selected cover artwork from store gallery!');
  },

  // ── 7. CONSOLES & HARDWARE CRUD ──
  renderConsoles() {
    const tbody = document.getElementById('consoles-tbody');
    const totalPill = document.getElementById('consoles-total-pill');
    if (!tbody) return;

    const query = (document.getElementById('consoles-search-input')?.value || '').toLowerCase().trim();
    const filtered = this.consoles.filter(c => !query || c.variantName.toLowerCase().includes(query) || c.storage.toLowerCase().includes(query));

    if (totalPill) totalPill.textContent = `${filtered.length} Variants`;

    if (!filtered.length) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #7c889b; padding: 24px;">No console variants found.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(c => {
      const stockState = c.stock || 'in';
      const stockLabel = stockState === 'in' ? 'In Stock' : (stockState === 'low' ? 'Low Stock' : 'Out of Stock');

      return `
        <tr>
          <td>
            <strong class="product-title-bold">${c.variantName}</strong>
            <span class="product-sub-meta">${c.specBlurb || 'Console Package'}</span>
          </td>
          <td><span style="font-family: 'Chakra Petch';">${c.storage}</span></td>
          <td><strong style="color: #ffd600;">${this.formatNaira(c.basePrice)}</strong></td>
          <td>
            <span style="color: ${c.hasFcBundle ? '#00ff66' : '#7c889b'}; font-weight: 700;">
              ${c.hasFcBundle ? '✓ Included Free' : '—'}
            </span>
          </td>
          <td>
            <span style="color: ${c.hasModdedOption ? '#00e5ff' : '#7c889b'};">
              ${c.hasModdedOption ? '✓ Eligible' : 'Standard Only'}
            </span>
          </td>
          <td>
            <button class="stock-toggle-btn ${stockState === 'in' ? 'in-stock' : (stockState === 'low' ? 'low-stock' : 'out-stock')}"
              onclick="AdminApp.toggleConsoleStock('${c.id}')">
              ● ${stockLabel}
            </button>
          </td>
          <td style="text-align: right;">
            <div class="table-action-group" style="justify-content: flex-end;">
              <button class="btn-table-icon delete" title="Remove Console" onclick="AdminApp.confirmDeleteConsole('${c.id}')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  filterConsoles() {
    this.renderConsoles();
  },

  toggleConsoleStock(id) {
    const c = this.consoles.find(item => item.id === id);
    if (!c) return;
    const states = ['in', 'low', 'out'];
    c.stock = states[(states.indexOf(c.stock || 'in') + 1) % states.length];
    this.saveLocal('legend_admin_consoles', this.consoles);
    this.renderConsoles();
    this.showToast(`Updated stock for ${c.variantName}`);
  },

  openAddConsoleModal() {
    document.getElementById('console-form-mode').value = 'add';
    document.getElementById('console-id-hidden').value = '';
    document.getElementById('console-variant-name').value = '';
    document.getElementById('console-storage').value = '1TB';
    document.getElementById('console-base-price').value = 540000;
    document.getElementById('console-spec-blurb').value = 'Includes 1 Official Pad & Power Cords';
    this.openModal('modal-console-drawer');
  },

  saveConsole(e) {
    e.preventDefault();
    const family = document.getElementById('console-family').value;
    const variantName = document.getElementById('console-variant-name').value.trim();
    const storage = document.getElementById('console-storage').value.trim() || '1TB';
    const basePrice = Number(document.getElementById('console-base-price').value) || 450000;
    const specBlurb = document.getElementById('console-spec-blurb').value.trim();
    const hasFcBundle = document.getElementById('console-fc-bundle').checked;
    const hasModdedOption = document.getElementById('console-modded-eligible').checked;

    const newConsole = {
      id: 'cons_' + Date.now(),
      family, variantName, storage, basePrice, specBlurb,
      hasFcBundle, hasModdedOption, stock: 'in'
    };

    this.consoles.unshift(newConsole);
    this.saveLocal('legend_admin_consoles', this.consoles);
    this.closeModal('modal-console-drawer');
    this.renderConsoles();
    this.renderOverview();
    this.showToast(`Added console variant: "${variantName}"!`);
    this.logActivity(`Added console variant "${variantName}" (${this.formatNaira(basePrice)}).`);
  },

  confirmDeleteConsole(id) {
    const c = this.consoles.find(item => item.id === id);
    if (!c) return;
    this.pendingConfirmCallback = () => {
      this.consoles = this.consoles.filter(item => item.id !== id);
      this.saveLocal('legend_admin_consoles', this.consoles);
      this.renderConsoles();
      this.renderOverview();
      this.showToast(`Deleted "${c.variantName}".`);
      this.logActivity(`Deleted console "${c.variantName}".`);
      this.closeModal('modal-confirm');
    };
    document.getElementById('confirm-modal-message').textContent = `Are you sure you want to remove "${c.variantName}" from the store catalog?`;
    this.openModal('modal-confirm');
  },

  // ── 8. EXTERNAL DRIVES, ACCESSORIES & WRAPS ──
  renderDrives() {
    const tbody = document.getElementById('drives-tbody');
    if (!tbody) return;

    tbody.innerHTML = this.drives.map(d => `
      <tr>
        <td><strong style="color: #00e5ff; font-family: 'Chakra Petch';">${d.name}</strong></td>
        <td><span style="font-family: 'Chakra Petch';">~${d.gamesEst} Blockbuster Games</span></td>
        <td><strong style="color: #ffd600;">${this.formatNaira(d.price)}</strong></td>
        <td><span style="color: #7c889b; font-size: 0.8rem;">${d.desc}</span></td>
        <td><span class="stock-toggle-btn in-stock">● In Stock</span></td>
        <td style="text-align: right;">
          <button class="btn-table-icon" title="Edit Price" onclick="AdminApp.editDrivePrice('${d.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </button>
        </td>
      </tr>
    `).join('');
  },

  editDrivePrice(id) {
    const d = this.drives.find(item => item.id === id);
    if (!d) return;
    const newPrice = prompt(`Enter new price for ${d.name} (Current: ₦${d.price.toLocaleString()}):`, d.price);
    if (newPrice && !isNaN(newPrice)) {
      d.price = Number(newPrice);
      this.saveLocal('legend_admin_drives', this.drives);
      this.renderDrives();
      this.showToast(`Updated price for ${d.name}!`);
      this.logActivity(`Updated ${d.name} price to ₦${d.price.toLocaleString()}.`);
    }
  },

  openAddDriveModal() {
    const name = prompt('Drive package name (e.g. 1TB High-Speed Drive):', '1TB High-Speed External HDD');
    if (!name) return;
    const price = prompt('Price in Naira (₦):', '35000');
    if (!price) return;

    this.drives.push({
      id: 'hdd_' + Date.now(),
      name,
      capacity: '1TB',
      gamesEst: 30,
      price: Number(price),
      desc: 'Pre-loaded customized game package',
      stock: 'in'
    });
    this.saveLocal('legend_admin_drives', this.drives);
    this.renderDrives();
    this.showToast('New hard drive package created!');
  },

  renderAccessories() {
    const tbody = document.getElementById('accessories-tbody');
    const totalPill = document.getElementById('accessories-total-pill');
    if (!tbody) return;

    const query = (document.getElementById('accessories-search-input')?.value || '').toLowerCase().trim();
    const filtered = this.accessories.filter(a => !query || a.name.toLowerCase().includes(query) || a.category.toLowerCase().includes(query));

    if (totalPill) totalPill.textContent = `${filtered.length} Items`;

    tbody.innerHTML = filtered.map(a => `
      <tr>
        <td><strong class="product-title-bold">${a.name}</strong></td>
        <td><span class="platform-tag">${a.category}</span></td>
        <td><strong style="color: #ffd600;">${this.formatNaira(a.price)}</strong></td>
        <td><span style="font-size: 0.8rem; color: #7c889b;">${a.compatibility}</span></td>
        <td>
          <button class="stock-toggle-btn ${a.stock === 'in' ? 'in-stock' : (a.stock === 'low' ? 'low-stock' : 'out-stock')}" onclick="AdminApp.toggleAccessoryStock('${a.id}')">
            ● ${a.stock === 'in' ? 'In Stock' : 'Out of Stock'}
          </button>
        </td>
        <td style="text-align: right;">
          <button class="btn-table-icon delete" title="Delete" onclick="AdminApp.deleteAccessory('${a.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </td>
      </tr>
    `).join('');
  },

  filterAccessories() {
    this.renderAccessories();
  },

  toggleAccessoryStock(id) {
    const a = this.accessories.find(item => item.id === id);
    if (!a) return;
    a.stock = a.stock === 'in' ? 'out' : 'in';
    this.saveLocal('legend_admin_accessories', this.accessories);
    this.renderAccessories();
    this.showToast(`Updated stock for ${a.name}`);
  },

  openAddAccessoryModal() {
    const name = prompt('Accessory Name (e.g. DualSense Wireless Pad - Midnight Black):');
    if (!name) return;
    const price = prompt('Price (₦):', '85000');
    if (!price) return;
    const category = prompt('Category (Controllers, Audio, Charging, Cables):', 'Controllers');

    this.accessories.unshift({
      id: 'acc_' + Date.now(),
      name,
      category: category || 'Controllers',
      price: Number(price),
      compatibility: 'PS5 / PS4',
      stock: 'in'
    });
    this.saveLocal('legend_admin_accessories', this.accessories);
    this.renderAccessories();
    this.renderOverview();
    this.showToast('Accessory added!');
    this.logActivity(`Added accessory: "${name}".`);
  },

  deleteAccessory(id) {
    this.accessories = this.accessories.filter(a => a.id !== id);
    this.saveLocal('legend_admin_accessories', this.accessories);
    this.renderAccessories();
    this.renderOverview();
    this.showToast('Accessory deleted.');
  },

  renderWraps() {
    const tbody = document.getElementById('wraps-tbody');
    const totalPill = document.getElementById('wraps-total-pill');
    if (!tbody) return;

    if (totalPill) totalPill.textContent = `${this.wraps.length} Designs`;

    tbody.innerHTML = this.wraps.map(w => `
      <tr>
        <td><strong class="product-title-bold">${w.name}</strong></td>
        <td><span style="color: #00e5ff; font-family: 'Chakra Petch';">${w.compatible}</span></td>
        <td><strong style="color: #ffd600;">${this.formatNaira(w.price)}</strong></td>
        <td><span class="stock-toggle-btn in-stock">● In Stock</span></td>
        <td style="text-align: right;">
          <button class="btn-table-icon delete" title="Delete Wrap" onclick="AdminApp.deleteWrap('${w.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </td>
      </tr>
    `).join('');
  },

  openAddWrapModal() {
    const name = prompt('Wrap Design Title (e.g. Spider-Man Symbiote Red & Black Skin):');
    if (!name) return;
    const price = prompt('Price (₦):', '15000');
    if (!price) return;
    const compatible = prompt('Console Compatibility (e.g. PS5 Slim Disc Edition):', 'PS5 Slim Disc');

    this.wraps.unshift({
      id: 'wrap_' + Date.now(),
      name,
      compatible: compatible || 'PS5 Disc',
      price: Number(price),
      stock: 'in'
    });
    this.saveLocal('legend_admin_wraps', this.wraps);
    this.renderWraps();
    this.renderOverview();
    this.showToast('Console wrap added!');
  },

  deleteWrap(id) {
    this.wraps = this.wraps.filter(w => w.id !== id);
    this.saveLocal('legend_admin_wraps', this.wraps);
    this.renderWraps();
    this.renderOverview();
    this.showToast('Wrap deleted.');
  },

  // ── 9. BATCH PRICING & FX ADJUSTER ENGINE ──
  updateBatchPreview() {
    const tbody = document.getElementById('batch-preview-tbody');
    if (!tbody) return;

    const target = document.getElementById('batch-category-select').value;
    const type = document.getElementById('batch-type-select').value;
    const val = Number(document.getElementById('batch-value-input').value) || 0;
    const shouldRound = document.getElementById('batch-round-chk').checked;

    let sampleItems = [];
    if (target === 'games-disc') {
      sampleItems = this.games.slice(0, 8).map(g => ({ title: g.title + ' (Disc)', price: g.cdPrice }));
    } else if (target === 'games-modded') {
      sampleItems = this.games.slice(0, 8).map(g => ({ title: g.title + ' (Modded)', price: g.moddedPrice }));
    } else if (target === 'consoles') {
      sampleItems = this.consoles.slice(0, 8).map(c => ({ title: c.variantName, price: c.basePrice }));
    } else if (target === 'drives') {
      sampleItems = this.drives.map(d => ({ title: d.name, price: d.price }));
    } else {
      sampleItems = this.accessories.slice(0, 8).map(a => ({ title: a.name, price: a.price }));
    }

    tbody.innerHTML = sampleItems.map(item => {
      let newPrice = item.price;
      if (type === 'percent-inc') newPrice = item.price * (1 + val / 100);
      else if (type === 'percent-dec') newPrice = item.price * (1 - val / 100);
      else if (type === 'fixed-inc') newPrice = item.price + val;
      else if (type === 'fixed-dec') newPrice = Math.max(0, item.price - val);

      if (shouldRound) {
        newPrice = Math.round(newPrice / 500) * 500;
      }

      const diff = newPrice - item.price;
      const diffLabel = diff >= 0 ? `+${this.formatNaira(diff)}` : `-${this.formatNaira(Math.abs(diff))}`;

      return `
        <tr>
          <td><strong style="color: #fff;">${item.title}</strong></td>
          <td><span class="price-old">${this.formatNaira(item.price)}</span></td>
          <td><span style="color: ${diff >= 0 ? '#00ff66' : '#ff2a55'}; font-size: 0.8rem; font-family: 'Chakra Petch';">${diffLabel}</span></td>
          <td><span class="price-new">${this.formatNaira(newPrice)}</span></td>
        </tr>
      `;
    }).join('');
  },

  applyBatchPriceUpdate() {
    const target = document.getElementById('batch-category-select').value;
    const type = document.getElementById('batch-type-select').value;
    const val = Number(document.getElementById('batch-value-input').value) || 0;
    const shouldRound = document.getElementById('batch-round-chk').checked;

    const calcNew = (oldPrice) => {
      let n = oldPrice;
      if (type === 'percent-inc') n = oldPrice * (1 + val / 100);
      else if (type === 'percent-dec') n = oldPrice * (1 - val / 100);
      else if (type === 'fixed-inc') n = oldPrice + val;
      else if (type === 'fixed-dec') n = Math.max(0, oldPrice - val);
      return shouldRound ? Math.round(n / 500) * 500 : Math.round(n);
    };

    let count = 0;
    if (target === 'games-disc') {
      this.games.forEach(g => { g.cdPrice = calcNew(g.cdPrice); count++; });
      this.saveLocal('legend_admin_games', this.games);
      this.renderGames();
    } else if (target === 'games-modded') {
      this.games.forEach(g => { g.moddedPrice = calcNew(g.moddedPrice); count++; });
      this.saveLocal('legend_admin_games', this.games);
      this.renderGames();
    } else if (target === 'consoles') {
      this.consoles.forEach(c => { c.basePrice = calcNew(c.basePrice); count++; });
      this.saveLocal('legend_admin_consoles', this.consoles);
      this.renderConsoles();
    } else if (target === 'drives') {
      this.drives.forEach(d => { d.price = calcNew(d.price); count++; });
      this.saveLocal('legend_admin_drives', this.drives);
      this.renderDrives();
    } else {
      this.accessories.forEach(a => { a.price = calcNew(a.price); count++; });
      this.saveLocal('legend_admin_accessories', this.accessories);
      this.renderAccessories();
    }

    this.showToast(`Applied mass price update across ${count} items!`, 'success');
    this.logActivity(`Mass price recalibration executed on ${target} (${val}% or amount).`);
    this.updateBatchPreview();
  },

  resetBatchPriceDefaults() {
    document.getElementById('batch-value-input').value = 10;
    this.updateBatchPreview();
  },

  // ── 10. WHATSAPP BROADCAST COMPOSER ──
  loadBroadcastTemplate(preset) {
    const textarea = document.getElementById('broadcast-content');
    if (!textarea) return;

    if (preset === 'weekend-flash') {
      textarea.value = `🔥 *WEEKEND GAMING FLASH SALE — LEGEND GAMES LAGOS* 🔥\n---------------------------------------------\nUpgrading your setup this weekend? We have freshly tested hardware & top titles ready for safe pickup in Lagos!\n\n🎮 *CONSOLES IN STOCK:*\n• PS5 Slim 1TB Disc Edition + Free FC 26 — *₦540,000*\n• PS4 Slim 1TB Modded (Pre-loaded ~30 Games) — *₦240,000*\n• Xbox Series S 512GB Next-Gen — *₦320,000*\n\n💿 *HOT GAME DISCS:*\n• EA SPORTS FC 26 (PS5/PS4) — *₦38,000*\n• God of War Ragnarok — *₦28,000*\n• Spider-Man 2 — *₦35,000*\n\n📍 *SAFE MEETUP LOCATIONS:*\nIkeja City Mall • Circle Mall Lekki • The Palms VI\n\n💬 *Reply to this broadcast or tap below to lock in your order before stock clears!*`;
    } else if (preset === 'fc-drop') {
      textarea.value = `⚽ *EA SPORTS FC 26 IS OFFICIALLY IN STOCK!* ⚽\n---------------------------------------------\nBrand new sealed physical discs & digital accounts ready today at Legend Games!\n\n• Physical Disc (PS5 / PS4): *₦38,000*\n• Digital Account Access: *₦12,000*\n• PS4 Offline Modded Install: *₦3,000*\n\n🚗 Fast Lagos handover today at ICM or Circle Mall Lekki.\nReply *FC26* to reserve your copy now!`;
    } else if (preset === 'jailbreak-deal') {
      textarea.value = `⚡ *UNLIMITED OFFLINE GAMING — PS4 JAILBREAK SETUP* ⚡\n---------------------------------------------\nStop spending ₦30k per game disc. Get a fully modded PS4 loaded with the world's best games:\n\n• 500GB HDD — 15 Games Pre-Loaded\n• 1TB HDD — 30 Blockbuster Games Pre-Loaded\n• 2TB HDD — 60 Blockbuster Games Pre-Loaded\n\nIncludes GTA V, FC 26, Mortal Kombat 11, God of War Ragnarok & more.\n\n💬 DM us with your preferred games list to get a custom quote!`;
    } else if (preset === 'tradein-promo') {
      textarea.value = `🔄 *SWAP YOUR OLD PS4 FOR A BRAND NEW PS5 TODAY!* 🔄\n---------------------------------------------\nDon't let your old console gather dust. Legend Games offers instant trade-in valuations in Lagos:\n\n• PS4 Slim (1TB) Trade Value: Up to *₦165,000*\n• PS4 Pro 4K Trade Value: Up to *₦210,000*\n• PS4 Fat (500GB): Up to *₦120,000*\n\nPay only the balance and walk away with a PS5 Slim on the spot!\n\n📍 Safe testing & inspection at Ikeja City Mall or Lekki Circle Mall.`;
    }

    this.updateBroadcastPreview();
  },

  updateBroadcastPreview() {
    const content = document.getElementById('broadcast-content')?.value || '';
    const preview = document.getElementById('broadcast-preview');
    if (!preview) return;

    // Convert *bold* to <strong> for preview
    const formatted = content
      .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');

    preview.innerHTML = formatted || '<span style="color: #7c889b;">Type a message to preview WhatsApp status formatting...</span>';
  },

  copyBroadcastText() {
    const text = document.getElementById('broadcast-content')?.value || '';
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      this.showToast('Broadcast text copied to clipboard!');
    }).catch(() => {
      this.showToast('Please allow clipboard access.', 'error');
    });
  },

  openBroadcastInWhatsApp() {
    const text = document.getElementById('broadcast-content')?.value || '';
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  },

  // ── 11. LAGOS MEETUP HUBS ──
  renderHubs() {
    const container = document.getElementById('hubs-container');
    if (!container) return;

    container.innerHTML = this.hubs.map(h => `
      <div class="hub-card" style="border-left: 3px solid ${h.active ? '#00ff66' : '#ff2a55'};">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="hub-name">${h.name}</div>
            <button class="stock-toggle-btn ${h.active ? 'in-stock' : 'out-stock'}" onclick="AdminApp.toggleHubActive('${h.id}')">
              ${h.active ? 'Active' : 'Closed'}
            </button>
          </div>
          <div class="hub-area">${h.area}</div>
          <div class="hub-desc">${h.desc}</div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 10px; font-size: 0.76rem; color: #7c889b;">
          <span>🕒 ${h.hours}</span>
          <button class="btn-table-icon delete" title="Remove Hub" onclick="AdminApp.deleteHub('${h.id}')" style="min-width: 30px; min-height: 30px; padding: 4px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
          </button>
        </div>
      </div>
    `).join('');
  },

  toggleHubActive(id) {
    const h = this.hubs.find(item => item.id === id);
    if (!h) return;
    h.active = !h.active;
    this.saveLocal('legend_admin_hubs', this.hubs);
    this.renderHubs();
    this.showToast(`${h.name} is now ${h.active ? 'ACTIVE' : 'INACTIVE'}.`);
  },

  openAddHubPrompt() {
    const name = prompt('Hub Name (e.g. Surulere Leisure Mall):');
    if (!name) return;
    const area = prompt('Area / Road (e.g. Adeniran Ogunsanya, Surulere):');
    if (!area) return;

    this.hubs.push({
      id: 'hub_' + Date.now(),
      name,
      area,
      hours: '10:00 AM - 7:00 PM',
      active: true,
      desc: 'Central concourse & secure public meetup'
    });
    this.saveLocal('legend_admin_hubs', this.hubs);
    this.renderHubs();
    this.showToast('Meetup Hub created!');
  },

  deleteHub(id) {
    this.hubs = this.hubs.filter(h => h.id !== id);
    this.saveLocal('legend_admin_hubs', this.hubs);
    this.renderHubs();
    this.showToast('Hub removed.');
  },

  // ── 12. LIVE ORDERS & CUSTOMER PIPELINE ──
  renderOrders() {
    const container = document.getElementById('orders-pipeline-container');
    const totalBadge = document.getElementById('orders-total-badge');
    if (!container) return;

    const query = (document.getElementById('orders-search-input')?.value || '').toLowerCase().trim();
    const statusFilter = document.getElementById('orders-status-filter')?.value || 'all';

    const filtered = this.orders.filter(o => {
      const matchQuery = !query || 
        (o.ref && o.ref.toLowerCase().includes(query)) ||
        (o.customer?.name && o.customer.name.toLowerCase().includes(query)) ||
        (o.customer?.phone && o.customer.phone.toLowerCase().includes(query));
      const matchStatus = statusFilter === 'all' || (o.status && o.status.includes(statusFilter));
      return matchQuery && matchStatus;
    });

    if (totalBadge) totalBadge.textContent = `${filtered.length} Orders`;

    if (!filtered.length) {
      container.innerHTML = `<div style="text-align: center; color: #7c889b; padding: 40px; background: #0b0e15; border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1);">No orders match your filter criteria.</div>`;
      return;
    }

    container.innerHTML = filtered.map(o => {
      const items = Array.isArray(o.items) ? o.items : [];
      const itemsList = items.map(i => `${i.title || i.name} (x${i.quantity || 1})`).join(', ');
      const custName = o.customer?.name || 'Customer';
      const custPhone = o.customer?.phone || 'No phone';
      const hub = o.customer?.location || 'Lagos Safe Hub';

      return `
        <div class="order-row-card">
          <div>
            <span class="order-ref-badge">${o.ref || 'ORDER'}</span>
            <div class="order-customer-info">
              <span class="order-customer-name">${custName}</span>
              <span class="order-meta-info">📱 ${custPhone} · 📍 ${hub}</span>
            </div>
          </div>

          <div class="order-items-snippet">
            <span style="font-size: 0.72rem; text-transform: uppercase; color: #7c889b; font-weight: 700;">Basket (${items.length} items):</span>
            <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #d1d7e2;">
              ${itemsList || 'Custom Quote Items'}
            </div>
          </div>

          <div class="order-total-price">
            ${this.formatNaira(o.total)}
          </div>

          <div>
            <select class="toolbar-select" onchange="AdminApp.updateOrderStatus('${o.ref}', this.value)" style="min-height: 38px;">
              <option value="Pending WhatsApp Confirmation" ${o.status?.includes('Pending') ? 'selected' : ''}>🟡 Pending</option>
              <option value="Meetup Scheduled" ${o.status?.includes('Scheduled') ? 'selected' : ''}>🔵 Meetup Scheduled</option>
              <option value="Completed" ${o.status?.includes('Completed') ? 'selected' : ''}>🟢 Completed</option>
              <option value="Cancelled" ${o.status?.includes('Cancelled') ? 'selected' : ''}>🔴 Cancelled</option>
            </select>
          </div>

          <div>
            <button class="btn-admin btn-admin-whatsapp" onclick="AdminApp.chatCustomerWhatsApp('${custPhone}', '${custName}', '${o.ref}')" style="min-height: 38px; padding: 6px 14px; font-size: 0.8rem;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
              Chat Customer
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  filterOrders() {
    this.renderOrders();
  },

  updateOrderStatus(ref, newStatus) {
    const o = this.orders.find(item => item.ref === ref);
    if (!o) return;
    o.status = newStatus;
    this.saveLocal('naijaplay_orders', this.orders);
    this.renderOrders();
    this.renderOverview();
    this.showToast(`Order ${ref} status updated to: ${newStatus}`);
    this.logActivity(`Order ${ref} status marked as: "${newStatus}".`);

    if (this.supabase) {
      this.supabase.from('orders').update({ status: newStatus }).eq('order_id', ref).then(() => {});
    }
  },

  chatCustomerWhatsApp(phone, name, ref) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const num = cleanPhone.startsWith('0') ? '234' + cleanPhone.slice(1) : cleanPhone;
    const msg = encodeURIComponent(`Hello ${name}! This is Legend Games regarding your quote request *${ref}*. When would you like to schedule your safe meetup in Lagos?`);
    window.open(`https://wa.me/${num}?text=${msg}`, '_blank');
  },

  // ── 13. TRADE-IN QUEUE ──
  renderTradeins() {
    const tbody = document.getElementById('tradeins-tbody');
    const badge = document.getElementById('tradeins-total-badge');
    if (!tbody) return;

    if (badge) badge.textContent = `${this.tradeins.length} Pending`;

    if (!this.tradeins.length) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #7c889b; padding: 24px;">No trade-in submissions received yet. Customer submissions from the Trade-In Calculator appear here.</td></tr>`;
      return;
    }

    tbody.innerHTML = this.tradeins.map(t => `
      <tr>
        <td><strong style="color: #00e5ff; font-family: 'Chakra Petch';">${t.tradeInId || 'TR-01'}</strong></td>
        <td><strong class="product-title-bold">${t.deviceName}</strong></td>
        <td><span class="platform-tag">${t.condition}</span></td>
        <td><span style="font-size: 0.8rem; color: #7c889b;">${(t.includedItems || []).join(', ') || 'Unit only'}</span></td>
        <td><span style="font-size: 0.8rem; color: #d1d7e2;">${(t.tradeGames || []).join(', ') || 'None'}</span></td>
        <td><strong style="color: #ffd600;">${this.formatNaira(t.estimatedValue)}</strong></td>
        <td><span style="font-family: 'Chakra Petch';">${t.phone || '+234...'}</span></td>
        <td style="text-align: right;">
          <button class="btn-admin btn-admin-whatsapp" style="min-height: 34px; padding: 4px 10px; font-size: 0.74rem;" onclick="AdminApp.respondTradeIn('${t.phone || ''}', '${t.deviceName}', '${t.estimatedValue}')">
            Accept / Counter
          </button>
        </td>
      </tr>
    `).join('');
  },

  respondTradeIn(phone, device, val) {
    const num = phone ? phone.replace(/[^0-9]/g, '') : '2348000000000';
    const msg = encodeURIComponent(`Hello! Legend Games here regarding your ${device} trade-in valuation (₦${Number(val).toLocaleString()}). Please send us photos of the console seal & condition so we can confirm handover!`);
    window.open(`https://wa.me/${num}?text=${msg}`, '_blank');
  },

  // ── 14. SERVICES & REPAIRS DESK ──
  renderServices() {
    const tbody = document.getElementById('services-tbody');
    const badge = document.getElementById('services-total-badge');
    if (!tbody) return;

    if (badge) badge.textContent = `${this.services.length} Tickets`;

    if (!this.services.length) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #7c889b; padding: 24px;">No console repair tickets active. Customer repair requests from the Request Form appear here.</td></tr>`;
      return;
    }

    tbody.innerHTML = this.services.map(s => `
      <tr>
        <td><strong style="color: #ccff00; font-family: 'Chakra Petch';">${s.ref || 'REP-01'}</strong></td>
        <td><span class="platform-tag">${s.type || 'Repair'}</span></td>
        <td><strong class="product-title-bold">${s.model}</strong></td>
        <td><span style="font-size: 0.82rem; color: #d1d7e2;">${s.description}</span></td>
        <td><span style="color: #00e5ff; font-size: 0.8rem;">${s.location || 'Ikeja'}</span></td>
        <td><span class="stock-toggle-btn low-stock">Diagnosing</span></td>
        <td style="text-align: right;">
          <button class="btn-table-icon" title="Chat Customer" onclick="AdminApp.chatCustomerWhatsApp('${s.phone || ''}', 'Customer', '${s.ref || 'TICKET'}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#25d366" stroke-width="2"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        </td>
      </tr>
    `).join('');
  },

  // ── 15. CUSTOMER PHONE DIRECTORY ──
  renderCustomers() {
    const tbody = document.getElementById('customers-tbody');
    if (!tbody) return;

    const query = (document.getElementById('customers-search-input')?.value || '').toLowerCase().trim();

    // Map unique customers from orders
    const map = {};
    this.orders.forEach(o => {
      const phone = o.customer?.phone || 'No phone';
      if (!map[phone]) {
        map[phone] = {
          name: o.customer?.name || 'Customer',
          phone: phone,
          ordersCount: 0,
          totalSpend: 0,
          location: o.customer?.location || 'Lagos Hub'
        };
      }
      map[phone].ordersCount++;
      map[phone].totalSpend += Number(o.total) || 0;
    });

    const list = Object.values(map).filter(c => !query || c.name.toLowerCase().includes(query) || c.phone.toLowerCase().includes(query));

    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #7c889b; padding: 24px;">No customer records found yet. Customers who place quotes will automatically appear here.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(c => `
      <tr>
        <td><strong class="product-title-bold">${c.name}</strong></td>
        <td><span style="font-family: 'Chakra Petch'; color: #00e5ff;">${c.phone}</span></td>
        <td><span style="font-family: 'Chakra Petch';">${c.ordersCount} quote(s)</span></td>
        <td><strong style="color: #ffd600;">${this.formatNaira(c.totalSpend)}</strong></td>
        <td><span style="color: #7c889b; font-size: 0.8rem;">${c.location}</span></td>
        <td style="text-align: right;">
          <button class="btn-table-icon" title="Chat on WhatsApp" onclick="AdminApp.chatCustomerWhatsApp('${c.phone}', '${c.name}', 'VIP')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#25d366" stroke-width="2"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        </td>
      </tr>
    `).join('');
  },

  filterCustomers() {
    this.renderCustomers();
  },

  // ── 16. REAL-TIME ACTIVITY AUDIT LOG ──
  renderActivities() {
    const container = document.getElementById('activity-log-container');
    if (!container) return;

    container.innerHTML = this.activities.map(a => `
      <div class="activity-item">
        <span class="activity-time">${a.time}</span>
        <span class="activity-text">${a.text}</span>
      </div>
    `).join('');
  },

  clearActivityLog() {
    this.activities = [{ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: 'Audit log cleared by admin.' }];
    this.saveLocal('legend_admin_activities', this.activities);
    this.renderActivities();
    this.showToast('Activity log cleared.');
  },

  // ── 17. MODAL UTILITIES ──
  openModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.add('active');
  },

  closeModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.remove('active');
  },

  bindEvents() {
    // Confirmation action button
    document.getElementById('btn-confirm-action')?.addEventListener('click', () => {
      if (typeof this.pendingConfirmCallback === 'function') {
        this.pendingConfirmCallback();
      }
    });

    // Close modals on escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.active').forEach(m => m.classList.remove('active'));
      }
    });

    // Hash navigation listener (e.g. #games, #consoles)
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) this.switchTab(hash);
    });

    if (window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      this.switchTab(hash);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AdminApp.init();
});
