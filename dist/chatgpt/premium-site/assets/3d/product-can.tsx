"use client";

// The 3D can: lathe-turned aluminum body, a riso label band, lid and pull tab, lit by a
// procedural studio environment (Lightformers, so nothing is fetched at runtime).
// Scroll spins it; flavor changes flip it and re-print the label; drag adds spin with
// momentum; the pointer tilts it; bubbles rise around it.
import { ContactShadows, Environment, Lightformer, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { drawLabel, FLAVORS } from "./label";

const BODY_TOP = 1.45;
const BODY_BOTTOM = -1.45;

function useCanGeometry() {
  return useMemo(() => {
    // Profile (radius, height) from the bottom center up and back in to the lid.
    const pts = [
      [0, -1.7], [0.45, -1.73], [0.72, -1.84], [0.86, -1.85], [0.95, -1.8], [1.0, -1.66],
      [1.0, BODY_BOTTOM], [1.0, BODY_TOP], [0.98, 1.56], [0.9, 1.68], [0.83, 1.76],
      [0.84, 1.84], [0.82, 1.87], [0.78, 1.84], [0.76, 1.78], [0, 1.77],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const body = new THREE.LatheGeometry(pts, 128);
    const label = new THREE.CylinderGeometry(1.004, 1.004, BODY_TOP - BODY_BOTTOM, 128, 1, true);
    return { body, label };
  }, []);
}

function useLabelTextures() {
  const [textures, setTextures] = useState<THREE.CanvasTexture[] | null>(null);
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    let alive = true;
    const css = getComputedStyle(document.documentElement);
    const display = css.getPropertyValue("--font-display").trim() || "sans-serif";
    const mono = css.getPropertyValue("--font-mono").trim() || "monospace";
    // Wait for the web fonts so the label is printed in the real faces.
    document.fonts.ready.then(() => {
      if (!alive) return;
      setTextures(
        FLAVORS.map((f) => {
          const t = new THREE.CanvasTexture(drawLabel(f, display, mono));
          t.colorSpace = THREE.SRGBColorSpace;
          t.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
          t.wrapS = THREE.RepeatWrapping;
          return t;
        })
      );
    });
    return () => {
      alive = false;
    };
  }, [gl]);
  return textures;
}

/** Advances drag momentum by dt and returns the accumulated spin offset (owned by the parent). */
export type SpinStep = (dt: number) => number;

function Can({
  progress,
  flavor,
  spin,
  reduce,
}: {
  progress: MotionValue<number>;
  flavor: number;
  spin: SpinStep;
  reduce: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const spinner = useRef<THREE.Group>(null);
  const labelMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const { body, label } = useCanGeometry();
  const textures = useLabelTextures();
  const invalidate = useThree((s) => s.invalidate);
  const flip = useRef({ shown: flavor, t: 1 });

  useEffect(() => {
    if (reduce) {
      flip.current.shown = flavor; // instant swap, no flip
      invalidate();
    }
  }, [flavor, reduce, invalidate, textures]);

  useFrame((state, dt) => {
    const g = group.current;
    const s = spinner.current;
    if (!g || !s) return;
    const f = flip.current;

    if (reduce) {
      s.rotation.set(0, -0.55, 0);
      g.rotation.set(0.08, 0, -0.06);
    } else {
      // Flavor change: a quick flip around X; the label re-prints at the midpoint.
      if (flavor !== f.shown && f.t >= 1) f.t = 0;
      if (f.t < 1) {
        f.t = Math.min(1, f.t + dt / 0.75);
        if (f.t >= 0.5 && f.shown !== flavor) f.shown = flavor;
      }
      // One full eased turn around X, with a squash at the midpoint like a can flipped in hand.
      const t = f.t;
      const turn = t < 1 ? (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2) : 0;
      const flipEase = t < 1 ? Math.sin(t * Math.PI) : 0;

      const p = progress.get();
      s.rotation.y = p * Math.PI * 5 + spin(dt) + state.clock.elapsedTime * 0.25 - 0.5;
      s.rotation.x = turn * Math.PI * 2;
      const squash = 1 - flipEase * 0.08;
      s.scale.set(1 + flipEase * 0.04, squash, 1 + flipEase * 0.04);

      // Pointer tilt + idle float.
      const tx = state.pointer.y * 0.25 + 0.06;
      const tz = -state.pointer.x * 0.2 - 0.05;
      g.rotation.x += (tx - g.rotation.x) * Math.min(1, dt * 4);
      g.rotation.z += (tz - g.rotation.z) * Math.min(1, dt * 4);
      g.position.y = Math.sin(state.clock.elapsedTime * 1.3) * 0.08;
    }
    if (labelMat.current && textures) {
      const want = textures[f.shown];
      if (labelMat.current.map !== want) {
        labelMat.current.map = want;
        labelMat.current.needsUpdate = true;
      }
    }
  });

  return (
    <group ref={group}>
      <group ref={spinner}>
        <mesh geometry={body} castShadow>
          <meshStandardMaterial color="#e4e6ea" metalness={0.92} roughness={0.26} envMapIntensity={1.2} />
        </mesh>
        <mesh geometry={label}>
          <meshPhysicalMaterial
            ref={labelMat}
            color={textures ? "#ffffff" : FLAVORS[flavor].paper}
            metalness={0.35}
            roughness={0.32}
            clearcoat={1}
            clearcoatRoughness={0.12}
          />
        </mesh>
        {/* Pull tab */}
        <mesh position={[0.18, 1.79, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.17, 0.045, 12, 40]} />
          <meshStandardMaterial color="#c3c7ce" metalness={1} roughness={0.28} />
        </mesh>
        <mesh position={[-0.02, 1.785, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.32, 0.18, 0.03]} />
          <meshStandardMaterial color="#c3c7ce" metalness={1} roughness={0.28} />
        </mesh>
      </group>
    </group>
  );
}

const N = 70;
// Deterministic layout (seeded), so every visit pours the same glass.
function seedBubbles() {
  let s = 7;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: N }, () => ({
    a: rnd() * Math.PI * 2,
    r: 1.35 + rnd() * 1.6,
    y: rnd() * 6 - 3,
    v: 0.25 + rnd() * 0.6,
    s: 0.025 + rnd() * 0.06,
    w: rnd() * 6,
  }));
}

