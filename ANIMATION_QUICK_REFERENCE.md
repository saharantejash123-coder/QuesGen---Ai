# Animation System - Quick Reference Guide

## Animation Wrappers Location
```
src/components/animations/
├── ScrollReveal.jsx          # Scroll-triggered fade + slide up
├── StaggerContainer.jsx      # Grid stagger animation container
├── HoverCard.jsx             # Hover elevation + shadow effects
└── AnimatedButton.jsx        # Button with hover/tap feedback

src/utils/
└── animationConfig.js        # Central animation configuration
```

## Pattern 1: Scroll-Triggered Section Reveal
When you want a section to fade in and slide up when scrolled into view:

```jsx
import ScrollReveal from '@/components/animations/ScrollReveal';

<ScrollReveal>
  <section>
    <h2>This will fade in and slide up</h2>
  </section>
</ScrollReveal>

// With delay for staggered effect:
<ScrollReveal delay={0.1}>
  <p>This appears 0.1s after the previous element</p>
</ScrollReveal>
```

## Pattern 2: Staggered Grid/Cards
When you have a grid of cards that should animate in sequentially:

```jsx
import StaggerContainer from '@/components/animations/StaggerContainer';

<StaggerContainer className="g3">
  {items.map((item) => (
    <div key={item.id} className="card">
      {item.content}
    </div>
  ))}
</StaggerContainer>

// Each child animates with 0.12s delay between them
```

## Pattern 3: Interactive Cards with Hover
Cards that lift up and gain shadow on hover:

```jsx
import HoverCard from '@/components/animations/HoverCard';

<HoverCard 
  className="card" 
  onClick={handleCardClick}
  style={{ padding: '1.5rem' }}
>
  <h3>Card Title</h3>
  <p>Card content here</p>
</HoverCard>
```

## Pattern 4: Animated Buttons
Buttons with hover lift and tap feedback:

```jsx
import AnimatedButton from '@/components/animations/AnimatedButton';

<AnimatedButton 
  label="Click Me"
  onClick={handleClick}
  variant="primary"  // 'primary' | 'secondary' | 'amber'
/>

// Or use standard HTML button with whileHover prop
<button className="btn-p">Standard Button</button>
```

## Pattern 5: Complex Layout Animation
Combining multiple animation patterns:

```jsx
import ScrollReveal from '@/components/animations/ScrollReveal';
import StaggerContainer from '@/components/animations/StaggerContainer';
import HoverCard from '@/components/animations/HoverCard';

<section style={{ padding: '4rem 5%' }}>
  <ScrollReveal>
    <h2>Our Features</h2>
  </ScrollReveal>
  
  <StaggerContainer className="g3">
    {features.map((feature) => (
      <HoverCard key={feature.id} className="card">
        <h3>{feature.name}</h3>
        <p>{feature.description}</p>
      </HoverCard>
    ))}
  </StaggerContainer>
</section>
```

## Animation Configuration
All animations are configured in `src/utils/animationConfig.js`:

```javascript
// Trigger settings (when scroll reveals happen)
scrollAnimationConfig = {
  threshold: 0.15,           // 15% visible
  margin: "0px 0px -80px 0px" // 80px before bottom
}

// Easing curves
easings = {
  smooth: [0.25, 1, 0.5, 1],  // Main animation curve
  easeOut: [0.16, 1, 0.3, 1],
  easeInOut: [0.4, 0, 0.2, 1]
}

// Stagger delay between items
staggerContainerVariants = {
  staggerChildren: 0.12  // 0.12s between each child
}
```

## Accessibility
All animations automatically disable for users with `prefers-reduced-motion: reduce`:
- Animations run instantly (0ms)
- Smooth scroll is disabled
- No visual impact on users with motion sensitivity

To test: Open DevTools → Settings → Rendering → "Emulate CSS media feature prefers-reduced-motion"

## Performance Notes
✅ Only animates `transform` and `opacity` properties
✅ No layout recalculations (GPU accelerated)
✅ Efficiently uses Intersection Observer API
✅ Each element animates only once (on first scroll into view)

## Real-World Examples from Updated Pages

### HomePage Example
```jsx
// Hero section with staggered elements
<div style={{ position: "relative", zIndex: 1, maxWidth: 860 }}>
  <ScrollReveal>
    <div className="tag">iStart Rajasthan · Ed-Tech Platform</div>
  </ScrollReveal>
  <ScrollReveal delay={0.1}>
    <h1>Stop guessing. Start knowing.</h1>
  </ScrollReveal>
  <ScrollReveal delay={0.2}>
    <p>QuesGen centralises 15 years...</p>
  </ScrollReveal>
</div>

// Staggered stats
<StaggerContainer className="fr">
  {stats.map((s, i) => (
    <div key={i}>{s.n} · {s.l}</div>
  ))}
</StaggerContainer>

// Module cards with hover
<StaggerContainer className="g3">
  {modules.map((m, i) => (
    <HoverCard key={i} className="card">
      {m.name}
    </HoverCard>
  ))}
</StaggerContainer>
```

### FeaturesPage Example
```jsx
// Header with animation
<ScrollReveal>
  <h1 className="st">Every tool you need. Nothing you don't.</h1>
</ScrollReveal>

// Feature detail card with hover
<ScrollReveal key={`${tab}-${sel}`}>
  <HoverCard className="card">
    {/* Feature content */}
  </HoverCard>
</ScrollReveal>
```

### PricingPage Example
```jsx
// Pricing cards with stagger and hover
<StaggerContainer className="g3">
  {tiers.map((t, i) => (
    <HoverCard key={i} style={{ borderRadius: 18 }}>
      {/* Pricing tier content */}
    </HoverCard>
  ))}
</StaggerContainer>

// FAQ with sequential delays
{faqs.map((f, i) => (
  <ScrollReveal key={i} delay={i * 0.1}>
    <FAQItem q={f.q} a={f.a} />
  </ScrollReveal>
))}
```

## Troubleshooting

**Animations not triggering?**
- Check if element is actually scrolling into view (use browser DevTools)
- Ensure component is wrapped in ScrollReveal or StaggerContainer
- Check console for errors with `prefersReducedMotion()` check

**Animations too fast/slow?**
- Adjust duration in animationConfig.js (default 0.7s)
- Modify staggerChildren value for grid animations (default 0.12s)

**Performance issues?**
- Ensure only using transform + opacity (not top, left, width, etc.)
- Use `will-change: transform;` CSS if needed (rarely)
- Profile with DevTools Performance tab

**Need custom animation?**
- Copy stagger/scroll variants from animationConfig.js
- Modify as needed and pass to component via `variants` prop
- Or create new variant in animationConfig.js for reuse
