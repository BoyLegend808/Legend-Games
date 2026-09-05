---
name: impeccable
description: Design guidance and steering commands for AI coding agents. Provides 23 design commands, durable product/design contexts (PRODUCT.md / DESIGN.md), 61 deterministic detector rules, and anti-pattern enforcement to produce world-class frontend craft.
---

# Impeccable Design System & Steering Skill

Impeccable is a comprehensive design language framework designed to eliminate generic AI frontend tropes (e.g., Inter default font, cards nested in cards, un-tinted grays, purple-blue SaaS gradients) and steer agents toward bespoke, state-of-the-art UI/UX craft.

---

## 1. Core Architecture & Workflow

1. **`PRODUCT.md`**: Durable product truth. Contains target audience, core job-to-be-done, constraints, voice, business model, and non-negotiables.
2. **`DESIGN.md`**: Visual design system specification. Contains color tokens, typography scales, elevation layers, component patterns, motion rules, and anti-patterns.
3. **The 23 Steering Commands**: A structured design vocabulary used to iteratively shape, audit, and polish user interfaces.

---

## 2. The 23 Impeccable Commands

| Command | Purpose | Action Summary |
|---------|---------|----------------|
| `/impeccable init` | Initial Setup | Inspect project, document durable product truth in `PRODUCT.md`, and establish `DESIGN.md`. |
| `/impeccable craft` | Full Flow | End-to-end design thinking: shape UX, establish visual system, implement UI, audit, and polish. |
| `/impeccable document` | Design Specs | Extract and document existing project design tokens into `DESIGN.md`. |
| `/impeccable extract` | Componentize | Pull reusable components, utility patterns, and tokens into shared design modules. |
| `/impeccable shape` | UX Architecture | Plan user journeys, state hierarchies, information architecture, and layout before coding. |
| `/impeccable critique` | UX Review | Evaluate visual hierarchy, clarity, emotional resonance, cognitive load, and feedback loops. |
| `/impeccable audit` | Quality Checks | Run deterministic checks for accessibility (WCAG AA/AAA), responsiveness, contrast, and layout stability. |
| `/impeccable polish` | Final Pass | Micro-interaction tuning, border refinement, sub-pixel alignments, and shipping readiness. |
| `/impeccable bolder` | Amplify Impact | Turn up visual excitement, contrast, typography scale, depth, and distinctive identity. |
| `/impeccable quieter` | Tone Down | Reduce visual noise, soften harsh borders, declutter excessive badges, and increase whitespace. |
| `/impeccable distill` | Essentialize | Strip unnecessary elements down to the core essence; remove fluff and friction. |
| `/impeccable harden` | Edge Cases | Handle empty states, error states, network disconnects, text overflow, i18n, and haptic feedback. |
| `/impeccable onboard` | Activation | Design intuitive first-run flows, progressive disclosure, and contextual hints. |
| `/impeccable animate` | Purposeful Motion | Implement physics-inspired transitions, entrance animations, and micro-interactions with custom cubic-beziers. |
| `/impeccable colorize` | Color Strategy | Build curated, tinted palettes with clear functional semantic meanings. Avoid flat primaries. |
| `/impeccable typeset` | Typography | Set up characterful font pairings, modular scale, line-height ratios, and tabular number alignment. |
| `/impeccable layout` | Spatial Rhythm | Fix grid alignment, consistent 4/8pt spacing scale, and optical balance across viewports. |
| `/impeccable delight` | Micro-Joy | Add tasteful interactive moments, completion celebrations, tactile sound/visual cues. |
| `/impeccable overdrive` | Luxe Effects | Add advanced visual flair (glassmorphism, subtle glows, canvas/ambient effects) without harming performance. |
| `/impeccable clarify` | UX Copywriting | Rewrite ambiguous labels, error messages, and microcopy for maximum clarity and human tone. |
| `/impeccable adapt` | Responsive | Optimize touch targets (>=44px), thumb zones, breakpoints (mobile, tablet, desktop, foldables). |
| `/impeccable optimize` | Performance | Streamline DOM size, CSS selector performance, font loading, layout thrashing, and image assets. |
| `/impeccable live` | Visual Iteration | Explore visual variants in real-time browser preview. |

---

## 3. Strict Anti-Patterns (The "Never Do" List)

1. **Font Defaults**: Never use generic default fonts (e.g. raw Arial, raw Times New Roman, uncurated Inter for everything). Pair characterful display typefaces (`Outfit`, `Syne`, `Space Grotesk`, `Cinzel`, `Clash Display`) with legible body typefaces (`Plus Jakarta Sans`, `Geist`, `Satoshi`).
2. **Card Nesting Fatigue**: Never nest card containers inside other card containers with matching border weights. Use surface tints, subtle dividers, or transparent layered fills instead.
3. **Low Contrast on Colors**: Never use light gray or muted text directly over colored backgrounds. Maintain strict WCAG AAA / AA contrast ratios.
4. **Untinted Grays & Pure Blacks**: Always tint dark surfaces and shadows with subtle hues of the brand color (e.g., midnight blue, slate indigo, deep obsidian).
5. **Dated Animation Easing**: Never use generic bounce, elastic, or linear animation curves. Always use refined cubic-beziers (e.g., `cubic-bezier(0.16, 1, 0.3, 1)` for decelerate/enter and `cubic-bezier(0.4, 0, 0.2, 1)` for standard transitions).
6. **Tiny Touch Targets**: Interactive mobile elements must always provide at least `44x44px` of clickable/tappable surface area.
7. **Generic Icons**: Don't drop raw, un-styled icons into rounded-square gray tiles above every headline. Style icons intentionally as integral parts of the visual hierarchy.

---

## 4. Deterministic Detector Rules (61 Quality Checks)

When reviewing or building UI components, verify against these key criteria:
- **Contrast & Visibility**: Text against background >= 4.5:1 (>= 3:1 for large text).
- **Hierarchy**: Clear visual distinction between `h1`, `h2`, `h3`, labels, and body text.
- **Focus Rings**: Accessible, high-contrast `:focus-visible` outlines on all interactive elements.
- **Form States**: Clear `:hover`, `:active`, `:focus`, `:disabled`, and `error` states for all controls.
- **Number Alignment**: Use `font-variant-numeric: tabular-nums` for price lists, countdowns, and data tables.
- **Tap Feedback**: Active transform feedback (e.g. `transform: scale(0.97)`) on mobile tap interactions.
- **Spacing Scale**: Adhere to consistent 4px/8px modular units (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`).
- **Empty & Loading States**: Every dynamic list or section must have a dedicated empty state and skeleton loader.
