# 3D product scenes (three.js + React Three Fiber)

For the "spinning soda can" class of hero: a real 3D product the visitor scrolls through and
can grab. Template: `assets/3d/product-can.tsx` + `assets/3d/label.ts`. A full section using
it is `demos/motion-specimen/src/components/sections/plate-soda.tsx`.

**Earn it.** 2026's award work treats 3D as a **structural storytelling layer tied to scroll**,
not a floating trophy in the hero. One 3D moment per site, staged as entrance → hold →
exit. Fake depth with parallax everywhere else. Heavy WebGL costs INP and battery.

## Install (verified 2026-10-22)
```bash
npm i three@0.186.1 @react-three/fiber@9.8.2 @react-three/drei@10.7.9 && npm i -D @types/three@0.186.0
```
`@react-three/fiber` 9.8 peers on `react >=19 <19.4`. Check `npm view @react-three/fiber peerDependencies` if the
project's React is newer. `scaffold.sh --3d` installs these and copies the templates.

## Architecture
```
<section h-[400svh]>                      ← pinned scroll budget: ~1 screen per beat
  <div sticky top-0 h-svh>
    stage color layer (motion animate backgroundColor per beat)
    giant beat word behind (AnimatePresence popLayout, slides through)
    <div data-cursor="Spin" onPointer… touch-action: pan-y>  ← grab-to-spin
      <ProductCanScene progress={scrollYProgress} flavor={beat} spin={spinStep} reduce active />
    copy card + beat chips + segment progress bars
```
- Load the scene with `next/dynamic(() => import(...), { ssr: false })`, so three.js stays out of
  the server bundle and off the critical path.
- `frameloop={reduce ? "demand" : active ? "always" : "never"}`, where `active` = `useInView(section)`
  with a ~200px margin. The scene stops rendering offscreen.
- Beats come from `useMotionValueEvent(scrollYProgress, "change")` → `Math.floor(v * N)`. The
  chips scroll to the middle of their third. Under reduced motion, the section is normal height
  and the chips set the beat directly.

## Modeling without model files
- **Body:** `LatheGeometry` from a 2D profile (radius, height): bottom dome → foot → wall →
  shoulder → neck → rim → recessed lid. 128 segments.
- **Label:** an open `CylinderGeometry` at radius `+0.004` over the wall band, with a
  `CanvasTexture` drawn at runtime (`label.ts`): `colorSpace = SRGBColorSpace`,
  `wrapS = RepeatWrapping`, anisotropy up to 8. Print the art twice around the circumference so
  the wordmark faces the viewer from either side.
- **Wait for `document.fonts.ready`** before drawing the label, or it prints in fallback fonts.
  Read the families from `getComputedStyle(html).getPropertyValue("--font-display")`.
- Swap labels by setting `material.map` and `needsUpdate` at the midpoint of a flip, so the
  change happens while the label faces away.

## Materials & light (no network)
- **Studio lighting:** `<Environment resolution={256}>` with **`<Lightformer>`s** and a
  **gray `<color attach="background">`**. Drei's preset HDRs are fetched from a CDN; Lightformers
  are generated locally.
- **Polished metal reflects its environment.** With a black environment, aluminum renders
  **black** (this happened). Give the env a mid-gray background, `metalness≈0.92`,
  `roughness≈0.26`.
- **Label:** `meshPhysicalMaterial` with `clearcoat: 1`, `clearcoatRoughness ≈ 0.12`,
  `metalness ≈ 0.35` (a printed-can sheen).
- **Grounding:** `<ContactShadows>`, with `frames={reduce ? 1 : Infinity}`.

## Choreography (inside `useFrame`)
- `rotation.y = progress * 5π + spin(dt) + t * 0.25`. Scroll is the main driver, with a slow
  idle drift on top.
- **Beat change:** one eased full turn on X over ~0.75s, with a sin squash (scale y −8%) at
  the midpoint.
- **Pointer tilt:** lerp `rotation.x/z` toward `state.pointer.y/x * 0.2–0.25`, plus an idle
  bob of `sin(t * 1.3) * 0.08`.
- **Drag momentum:** the parent owns `{ offset, vel }` and passes `spin(dt)`, which integrates
  and decays `vel *= 0.04^dt` (a can spun on a table). Don't mutate a prop or ref object inside
  the scene; React-Compiler lint rejects it.
- **Particles:** use one `instancedMesh` (70 spheres) for bubbles or dust. Seed the layout in a
  module-level function so it's deterministic and lint-clean.

## Mobile
Portrait screens overfill. Use a declarative camera: `<PerspectiveCamera makeDefault fov={32}
position={[0, aspect < 0.7 ? -0.85 : 0.2, aspect < 0.7 ? 14.5 : aspect < 1.1 ? 11 : 9]} />`,
computed from `useThree(s => s.size)`. Mutating `camera.position` in an effect fails lint.
Hide secondary copy below `sm` so the card doesn't cover the product.

## Reduced motion
Show a still hero angle: no spin, no flip, no bubble drift, `frameloop="demand"` and
`invalidate()` on beat change. The section is normal height (no pin), and the chips swap beats
instantly.

## Verify
- Software-GL headless needs `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader`.
- Capture beats at progress 0.15, 0.5 and 0.85, a 390×844 phone viewport, and reduced motion.
- Record a video (`recordVideo`). Stills can't show spin, and software GL renders slowly, so
  speed the video up with `ffmpeg -vf setpts=PTS/3.8`.
