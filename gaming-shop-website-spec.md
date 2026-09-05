# Gaming Shop Website — Full Build Specification

## Overview
Build a responsive, mobile-friendly website for a shop that sells PlayStation consoles (PS3, PS4, PS5), Xbox consoles, gaming laptops/PCs, controllers, headsets, and other gaming accessories. The shop also repairs consoles and installs games onto consoles, hard disks, and PCs.

The site is a **request/quote system, not a live checkout**. Customers build up an order (console + games + accessories + repair notes, etc.) and submit it as one request. The shop owner then follows up directly (via WhatsApp) to confirm final price, availability, and arrange a **neutral, safe meetup location** for handover (never home delivery — this is a firm requirement due to past safety incidents). No online payment processing is needed.

All prices are displayed in **Nigerian Naira (₦)**.

---

## 1. Console Sales (PS3, PS4, PS5, Xbox)

- Each console has a base listing with:
  - **Variant selector**: e.g. Slim, Fat, Pro (specs and prices differ per variant — show a short spec blurb per variant so customers understand price differences).
  - **Base price** shown clearly once variant is selected.
- **PS4 and PS5 only**: purchase automatically includes a **free copy of that year's FC (football/FIFA) game**, matching the current calendar year (e.g. purchased in 2026 → free FC26). This is included automatically, not a checkbox — the "current year" should be easy to update annually (ideally driven by system date or an easily editable setting).
- After variant selection, show a **games checklist** to add to the order, split into two categories:
  - **CD / physical**
  - **Installed / digital**
- Games checklist behavior:
  - List **all games the shop owner knows of**, even ones not currently in stock (he can source them from elsewhere). Do **not** label any game "unavailable" or "out of stock" — always show the full list neutrally. (Explicit decision: showing the game, even if not in stock, is better than hiding it, since it signals selection and can still be sourced.)
  - Include a **"Request a game not on this list"** option — free text field, optionally with a platform dropdown.
  - Prices update live as games are checked/unchecked.
- **Online-added vs. Offline-modded** toggle for installed games:
  - **Online-added**: legitimately installed, console/account can still go online (PSN), costs more per game.
  - **Offline-modded**: modded install, cheaper, but **no online play** (should show a clear warning to the customer about this limitation).
  - This choice affects **game pricing in the checklist**, not just the console price.
- This entire flow (variant → free FC bundle where applicable → games checklist → modded/unmodded pricing) applies to **PS3, PS4, PS5, and Xbox**, except the FC bundle (PS4/PS5 only).

## 2. Buy Game Disc Only (no console)

- Standalone section/page to purchase just a game CD/disc for PS4 or PS5, without buying a console.

## 3. PS4 Hard-Disk Game Loading (PS4-only feature — no other console supports this)

