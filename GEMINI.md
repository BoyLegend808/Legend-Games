# Workspace Rules — Legend Games Design & Engineering

This project follows the **Impeccable Design System** standards for all frontend UI/UX architecture, typography, interactions, and aesthetic quality.

## Impeccable Design Directives

1. **Aesthetic Craft**:
   - Deliver high-fidelity, polished, and distinctive interfaces suited for gaming culture.
   - Pair powerhouse display titles (`Russo One`) and technical sub-headers/badges (`Chakra Petch`) with clean body typography (`Plus Jakarta Sans`).
   - Use tabular numbers (`font-variant-numeric: tabular-nums`) for currency (₦) and storage/spec meters.
   - Avoid generic AI SaaS tropes (no purple-to-blue linear default gradients, no raw untinted grays, no card nesting fatigue).

2. **Durable Context Sources**:
   - Refer to [`PRODUCT.md`](file:///c:/Users/HP/OneDrive/Documenten/Legends%20Codes/Legend%20Games/PRODUCT.md) for product truth, audience, constraints, and business logic.
   - Refer to [`DESIGN.md`](file:///c:/Users/HP/OneDrive/Documenten/Legends%20Codes/Legend%20Games/DESIGN.md) for design tokens, typography, component rules, and motion curves.

3. **Motion & Interaction**:
   - Use physics-informed cubic-bezier easing: `cubic-bezier(0.16, 1, 0.3, 1)` for entry/hover states.
   - Ensure tactile active feedback (`transform: scale(0.97)`) on touch targets.
   - All interactive touch targets must meet minimum `44x44px` dimensions.

4. **Product Truth & Non-Negotiables**:
   - Currency is always Nigerian Naira (**₦**).
   - This is a **request/quote system with direct WhatsApp confirmation and safe public handover meetups**, not an automated credit card gateway.
   - PS4 & PS5 purchases automatically include the current year's FC edition.
   - Modded/offline installs must display unambiguous disclaimers regarding PSN network restrictions.
