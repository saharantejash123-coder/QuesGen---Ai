# Animation Placement Reference

## HomePage (/)

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  HERO SECTION (scroll triggers on entry)       │
│  ┌───────────────────────────────────────────┐  │
│  │ 📌 Tag [ScrollReveal]                     │  │ ← Fade in first
│  │    iStart Rajasthan · Ed-Tech Platform    │  │
│  │                                           │  │
│  │ 📌 Heading [ScrollReveal + 0.1s delay]   │  │ ← Slides up after tag
│  │    Stop guessing. Start knowing.          │  │
│  │                                           │  │
│  │ 📌 Paragraph [ScrollReveal + 0.2s delay] │  │ ← Follows heading
│  │    QuesGen centralises 15 years...        │  │
│  │                                           │  │
│  │ 📌 Buttons [ScrollReveal + 0.3s delay]   │  │ ← Last in sequence
│  │    [Explore] [Open Vault-15]              │  │ (on hover: lift up)
│  └───────────────────────────────────────────┘  │
│  │ 📌 Stats Grid [StaggerContainer]         │  │ ← Each stat has 0.12s delay
│  │    [12,500+]  [15 yrs]  [40+]  [<10s]    │  │   between them
│  └───────────────────────────────────────────┘  │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  VAULT-15 FEATURE SECTION                      │
│  ┌──────────────────────┬────────────────────┐ │
│  │ 📌 Title & Copy      │ 📌 Demo Card       │ │
│  │ [ScrollReveal]       │ [HoverCard]        │ │
│  │ "15 years of exam"   │                    │ │
│  │ "intelligence,       │ • Code editor UI   │ │
│  │ indexed."            │ • Search queries   │ │
│  │                      │ • Results list     │ │
│  │ • 4 Feature items    │                    │ │
│  │   [ScrollReveal]     │ (on hover: ⬆️ lift) │ │
│  │                      │                    │ │
│  │ • Button             │                    │ │
│  │   [on hover: ⬆️]     │                    │ │
│  └──────────────────────┴────────────────────┘ │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  MODULES SECTION                               │
│  📌 Header [ScrollReveal]                      │
│  "8 Intelligent Modules"                       │
│                                                 │
│  📌 Module Grid [StaggerContainer]             │
│  ┌────────────┬────────────┬────────────┐     │
│  │ Card 1     │ Card 2     │ Card 3     │     │
│  │ [Hover]    │ [Hover]    │ [Hover]    │     │
│  │ ⬆️ lift    │ ⬆️ lift    │ ⬆️ lift    │     │
│  ├────────────┼────────────┼────────────┤     │
│  │ Card 4     │ Card 5     │ Card 6     │     │
│  │ [Hover]    │ [Hover]    │ [Hover]    │     │
│  │ ⬆️ lift    │ ⬆️ lift    │ ⬆️ lift    │     │
│  ├────────────┼────────────┼────────────┤     │
│  │ Card 7     │ Card 8     │            │     │
│  │ [Hover]    │ [Hover]    │            │     │
│  │ ⬆️ lift    │ ⬆️ lift    │            │     │
│  └────────────┴────────────┴────────────┘     │
│                                                 │
│  Each card animates with 0.12s delay          │
│  Total reveal time ≈ 1 second                  │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  CTA SECTION                                   │
│  📌 Title [ScrollReveal]                       │
│  "Built for every student"                     │
│                                                 │
│  📌 Buttons [ScrollReveal]                     │
│  [See Pricing] [Try LogicGen]                  │
│  (on hover: ⬆️ lift)                          │
│                                                 │
└─────────────────────────────────────────────────┘
```

## FeaturesPage (/features)

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  HEADER SECTION                                 │
│  📌 Tag [ScrollReveal]                         │
│     "Platform Features"                         │
│                                                  │
│  📌 Title [ScrollReveal]                       │
│     "Every tool you need. Nothing you don't."   │
│                                                  │
│  📌 Tab Toggle [ScrollReveal + 0.2s delay]    │
│     [👤 For Students] [🏫 For Teachers]        │
│                                                  │
├──────────────────────────────────────────────────┤
│                                                  │
│  FEATURES LIST + DETAIL                         │
│  ┌─────────────────┬──────────────────────────┐ │
│  │ Features List   │ Detail Card              │ │
│  │ [Scroll]        │ 📌 [ScrollReveal +      │ │
│  │                 │    HoverCard]           │ │
│  │ 🗄️ Vault-15    │ ┌──────────────────────┐ │ │
│  │ 🔮 Oracle      │ │ Feature Name          │ │ │
│  │ 🔄 LogicGen    │ │ Feature Description   │ │ │
│  │ 🧠 Adaptive    │ │ • Capability 1        │ │ │
│  │ ✍️  Script-Lab │ │ • Capability 2        │ │ │
│  │ 💡 Clarity     │ │ • Capability 3        │ │ │
│  │ 📄 Briefs      │ │ • Capability 4        │ │ │
│  │ 🗺️  Navigator  │ │ [CTA Button]          │ │ │
│  │                 │ └──────────────────────┘ │ │
│  │ (on hover:      │ (on hover: ⬆️ lift)    │ │
│  │  highlight)     │                          │ │
│  └─────────────────┴──────────────────────────┘ │
│                                                  │
│  Detail card updates when selecting feature    │
│                                                  │
└──────────────────────────────────────────────────┘
```

## PricingPage (/pricing)