- Customer selects **disk purpose**: PS4 or PC (see Section 8 for PC).
- Customer selects **disk capacity** (1TB, 2TB, 3TB, etc.), each with its own price.
- Customer then selects games from a checklist to load onto the disk.
  - Each game has **two separate storage values**: one for PS4 and one for PC (these differ — e.g. a game might be 120GB on PS4 vs 150GB on PC — do not assume they're the same).
  - A **live storage meter** shows total storage used vs. disk capacity as games are checked.
  - The meter should **leave a buffer** and not allow filling to exactly 100% of stated capacity.
  - If adding a game would exceed the buffer/capacity, disable that game or show a warning, and **suggest upgrading to a larger disk size** as an easy next step.
  - Customers can uncheck/remove games at any time to free up space and choose others.

## 4. Repairs / Console Issues / Install Requests / Sell-Your-Console (Combined Form)

- A single form with a **dropdown to select request type**:
  - Repair (describe what's wrong with the console)
  - Install games onto an existing console
  - Sell a console to the shop
- For **selling a console**: include guiding fields — condition, accessories included, reason for selling, and (optionally) asking price. Use a simple **condition grading scale** (e.g. Like New / Good / Fair / For Parts) to speed up communication.
- Photo attachment should be supported on this form (helpful for both repairs and selling).
- When a repair is completed, the customer is **notified via WhatsApp** (manual, not necessarily automated).
- For sell requests, show an estimated response time (e.g. "we'll respond with an offer within X hours").

## 5. Gaming Equipment / Accessories Page

- General catalog page for controllers, headsets, and other accessories.

## 6. Gaming Laptops / PCs

- Shop also sells gaming laptops.
- Separate simple page listing **PC games and their prices**, for customers who already own a PC/laptop and want games installed in-shop. This is a browsable price list (with search/filter), not a checklist-with-cart — no console purchase attached.

## 7. Customized / Wrapped Consoles

- New product type: consoles with custom wraps/skins (e.g. a Spider-Man wrapped PS4).
- Can be offered as:
  - An **add-on** when buying a console (similar structure to the modded/unmodded add-on), or
  - A **standalone service** for customers who already own a console.
- Since this is a visual product, **include photos of available wrap designs** (this is one of the few areas where photos are explicitly wanted, even though general shop/trust photos were declined for now).

## 8. Bundle / Combo Deals

- Admin-managed section where the shop owner can create fixed bundles (e.g. "console + 2 games + controller") at a set price.
- Bundles must support specifying the **exact variant** they apply to (e.g. which console variant, modded vs. unmodded), so bundle pricing doesn't conflict with the rest of the pricing system.

## 9. Unified Order / Cart System

- Customers should be able to build **one combined order** covering multiple things at once — e.g. a console + games + an accessory + a repair note — instead of submitting several separate requests for one shop visit.
- Before final submission, show a **clear, itemized price breakdown** (base price, add-ons, games, disk, bundle discounts, etc.) so the multiple pricing factors (variant, modded status, free FC bundle, disk capacity, bundles) don't confuse the customer.
- On submission, generate an **order reference number** for tracking and follow-up.
- Prioritize an **easy-to-understand, easy-to-use UI** for this — this was explicitly emphasized as important.

## 10. Order Tracking (Customer-Facing)

- Simple order tracking system so customers (and the shop owner) can reference orders by ID during follow-up conversations.

## 11. "How It Works" Page

- Explains the overall process end-to-end: submit request → shop owner confirms price/availability via WhatsApp → arrange a neutral/safe meetup location → handover/payment. This should be spelled out clearly since it's not a standard checkout flow.

## 12. FAQ Page

- Cover repeat questions: difference between modded/unmodded, how delivery/meetup works, what "request a game" means, how disk loading works, etc.

## 13. Shareable Price List Page

- A clean, easy-to-share (or downloadable) page/document listing consoles, games, and accessory prices — useful for word-of-mouth sharing.

## 14. WhatsApp Integration

- Shop owner will run this through a **WhatsApp Business account**.
- Recommended approach: a **click-to-chat button** throughout the site (e.g. floating contact button) that opens WhatsApp with the shop's number pre-filled, optionally with a pre-written message template (e.g. "Hi, I'd like to order [item]"). This requires no special approval and fits the manual, request-based follow-up model.
- (Optional future upgrade: WhatsApp Business Cloud API for automated order/status messages — more setup overhead, not needed for v1.)

## 15. Admin-Side Features

- Section to manage **bundle/combo deals** and their prices.
- Simple **stats view**: which games/consoles are most requested, to inform stocking decisions.
- **Promo/discount banner** slot on the homepage for temporary deals, tied into the combo/bundle system.
- (Full admin price-editing panel for all products is on hold for now — not required in v1, but design the data structure so it can be added later without a rebuild.)

## Explicitly Out of Scope (for now)

- Real online checkout / payment processing (request/quote model only).
- Shop photos and customer review/testimonial sections.
- Marking games as "unavailable" when out of stock.
- Automated WhatsApp restock notifications ("notify me" feature).
- Bulk/reseller inquiry path.
- "Which console should I buy" recommendation filter.
- Home delivery (safety concern — meetup locations only, arranged via DM).

---

## Data Model Notes (for whoever builds this)

- **Games** need: name, platform(s) it's relevant to, PS4-specific storage size, PC-specific storage size (these differ — do not assume equal), price(s) for online-added vs. offline-modded where applicable, in-stock flag (internal use only — never shown to the customer as "unavailable").
- **Consoles** need: platform (PS3/PS4/PS5/Xbox), variant (Slim/Fat/Pro/etc.), base price, spec blurb per variant.
- **Disks** need: capacity options (1TB/2TB/3TB...), price per capacity, purpose (PS4 or PC).
- **Bundles** need: fixed contents, applicable variant/modded status, bundle price.
- **Orders** need: reference number, itemized contents, itemized price breakdown, status, timestamp, customer contact info.

---

## Technical Notes

- Fully **responsive/mobile-first** design — most customers likely browse on phones.
- Search/filter functionality on all game/price lists, since the catalog spans PS3/PS4/PS5/Xbox/PC.
- Currency: Naira (₦) throughout.
- No payment gateway integration required for v1.

---

## Appendix: Required Folder / Code Structure

The codebase must be organized **page-by-page**, with each page in its own folder containing its own HTML, CSS, and JS file (no single giant global file per type). Shared logic (cart, WhatsApp button, Naira formatting, nav/header/footer) goes in a `shared/` folder and is imported into each page rather than duplicated.

```
project-root/
│
├── home/
│   ├── home.html
│   ├── home.css
│   └── home.js
│
├── consoles/
│   ├── ps3/
│   │   ├── ps3.html
│   │   ├── ps3.css
│   │   └── ps3.js
│   ├── ps4/
│   │   ├── ps4.html
│   │   ├── ps4.css
│   │   └── ps4.js
│   ├── ps5/
│   │   ├── ps5.html
│   │   ├── ps5.css
│   │   └── ps5.js
│   └── xbox/
│       ├── xbox.html
│       ├── xbox.css
│       └── xbox.js
│
├── disk/
│   ├── disk.html
│   ├── disk.css
│   └── disk.js
│
├── discs-only/
│   ├── discs-only.html
│   ├── discs-only.css
│   └── discs-only.js
│
├── accessories/
│   ├── accessories.html
│   ├── accessories.css
│   └── accessories.js
│
├── pc-games/
│   ├── pc-games.html
│   ├── pc-games.css
│   └── pc-games.js
│
├── wraps/
│   ├── wraps.html
│   ├── wraps.css
│   └── wraps.js
│
├── request-form/          (repair / install / sell console — combined form)
│   ├── request-form.html
│   ├── request-form.css
│   └── request-form.js
│
├── how-it-works/
│   ├── how-it-works.html
│   ├── how-it-works.css
│   └── how-it-works.js
│
├── faq/
│   ├── faq.html
│   ├── faq.css
│   └── faq.js
│
├── price-list/
│   ├── price-list.html
│   ├── price-list.css
│   └── price-list.js
│
└── shared/
    ├── shared.css   (colors, fonts, buttons — reused across all pages)
    ├── shared.js    (cart logic, WhatsApp button, order reference generator, Naira formatting)
    └── nav.html     (shared header/footer, if reused across pages)
```

**Notes for the builder:**
- Each console folder (PS3/PS4/PS5/Xbox) follows the same internal pattern (variant selector, games checklist, modded/unmodded toggle) — consider having them share one underlying JS module with different data files, rather than fully duplicating logic across four near-identical files.
- Anything that repeats across pages (cart, WhatsApp button, price formatting, nav) belongs in `shared/` and gets imported — not copy-pasted — so a change like updating the WhatsApp number only needs to happen in one place.
