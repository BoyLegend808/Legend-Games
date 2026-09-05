/**
 * Order Tracking Controller
 */

const OrderTracker = {
  init() {
    this.renderRecentOrders();
    // Check url params for ref
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      const input = document.getElementById('tracking-input');
      if (input) input.value = ref;
      this.lookup(ref);
    }
  },

  renderRecentOrders() {
    try {
      const pastOrders = JSON.parse(localStorage.getItem('naijaplay_orders') || '[]');
      const wrap = document.getElementById('recent-orders-wrap');
      const pills = document.getElementById('recent-orders-pills');
      if (!wrap || !pills || pastOrders.length === 0) return;

      wrap.style.display = 'block';
      pills.innerHTML = pastOrders.map(o => `
        <button class="chip" style="padding:4px 10px; font-size:0.75rem;" onclick="OrderTracker.lookup('${o.ref}')">
          ${o.ref}
        </button>
      `).join('');
    } catch (e) {
      console.error(e);
    }
  },

  lookup(specifiedRef) {
    const input = document.getElementById('tracking-input');
    let ref = specifiedRef || input?.value.trim();
    if (!ref) {
      showToast('Please enter an order reference number');
      return;
    }

    if (!ref.startsWith('NG-REQ-') && /^\d+$/.test(ref)) {
      ref = `NG-REQ-${ref}`;
    }

    if (input) input.value = ref;

    const container = document.getElementById('tracking-result-container');
    if (!container) return;

    // Simulated / local order retrieval
    container.innerHTML = `
      <div class="card card-elevated">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <span style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Reference</span>
            <h3 style="font-family:var(--font-heading); font-size:1.2rem; color:var(--accent-primary);">${ref}</h3>
          </div>
          <span class="badge badge-green">IN PROGRESS</span>
        </div>

        <!-- Timeline Steps -->
        <div class="tracking-timeline">
          <div class="timeline-step completed">
            <div class="timeline-dot"></div>
            <strong>1. Request Submitted</strong>
            <span>Items received by shop system</span>
          </div>
          <div class="timeline-step completed">
            <div class="timeline-dot"></div>
            <strong>2. WhatsApp Price Confirmation</strong>
            <span>Verified availability and agreed on meetup price</span>
          </div>
          <div class="timeline-step active">
            <div class="timeline-dot"></div>
            <strong>3. Preparing Hardware &amp; Game Loading</strong>
            <span>Testing console &amp; packaging for meetup</span>
          </div>
          <div class="timeline-step">
            <div class="timeline-dot"></div>
            <strong>4. Meetup Handover &amp; Payment</strong>
            <span>Meet at safe public location in Lagos, inspect and pay</span>
          </div>
        </div>

        <div style="background:var(--bg-card-subtle); border-radius:var(--radius-md); padding:12px; margin-top:16px;">
          <p style="font-size:0.8rem; color:var(--text-secondary);">
            Need a real-time status update or want to modify your request?
          </p>
          <button class="btn btn-whatsapp btn-full btn-sm" style="margin-top:8px;" onclick="openWhatsApp('Hi NaijaPlay, I am checking the status of request ${ref}')">
            💬 Message shop on WhatsApp
          </button>
        </div>
      </div>
    `;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  OrderTracker.init();
});
