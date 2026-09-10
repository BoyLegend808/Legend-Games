# Legend Games — Design System Specification (`DESIGN.md`)

## 1. Visual Identity & Aesthetic Direction
- **Theme**: Luxury Console Gaming Storefront — High-end, sophisticated, trustworthy retail experience for the Nigerian gaming community.
- **Core Mood**: Sleek, luminous, professional, community-centric, safety-first, and gaming-native.
- **Design Philosophy**: "Console UI elegance meets modern marketplace" — refined dark surfaces, luminous micro-borders, layered depth shadows, crisp typography, and responsive touch ergonomics.

---

## 2. Design Tokens

### Color Palette (Dark Theme — Default)
- **Backgrounds**:
  - App Canvas: `#070a11` (Deep midnight gaming canvas)
  - Surface: `#0f1523` (Rich dark panel surface)
  - Elevated Cards: `#151e30` / Hover: `#1c2840`
  - Input Fields: `#0a0f1a`
  - Translucent Glass: `rgba(15, 21, 35, 0.8)` with `backdrop-filter: blur(16px)`
- **Luminous Gaming Accents**:
  - Primary Hyper-Volt Lime: `#ccff00` / Hover: `#b8e600` (Electric cyber accent)
  - Hyper-Volt Green: `#00ff66` / Soft BG: `rgba(0, 255, 102, 0.12)` (High-voltage gaming green)
  - Cyber Laser Cyan: `#00e5ff` / Hover: `#00c4db` (PlayStation luminous laser sky)
  - Alert Red: `#ff2a55`
  - Premium Laser Gold: `#ffd600`
  - WhatsApp Green: `#25d366` / Hover: `#20ba5a`
- **Text & Typography (Esports High-Octane Craft)**:
  - Primary Text: `#ffffff` (Laser white)
  - Secondary Text: `#d1d7e2` (Crisp silver/slate)
  - Muted Text: `#7c889b` (Subtle precision metadata)
  - Display Font: `'Russo One', sans-serif` (Hero headline, brand, section titles)
  - Heading & Technical Font: `'Chakra Petch', sans-serif` (Subheaders, chips, badges, specs, buttons)
  - Body Font: `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif` (Ultra-clean copy)
  - Numerics: `font-variant-numeric: tabular-nums` for all prices, specs, and counters.

### Elevation, Glassmorphism & Borders
- **Borders**: Subtle 1px translucent borders:
  - Subtle: `1px solid rgba(255, 255, 255, 0.08)`
  - Medium: `1px solid rgba(255, 255, 255, 0.14)`
  - Active/Cyan: `1px solid rgba(0, 212, 255, 0.4)`
  - Active/Orange: `1px solid rgba(255, 85, 0, 0.4)`
- **Layered Shadows & Glows**:
  - `sm`: `0 2px 8px rgba(0, 0, 0, 0.35)`
  - `md`: `0 6px 20px rgba(0, 0, 0, 0.45)`
  - `lg`: `0 12px 36px rgba(0, 0, 0, 0.6)`
  - `glow-cyan`: `0 0 24px rgba(0, 212, 255, 0.15)`
  - `glow-orange`: `0 0 24px rgba(255, 85, 0, 0.15)`
  - `glow-emerald`: `0 0 24px rgba(0, 255, 136, 0.15)`

---

## 3. Motion & Animation Standards
- **Standard Transitions**: `cubic-bezier(0.16, 1, 0.3, 1)` (Smooth decelerated spring curve).
- **Duration**: `150ms` for micro-interactions, `240ms` for standard state transitions.
- **Tactile Feedback**: `transform: scale(0.97)` on `:active` for all buttons, chips, and interactive cards.
- **Card Hover Focus**: `transform: translateY(-4px) scale(1.015)` with luminous border and subtle elevation glow.
- **Marquee Motion**: Smooth continuous horizontal scroll with pause on `:hover` and under `@media (prefers-reduced-motion: reduce)`.

---

## 4. Product Truth & Anti-Pattern Guardrails
1. **Never Use Harsh Comic / Neobrutalist Tropes**: No heavy 2px solid black borders, no jagged starbursts, no flat cartoon drop shadows, no faux tape strips.
2. **Never Use Generic AI SaaS Gradients**: Use deep curated dark backgrounds with targeted electric cyan/orange luminous accents.
3. **Always Touch Friendly & Responsive**: Minimum `44x44px` interactive touch targets, seamless wrapping from 320px mobile to 1440px+ ultra-wide desktop.
4. **Authentic Nigerian Marketplace Context**: Currency is always ₦ (Nigerian Naira), PS4/PS5 consoles include free annual FC edition, direct WhatsApp quote confirmation, and safe public Lagos meetup handovers.