function Bubbles({ reduce }: { reduce: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const seeds = useRef(seedBubbles()).current;
  const m = useMemo(() => new THREE.Object3D(), []);
  useFrame((state, dt) => {
    const inst = ref.current;
    if (!inst) return;
    const t = state.clock.elapsedTime;
    seeds.forEach((b, i) => {
      if (!reduce) {
        b.y += b.v * dt;
        if (b.y > 3.2) b.y = -3;
      }
      m.position.set(Math.cos(b.a) * b.r + Math.sin(t * 1.5 + b.w) * 0.05, b.y, Math.sin(b.a) * b.r - 0.6);
      m.scale.setScalar(b.s);
      m.updateMatrix();
      inst.setMatrixAt(i, m.matrix);
    });
    inst.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, N]}>
      <sphereGeometry args={[1, 16, 12]} />
      <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.05} transparent opacity={0.55} />
    </instancedMesh>
  );
}

/** Dolly the camera back on portrait screens so the can never overfills a phone. */
function FitCamera() {
  const aspect = useThree((s) => s.size.width / s.size.height);
  const z = aspect < 0.7 ? 14.5 : aspect < 1.1 ? 11 : 9;
  return <PerspectiveCamera makeDefault fov={32} position={[0, aspect < 0.7 ? -0.85 : 0.2, z]} />;
}

export function ProductCanScene({
  progress,
  flavor,
  spin,
  reduce,
  active,
}: {
  progress: MotionValue<number>;
  flavor: number;
  spin: SpinStep;
  reduce: boolean;
  active: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={reduce ? "demand" : active ? "always" : "never"}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: "pan-y" }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} />
      <Environment resolution={256}>
        {/* Soft studio gray: polished aluminum mirrors its surroundings, so a black void reads as black metal. */}
        <color attach="background" args={["#8c9099"]} />
        <Lightformer form="rect" intensity={4} position={[0, 3, 4]} scale={[8, 1.4, 1]} />
        <Lightformer form="rect" intensity={2.5} position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 1, 1]} />
        <Lightformer form="rect" intensity={2.5} position={[5, 0.5, 1]} rotation-y={-Math.PI / 2} scale={[6, 0.6, 1]} />
        <Lightformer form="ring" intensity={1.5} position={[0, -2, -6]} scale={4} />
      </Environment>
      <FitCamera />
      <Can progress={progress} flavor={flavor} spin={spin} reduce={reduce} />
      <Bubbles reduce={reduce} />
      <ContactShadows position={[0, -2.15, 0]} opacity={0.35} scale={7} blur={2.6} far={4} frames={reduce ? 1 : Infinity} />
    </Canvas>
  );
}