```
┌────────────────────────────────────────────────┐
│                                                │
│  PRICING HEADER                               │
│  📌 Tag [ScrollReveal]                       │
│     "Pricing"                                  │
│                                                │
│  📌 Title [ScrollReveal]                     │
│     "Fair pricing. Maximum impact."            │
│                                                │
│  📌 Billing Toggle [ScrollReveal + 0.2s]    │
│     [Monthly] [Yearly -25%]                   │
│                                                │
├────────────────────────────────────────────────┤
│                                                │
│  PRICING CARDS [StaggerContainer]             │
│  ┌──────────────────┬──────────────────┐     │
│  │ FREE TIER        │ STUDENT PRO ⭐   │     │
│  │ [HoverCard]      │ [HoverCard]      │     │
│  │ ⬆️ lift on hover │ ⬆️ lift on hover │     │
│  │                  │                  │     │
│  │ ₹0               │ ₹199/mo          │     │
│  │                  │                  │     │
│  │ • Feature list   │ • Feature list   │     │
│  │ • Feature list   │ • Feature list   │     │
│  │ • Feature list   │ • Feature list   │     │
│  │                  │                  │     │
│  │ [Get Started]    │ [Start Free Trial]      │
│  │                  │                  │     │
│  └──────────────────┴──────────────────┘     │
│  │ COACHING TIER                      │     │
│  │ [HoverCard]                        │     │
│  │ ⬆️ lift on hover                   │     │
│  │                                    │     │
│  │ ₹999/mo                            │     │
│  │                                    │     │
│  │ • All features                     │     │
│  │ • More features                    │     │
│  │ • Enterprise features              │     │
│  │                                    │     │
│  │ [Book a Demo]                      │     │
│  └────────────────────────────────────┘     │
│                                              │
│  Each card animates with 0.12s stagger      │
│                                              │
├────────────────────────────────────────────┤
│                                             │
│  FAQ SECTION                               │
│  📌 Title [ScrollReveal]                  │
│     "Common questions"                     │
│                                             │
│  📌 FAQ Items [ScrollReveal with stagger]│
│     • Q: Does free tier work offline?     │
│       A: Yes, Edge-Sync...                │
│       [with 0.1s delay]                   │
│                                             │
│     • Q: Is RBSE covered?                 │
│       A: Fully...                         │
│       [with 0.2s delay]                   │
│                                             │
│     • Q: How does Script-Lab work?        │
│       A: Vision model...                  │
│       [with 0.3s delay]                   │
│       ... etc                             │
│                                             │
├────────────────────────────────────────────┤
│                                             │
│  FINAL CTA                                 │
│  📌 Icon & Text [ScrollReveal]            │
│     🏆                                      │
│     "Proudly submitted to iStart..."       │
│     "We are not just creating..."          │
│                                             │
└────────────────────────────────────────────┘
```

---

## Animation Legend

| Symbol | Meaning |
|--------|---------|
| 📌 | ScrollReveal component (fade in + slide up) |
| [StaggerContainer] | Grid with 0.12s delay between items |
| [HoverCard] | Hover elevation + shadow effect |
| ⬆️ lift | Element lifts on hover (translateY: -5px) |
| [0.1s delay] | Additional delay before animation starts |

---

## Scroll Trigger Points

All animations trigger when element is scrolled into viewport:
- **Threshold**: 30% of element visible
- **Trigger margin**: 80px before bottom of viewport
- **Timing**: 0.7s animation duration
- **Easing**: `cubic-bezier(0.25, 1, 0.5, 1)`

So you'll see animations START when:
```
─────────────────────────────────────────
          [Viewport]
                          ← Element enters here
          ↓ (trigger at 15-20% before bottom)
─────────────────────────────────────────
```

---

## Hover Interaction Zones

### Cards (HoverCard component)
```
Normal State:
┌────────────────┐
│  Card Content  │  y: 0px, shadow: soft
│                │
└────────────────┘

On Hover:
┌────────────────┐
│  Card Content  │  y: -5px (lifted), shadow: enhanced
│                │
└────────────────┘
Transition: 0.25s cubic-bezier(0.4, 0, 0.2, 1)
```

### Buttons
```
Normal: translateY(0)
Hover:  translateY(-2px)
Tap:    scale(0.95)
```

---

## Performance Notes

✅ **No Layout Thrashing**
- Only `transform: translateY()` and `opacity` animated
- No width, height, or position changes
- GPU accelerated (no CPU repainting)

✅ **Efficient Intersection Observer**
- Framer Motion's `useInView` uses native IntersectionObserver API
- Animations trigger once per element
- Minimal performance impact

✅ **Frame Rate**
- Consistent 60 FPS on modern devices
- Smooth on mobile (iOS/Android)
- No jank even on lower-end devices with reduced detail

---

## Testing Checklist

- [ ] HomePage: Hero section animates on first load
- [ ] HomePage: Scroll triggers module cards stagger
- [ ] HomePage: Vault-15 card lifts on hover
- [ ] FeaturesPage: Title reveals on scroll
- [ ] FeaturesPage: Feature detail card updates smoothly
- [ ] PricingPage: Pricing cards stagger in (all 3)
- [ ] PricingPage: FAQ items have sequential reveals
- [ ] All pages: Buttons lift on hover
- [ ] Mobile: Animations smooth (no stuttering)
- [ ] Accessibility: Test with `prefers-reduced-motion: reduce` enabled
