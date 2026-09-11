/**
 * Combined Service Request Controller (Repair / Install / Sell)
 */

const ServiceRequest = {
  activeType: 'repair', // 'repair' | 'install' | 'sell'
  selectedCondition: 'Good',

  init() {
    this.render();
  },

  setType(type) {
    this.activeType = type;
    document.querySelectorAll('.service-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-${type}`)?.classList.add('active');
    this.render();
  },

  setCondition(cond) {
    this.selectedCondition = cond;
    document.querySelectorAll('.condition-pill').forEach(p => p.classList.remove('active'));
    document.getElementById(`cond-${cond.toLowerCase().replace(/\s+/g, '-')}`)?.classList.add('active');
  },

  render() {
    const container = document.getElementById('service-dynamic-fields');
    if (!container) return;

    if (this.activeType === 'repair') {
      container.innerHTML = `
        <div class="form-group">
          <label class="form-label">Console Model</label>
          <select class="form-select" id="req-console-model">
            <option value="PS5">PlayStation 5 (Disc / Digital / Slim)</option>
            <option value="PS4">PlayStation 4 (Slim / Pro / Fat)</option>
            <option value="Xbox Series X|S">Xbox Series X | S</option>
            <option value="Xbox One">Xbox One / One S / One X</option>
            <option value="PS3">PlayStation 3</option>
            <option value="Nintendo Switch">Nintendo Switch</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Describe what is wrong with the console</label>
          <textarea class="form-textarea" id="req-description" placeholder="e.g. HDMI port broken / no display, loud fan overheating and shutting down, disc drive not reading, blinking blue light of death..."></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Urgency / Meetup Preference</label>
          <input type="text" class="form-input" id="req-location" placeholder="e.g. Ikeja, Lekki, Surulere, Festac, etc.">
        </div>
      `;
    } else if (this.activeType === 'install') {
      container.innerHTML = `
        <div class="form-group">
          <label class="form-label">Console Model</label>
          <select class="form-select" id="req-console-model">
            <option value="PS4 Jailbroken">PS4 Jailbroken / Modded (FW 9.00 / 11.00)</option>
            <option value="PS4 Normal">PS4 Standard Firmware</option>
            <option value="PS5">PlayStation 5</option>
            <option value="PS3 CFW/HEN">PS3 Jailbroken (CFW / HEN)</option>
            <option value="Gaming PC / Laptop">Gaming PC / Laptop</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">List the games you want installed</label>
          <textarea class="form-textarea" id="req-description" placeholder="e.g. GTA V, EA FC 26, Spider-Man 2, God of War Ragnarok, Mortal Kombat 1..."></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Available Storage on Your Console (GB/TB)</label>
          <input type="text" class="form-input" id="req-storage" placeholder="e.g. 500GB free or 1TB external drive">
        </div>
      `;
    } else if (this.activeType === 'sell') {
      container.innerHTML = `
        <div class="form-group">
          <label class="form-label">Console Model You Want to Sell</label>
          <select class="form-select" id="req-console-model">
            <option value="PS5 Disc Edition">PS5 Disc Edition</option>
            <option value="PS5 Digital Edition">PS5 Digital Edition</option>
            <option value="PS4 Pro 1TB">PS4 Pro 1TB</option>
            <option value="PS4 Slim 500GB/1TB">PS4 Slim</option>
            <option value="PS4 Fat">PS4 Fat</option>
            <option value="Xbox Series X">Xbox Series X</option>
            <option value="Xbox Series S">Xbox Series S</option>
            <option value="Other">Other Device</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Condition Grading</label>
          <div class="condition-grid">
            <div class="condition-pill active" id="cond-like-new" onclick="ServiceRequest.setCondition('Like New')">Like New (Pristine)</div>
            <div class="condition-pill" id="cond-good" onclick="ServiceRequest.setCondition('Good')">Good (Minor wear)</div>
            <div class="condition-pill" id="cond-fair" onclick="ServiceRequest.setCondition('Fair')">Fair (Visible scratches)</div>
            <div class="condition-pill" id="cond-for-parts" onclick="ServiceRequest.setCondition('For Parts')">For Parts / Faulty</div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Accessories Included</label>
          <input type="text" class="form-input" id="req-accessories" placeholder="e.g. 2 pads, power cable, HDMI, original box...">
        </div>

        <div class="form-group">
          <label class="form-label">Your Asking Price (₦) or Target Offer</label>
          <input type="text" class="form-input" id="req-asking-price" placeholder="e.g. ₦350,000 (Optional)">
        </div>

        <div class="meetup-alert-banner" style="margin-top:10px;">
          <div class="meetup-alert-content">
            <strong>⏱️ Fast Valuation Response</strong>
            <p>We review console buyback submissions within 1-2 hours on WhatsApp with a firm cash offer.</p>
          </div>
        </div>
      `;
    }
  },

  getFormData() {
    const model = document.getElementById('req-console-model')?.value || 'Console';
    const desc = document.getElementById('req-description')?.value || '';
    const location = document.getElementById('req-location')?.value || '';
    const acc = document.getElementById('req-accessories')?.value || '';
    const asking = document.getElementById('req-asking-price')?.value || '';

    let summary = '';
    if (this.activeType === 'repair') {
      summary = `Repair: ${model} - ${desc} (${location})`;
    } else if (this.activeType === 'install') {
      summary = `Game Install: ${model} - Games: ${desc}`;
    } else if (this.activeType === 'sell') {
      summary = `Sell Console: ${model} (${this.selectedCondition}) - Acc: ${acc} - Asking: ${asking}`;
    }

    return { model, desc, location, acc, asking, summary, type: this.activeType };
  },

  addToBasket() {
    const data = this.getFormData();
    LegendCart.addItem({
      type: `service-${data.type}`,
      title: `${data.type.toUpperCase()}: ${data.model}`,
      name: `${data.type.toUpperCase()} Request (${data.model})`,
      price: 0,
      totalPrice: 0,
      quantity: 1,
      notes: data.summary
    });
  },

  submitDirectWhatsApp() {
    const data = this.getFormData();
    if (window.LegendModal) {
      LegendModal.confirm({
        title: 'Submit Service Inquiry?',
        subtitle: 'Are you sure you want to send this service inquiry via WhatsApp?',
        icon: 'whatsapp',
        summaryRows: [
          { label: 'Inquiry Type', value: data.type ? data.type.toUpperCase() : 'SERVICE' },
          { label: 'Console Model', value: data.model || 'PlayStation / Xbox' },
          { label: 'Details', value: data.summary || 'Repair / Modding / Trade-In' }
        ],
        note: '💬 We will review your inquiry and message you on WhatsApp to confirm cost and safe Lagos meetup options.',
        confirmText: 'Yes, Send to WhatsApp',
        cancelText: 'Cancel & Edit',
        onConfirm: () => {
          try {
            const stored = JSON.parse(localStorage.getItem('legend_admin_services') || '[]');
            stored.unshift({
              ref: 'SRV-' + Date.now().toString().slice(-4),
              type: (data.type || '').toUpperCase(),
              model: data.model,
              description: data.summary || data.desc,
              location: data.location || 'Lagos',
              phone: '+234...',
              date: new Date().toISOString()
            });
            localStorage.setItem('legend_admin_services', JSON.stringify(stored.slice(0, 30)));
          } catch (e) {
            console.warn('Service save warn:', e);
          }
          const msg = `*🛠️ SERVICE INQUIRY — Legend Games*\n*Type:* ${(data.type || '').toUpperCase()}\n*Model:* ${data.model}\n*Details:* ${data.summary}\n\nPlease let me know the cost / offer and when we can arrange a safe meetup in Lagos.`;
          openWhatsApp(msg);
        }
      });
    } else {
      try {
        const stored = JSON.parse(localStorage.getItem('legend_admin_services') || '[]');
        stored.unshift({
          ref: 'SRV-' + Date.now().toString().slice(-4),
          type: (data.type || '').toUpperCase(),
          model: data.model,
          description: data.summary || data.desc,
          location: data.location || 'Lagos',
          phone: '+234...',
          date: new Date().toISOString()
        });
        localStorage.setItem('legend_admin_services', JSON.stringify(stored.slice(0, 30)));
      } catch (e) {
        console.warn('Service save warn:', e);
      }
      const msg = `*🛠️ SERVICE INQUIRY — Legend Games*\n*Type:* ${(data.type || '').toUpperCase()}\n*Model:* ${data.model}\n*Details:* ${data.summary}\n\nPlease let me know the cost / offer and when we can arrange a safe meetup in Lagos.`;
      openWhatsApp(msg);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ServiceRequest.init();
});
