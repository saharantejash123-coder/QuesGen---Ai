# QuesGen — Design System & Motion Spec

The shipping equivalent of a Figma design-system page. All tokens live in `src/index.css`
(`:root`). Components are React + scoped CSS. This doc is the single source of truth.

---

## 1. Foundation tokens

### Color (WCAG-checked)
| Token | Light | Dark | Notes |
|---|---|---|---|
| `--bg` | `#F8FAFF` | `#030712` | page background |
| `--card-bg` | `#FFFFFF` | `#0B1220` | surfaces |
| `--text` | `#0A0F1E` | `#EEF2FF` | primary — ~16:1 ✓ |
| `--text2` | `#3D4966` | `#94A3B8` | secondary — ~8:1 ✓ |
| `--text3` | **`#586A8C`** | `#64748B` | muted — **fixed to ≈4.8:1 (was 3.8:1, failed AA)** |
| accent | `#2354F4` → `#7C3AED` | same | brand gradient |

**Audit fix:** `--text3` was `#6B7A9F` (≈3.8:1 on `--bg`) — **failed WCAG AA** for small text. Darkened to `#586A8C` (≈4.8:1, passes AA).

### Spacing — 8pt grid
`--s-1: 4` · `--s-2: 8` · `--s-3: 12` · `--s-4: 16` · `--s-5: 24` · `--s-6: 32` · `--s-7: 48` · `--s-8: 64` · `--s-9: 96` · `--s-10: 128` (px). Use these instead of ad-hoc rem values.

### Type scale — 1.25 ratio
`--fs-xs .75` · `--fs-sm .875` · `--fs-base 1` · `--fs-md 1.125` · `--fs-lg 1.5` · `--fs-xl 2` · `--fs-2xl 2.75` · `--fs-3xl 3.5` (rem). Line-heights: `--lh-tight 1.15` (display), `--lh-snug 1.35` (headings), `--lh-normal 1.6` (body). Pairing: **Instrument Serif** (display) + **DM Sans** (UI/body) + **JetBrains Mono** (data).

### Motion tokens
| Token | Value | Use |
|---|---|---|
| `--dur-fast` | `0.15s` | hover/focus tints |
| `--dur-base` | `0.25s` | buttons, inputs, dropdowns |
| `--dur-slow` | `0.45s` | section reveals, modals |
| `--ease-out` | `cubic-bezier(.22,1,.36,1)` | enters / reveals |
| `--ease-in-out` | `cubic-bezier(.65,.05,.36,1)` | morphs |
| `--ease-spring` | `cubic-bezier(.34,1.56,.64,1)` | playful pops |

---

## 2. Components

### Buttons (`.btn-p` primary · `.btn-g` ghost · `.btn-a` amber)
- **Hover:** `translateY(-2px)` + deeper shadow + diagonal sheen sweep (`::after`).
- **Press (`:active`):** `scale(0.97)` — tactile feedback (added).
- **Focus:** keyboard ring (see a11y).

### Inputs / selects / textarea
- **Focus:** smooth glow `box-shadow 0 0 0 3px rgba(35,84,244,.18)` + accent border, `--dur-base --ease-out`.

### Cards
- Glass (`.lp-glass`), gradient-border-on-hover (`.lp-gborder`), cursor spotlight (`.lp-spot`), 3D tilt (`.tcw`), morphing profile (`.pcw`), module coverflow (carousel).

---

## 3. Animation specs (trigger · easing · duration)
| Animation | Trigger | Easing | Duration |
|---|---|---|---|
| Button hover lift + sheen | hover | ease-out / `left .5s` | 0.25s |
| Button press | active | — | instant |
| Input focus glow | focus-visible | ease-out | 0.25s |
| Section scroll reveal (`.reveal`→`.reveal-in`) | in-view (IO) | ease-out | 0.45s |
| Skeleton shimmer (`.skeleton`) | mount | ease-in-out loop | 1.4s |
| Hero aurora drift | always | ease-in-out loop | 18–26s |
| Logo orbit rings | always | linear loop | 9–32s |
| Dropdown / modal (framer `AnimatePresence`) | open/close | spring | ~0.15–0.2s |
| Module carousel | autoplay | linear (continuous) | — |

All motion is `transform`/`opacity` (GPU) and disabled under `prefers-reduced-motion`.

---

## 4. UX audit — findings & rationale
1. **Contrast (a11y):** muted text failed AA → darkened `--text3`. *Why: legibility + compliance.*
2. **Type scale:** ad-hoc per-section sizes → fixed scale tokens. *Why: visual rhythm & consistency.*
3. **Spacing:** mixed rem values → 8pt scale. *Why: predictable, aligned layouts.*
4. **Keyboard focus:** none visible → global `:focus-visible` ring. *Why: keyboard accessibility.*
5. **CTA hierarchy (pending):** hero has two equal buttons → make one clearly primary.
6. **Navigation (pending):** "More" dropdown hides destinations → flatten where possible.
7. **Components (in progress):** ad-hoc inline styles → shared tokens/classes with states.

---

## 5. Rollout status
- [x] Foundation: tokens, AA contrast, focus rings, skeleton, reveal, button press, input focus
- [x] Landing hero: aurora bg, 3D logo, glass chips, gradient stats
- [ ] Landing: CTA hierarchy, section rhythm, scroll reveals everywhere
- [ ] Student dashboard · Teacher dashboard · School/Admin
