# What award-level motion looks like in 2026

Research notes (October 2026). These guide *which* effects to reach for. Treat named site and
award claims as indicative: the sources are agency blogs and trend reports, not Awwwards
itself.

## Patterns that are winning
- **Scrollytelling with staged beats.** Pinned sections where each beat has an **entrance,
  hold and exit** (Shopify Editions '26). Scroll is the timeline. → `useScroll` on a tall
  section + sticky stage, or CSS `animation-timeline`.
- **3D as structure, not a trophy.** The single floating object in the hero is reading as
  dated. Winners tie 3D to scroll and narrative instead:
  - **Camera on Z:** the camera moves through depth instead of layers sliding past (Lusion's
    Oryzo)
  - **Rooms:** scroll moves *between rooms*, not down a page (Cartier Watches & Wonders by
    Immersive Garden: Three.js + GLSL + GSAP + Lenis + Web Audio)
  - **Cursor reveals:** the cursor uncovers detail in lighting and geometry (Hubtown by
    Unseen Studio)
  → `references/3d-product.md`
- **Kinetic and variable typography.** Split-text staggers plus animating variable axes
  (`font-variation-settings`), and particle-dispersed type that scatters and re-forms. Keep
  split text accessible (an `aria-label` on the whole). → `fx/text.tsx`, `fx/variable-type.tsx`
- **Native CSS scroll-driven animation** is Baseline in all major browsers and runs off the
  main thread. It covers the simple ~80% (reveals, progress, rules); keep JS for the complex 20%.
- **View Transitions** (same-document) are Baseline: Chrome/Edge 111, Safari 18, Firefox 144.
  Use them for theme or palette swaps and route changes. → `palette/`
- **Bento reveals.** One trigger on the grid; children staggered at ~0.08s.
- **Cursor micro-interactions,** gated behind a pointer check so touch devices don't load them.
- **SVG line drawing** and motion paths. Keep the paths simple.

## Performance is part of the judging
- Core Web Vitals, especially **INP < 200ms**: one report cites 43% of sites failing it. Heavy
  main-thread animation during interaction is what fails it.
- Animate transform and opacity only. Lazy-load animation code per page. Save WebGL for **one**
  moment.

## Fading out
- Entrance animations on every element
- Scroll-hijacking smooth scroll (weighted, light smoothing is fine; taking over is not)
- Decorative preloaders that delay content
- Hero videos as the default
- Motion that stutters during interaction

## Tooling notes
- GSAP has been free since April 2025, including the former Club plugins (SplitText,
  ScrollSmoother, DrawSVG, MotionPath). This skill stays on Motion (one clock); flowy maps
  GSAP recipes onto Motion.
- WebGPU is arriving: Three.js `WebGPURenderer` with a WebGL fallback, and shaders written in
  TSL (Three Shading Language). Use it when the effect needs compute; WebGL is still fine for
  marketing pages.

## Sources
- [Best Three.js Websites 2026: 8 Sites + Techniques (Utsubo)](https://www.utsubo.com/blog/best-threejs-websites-2026)
- [Web Animation Trends 2026: The Complete Report (MotionKit)](https://motionkit.io/blog/web-animation-trends-2026)
- [The Best WebGL & Interactive 3D Agencies in 2026](https://www.psychoactive.co.nz/content-hub/best-webgl-interactive-3d-agencies)
- [Best Website Design Examples 2026](https://ezeegrowth.com/blog/best-website-design-examples/)
- [Web design trends for 2026 (Envato)](https://elements.envato.com/learn/web-design-trends)
- [Top Web Design Trends for 2026 (Figma)](https://www.figma.com/resource-library/web-design-trends/)
- [What's new in view transitions (Chrome, 2025)](https://developer.chrome.com/blog/view-transitions-in-2025)
- [New to the web platform in October (web.dev)](https://web.dev/blog/web-platform-10-2025)
