# Legend Games — Design System Specification (`DESIGN.md`)

## 1. Visual Identity & Aesthetic Direction
- **Theme**: Authentic Nigerian Gaming Shop — High-energy, trustworthy, locally-focused gaming retail experience.
- **Core Mood**: Dynamic, professional, community-driven, safety-conscious, and gaming-native.
- **Design Philosophy**: "Real gaming shop, not a template" —消除generic AI patterns and embrace authentic retail aesthetics.

---

## 2. Design Tokens

### Color Palette (Dark Theme — Default)
- **Backgrounds**:
  - App Canvas: `#0a0e17` (Deep gaming dark with subtle blue tint)
  - Surface: `#131929` (Rich dark surface)
  - Elevated Cards: `#1a2235` / Hover: `#242d45`
  - Input Fields: `#0f1623`
- **Gaming Brand Accents**:
  - Primary Gaming Cyan: `#00d4ff` / Hover: `#00b8e6` (Electric blue for energy)
  - Secondary Gaming Purple: `#7c3aed` (For variety and depth)
  - Premium Gold: `#ffd700` / Light: `#ffe44d` / Dark: `#ccac00` (For premium elements)
  - Gaming Neon Green: `#00ff88` (Success/verified states)
  - Gaming Red: `#ff4757` (Alert states)
  - Gaming Orange: `#ff9f43` (Accent variations)
  - WhatsApp Green: `#25d366`
- **Text & Typography**:
  - Primary Text: `#ffffff` (Pure white for maximum contrast)
  - Secondary Text: `#b8c5d6` (Soft blue-gray)
  - Muted Text: `#7a8a9e` (Less important information)
  - Display Font: `'Outfit', sans-serif` (Weights: 700, 800, 900 for impact)
  - Body Font: `'Plus Jakarta Sans', sans-serif` (Weights: 500, 600, 700 for readability)
  - Numerics: `font-variant-numeric: tabular-nums` for all prices, specs, and counters.

### Elevation & Borders
- **Borders**: Gaming-focused borders with subtle cyan tint: `rgba(0, 212, 255, 0.3)` for active states
- **Shadows**:
  - `sm`: `0 2px 8px rgba(0, 0, 0, 0.5)`
  - `md`: `0 6px 20px rgba(0, 0, 0, 0.6)`
  - `lg`: `0 12px 36px rgba(0, 0, 0, 0.7)`
  - `glow-primary`: `0 0 20px rgba(0, 212, 255, 0.2)` (Gaming cyan glow)
  - `glow-gold`: `0 0 20px rgba(255, 215, 0, 0.2)` (Premium gold glow)
  - `glow-green`: `0 0 20px rgba(0, 255, 136, 0.2)` (Success glow)

---

## 3. Motion & Animation Standards
- **Standard Transitions**: `cubic-bezier(0.16, 1, 0.3, 1)` (Decelerated spring-feel, no jarring bounce).
- **Duration**: `150ms` for micro-interactions, `220ms` for standard transitions, `300ms` for major state changes.
- **Haptic Touch**: `transform: scale(0.97)` on `:active` for all buttons, chips, and cards.
- **Gaming Animations**: Subtle pulse effects on trust indicators (`gaming-pulse` keyframe), hover glow effects on interactive elements.

---

## 4. Gaming Shop Anti-Pattern Guardrails
1. **Never Use Generic Gradients**: Avoid purple-to-blue linear gradients. Use solid gaming colors with subtle overlays.
2. **Never Use Template Language**: Replace "Featured," "Discover," "Explore" with authentic retail language like "Hot Sellers," "Shop by Category," "All Services."
3. **Always Use Uppercase for Impact**: Section headings and CTAs use uppercase with letter-spacing for gaming energy.
4. **Gaming-Focused Borders**: Use 2px borders with gaming cyan tint instead of subtle 1px borders.
5. **Touch Friendly**: All clickable buttons and selectable chips have a minimum dimension of `44x44px`.
6. **Authentic Messaging**: Use Nigerian context (Lagos references, WhatsApp-first, meetup safety) throughout.
