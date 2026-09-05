# Legend Games — Design System Specification (`DESIGN.md`)

## 1. Visual Identity & Aesthetic Direction
- **Theme**: Luxury Cyberpunk & Sleek Dark Gaming Aesthetic (with seamless Light Mode support).
- **Core Mood**: High-tech, immersive, tactile, responsive, and trustworthy.

---

## 2. Design Tokens

### Color Palette (Dark Theme — Default)
- **Backgrounds**:
  - App Canvas: `#090a10` (Tinted deep midnight obsidian)
  - Surface: `#121420` (Subtle tinted dark slate)
  - Elevated Cards: `#171928` / Hover: `#1f2236`
  - Input Fields: `#0f111a`
- **Brand Accents**:
  - Primary Indigo/Violet: `#6366f1` / Hover: `#4f46e5`
  - Emerald / Verified Green: `#10b981` (Glow: `rgba(16, 185, 129, 0.25)`)
  - Amber / Prestige Gold: `#f59e0b` (Glow: `rgba(245, 158, 11, 0.25)`)
  - Alert Red: `#ef4444` (Glow: `rgba(239, 68, 68, 0.2)`)
  - WhatsApp Green: `#25d366`
- **Text & Typography**:
  - Primary Text: `#f8fafc`
  - Secondary Text: `#94a3b8`
  - Muted Text: `#64748b`
  - Display Font: `'Outfit', sans-serif` (Weights: 600, 700, 800, 900)
  - Body Font: `'Plus Jakarta Sans', sans-serif` (Weights: 400, 500, 600, 700)
  - Numerics: `font-variant-numeric: tabular-nums` for all prices, specs, and counters.

### Elevation & Borders
- **Borders**: Sub-pixel glass borders with subtle alpha: `rgba(255, 255, 255, 0.08)`
- **Shadows**:
  - `sm`: `0 2px 8px rgba(0, 0, 0, 0.4)`
  - `md`: `0 6px 20px rgba(0, 0, 0, 0.5)`
  - `lg`: `0 12px 36px rgba(0, 0, 0, 0.65)`
  - `glow-primary`: `0 0 24px rgba(99, 102, 241, 0.25)`

---

## 3. Motion & Animation Standards
- **Standard Transitions**: `cubic-bezier(0.16, 1, 0.3, 1)` (Decelerated spring-feel, no jarring bounce).
- **Duration**: `180ms` for micro-interactions, `320ms` for sheet/modal slides.
- **Haptic Touch**: `transform: scale(0.97)` on `:active` for all buttons, chips, and cards.

---

## 4. Impeccable Anti-Pattern Guardrails
1. **Never Nest Borders**: Avoid heavy border wrapping inside cards. Use clean surface contrasts and padding hierarchy.
2. **Never Use Unreadable Contrast**: Never put light gray or muted text over colored background chips.
3. **Always Tint Dark Surfaces**: No `#000000` or raw gray fills. Always use brand-tinted darks (`#090a10`, `#121420`).
4. **Touch Friendly**: All clickable buttons and selectable chips have a minimum dimension of `44x44px`.
