# Legend Games — Design System Specification (`DESIGN.md`)

## 1. Visual Identity & Aesthetic Direction
- **Theme**: Physical Shop-Wall Collage meets Console UI — High-energy, tactile, authentic Nigerian gaming retail experience.
- **Core Mood**: Dynamic, physical, community-driven, safety-conscious, and gaming-native.
- **Design Philosophy**: "Real gaming shop wall with tactile kraft tags, hard poster shadows, and sleek console focus states."

---

## 2. Design Tokens

### Color Palette (Dark Theme — Default)
- **Backgrounds**:
  - App Canvas: `#080b11` (Deep shop canvas dark)
  - Surface: `#111622` (Rich dark surface)
  - Elevated Cards: `#182030` / Hover: `#202a3f`
  - Input Fields: `#0d121c`
- **Shop-Wall & Physical Collage Accents**:
  - Kraft Paper Tan: `#d4a373` / Dark: `#b07d48`
  - Tape Color: `rgba(255, 235, 170, 0.45)`
  - Starburst Yellow: `#ffe600` / Text: `#111111`
  - Marker Red: `#e63946`
  - Paper White: `#f8f6f0`
- **Console & Brand Accents**:
  - Primary Gaming Orange: `#ff5500` / Hover: `#ff7326`
  - Electric Cyan: `#00f0ff` / Hover: `#00d4e6`
  - PlayStation Blue: `#0070d1`
  - Xbox Green: `#107c10`
  - Gaming Neon Green: `#00ff88` (Verified/Success states)
  - WhatsApp Green: `#25d366` / Hover: `#20ba5a`
- **Text & Typography**:
  - Primary Text: `#ffffff`
  - Secondary Text: `#b8c5d6`
  - Muted Text: `#7a8a9e`
  - Display Font: `'Archivo Black', 'Outfit', sans-serif` (Bold street/arcade titles)
  - Handwritten Accent: `'Caveat', cursive` (Stickers, notes, price stamps)
  - Body Font: `'Plus Jakarta Sans', sans-serif` (Weights: 500, 600, 700)
  - Numerics: `font-variant-numeric: tabular-nums` for all prices, specs, and counters.

### Hard-Edged Poster Shadows & Borders
- **Borders**: 2px solid with high tactile contrast (`#000000`, `rgba(255, 255, 255, 0.12)`, or accent colors).
- **Poster Shadows (Zero Blur / Flat Arcade Depth)**:
  - `sm`: `2px 2px 0px #000000`
  - `md`: `4px 4px 0px #000000`
  - `lg`: `6px 6px 0px #000000`
  - `xl`: `8px 8px 0px #000000`
  - `orange`: `4px 4px 0px #ff5500`
  - `cyan`: `4px 4px 0px #00f0ff`

---

## 3. Motion & Animation Standards
- **Standard Transitions**: `cubic-bezier(0.16, 1, 0.3, 1)` (Decelerated spring-feel).
- **Duration**: `150ms` for micro-interactions, `220ms` for standard transitions, `300ms` for major state changes.
- **Haptic Touch**: `transform: scale(0.97)` on `:active` for all buttons, chips, and cards.
- **Marquee Motion**: Smooth horizontal scroll with pause on `:hover` and under `@media (prefers-reduced-motion: reduce)`.
- **Console Focus Effect**: Scale 1.025 with elevated poster shadow and high-contrast border on hover/focus.

---

## 4. Gaming Shop Anti-Pattern Guardrails
1. **Never Use Generic Soft SaaS Glows**: Use hard-edged poster shadows (`4px 4px 0 #000`) for tactile arcade depth.
2. **Never Use Template Language**: Authentic retail language like "Naija Verified", "Safe Public Meetups", "Daily Drop", "Quote Loadout".
3. **Always Use Uppercase for Impact**: Section headers, badges, and primary buttons use punchy uppercase.
4. **Touch Friendly**: All clickable buttons and selectable chips have a minimum dimension of `44x44px`.
5. **Authentic Messaging**: Currency is always ₦ (Nigerian Naira), PS4/PS5 include free annual FC edition, safe public Lagos handover locations.

