// Riso-printed can labels, drawn to a canvas at runtime and wrapped onto the 3D can.
// Two inks per flavor (paper + ink + one spot color), misregistered on purpose.

export type Flavor = {
  id: string;
  name: string;
  no: string;
  paper: string; // label base ink
  ink: string; // type ink
  spot: string; // halftone / misregistration ink
  stage: string; // page background behind the can
  note: string;
};

export const FLAVORS: Flavor[] = [
  {
    id: "cherry",
    name: "Riso Cherry",
    no: "01",
    paper: "#ff48b0",
    ink: "#1b1e29",
    spot: "#ffe800",
    stage: "#ffd6ea",
    note: "Fluorescent pink over a yellow screen. Tart, loud and slightly off-register.",
  },
  {
    id: "tonic",
    name: "Teal Tonic",
    no: "02",
    paper: "#00838a",
    ink: "#f6f1e8",
    spot: "#ff48b0",
    stage: "#cfeceb",
    note: "Dense teal with a pink overprint. Bitter, cool, printed on cream stock.",
  },
  {
    id: "yuzu",
    name: "Blue Yuzu",
    no: "03",
    paper: "#0078bf",
    ink: "#f6f1e8",
    spot: "#ffe800",
    stage: "#d4e7f6",
    note: "Workhorse blue pulled through yellow into a riso green at the seams.",
  },
];

/** Draws one flavor's label. Width maps to the can's circumference, height to the label band. */
export function drawLabel(f: Flavor, displayFont: string, monoFont: string): HTMLCanvasElement {
  const W = 2048;
  const H = 900;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d");
  if (!g) return c;

  // Base ink.
  g.fillStyle = f.paper;
  g.fillRect(0, 0, W, H);

  // Halftone screen in the spot ink: dot size follows a slow diagonal gradient.
  g.save();
  g.globalCompositeOperation = "multiply";
  g.fillStyle = f.spot;
  const cell = 22;
  for (let y = 0; y < H + cell; y += cell) {
    for (let x = 0; x < W + cell; x += cell) {
      const ox = (y / cell) % 2 ? cell / 2 : 0;
      const t = 0.5 + 0.5 * Math.sin((x + ox) / 260 + y / 180);
      const r = (cell / 2) * Math.pow(t, 1.6) * 0.95;
      if (r < 0.6) continue;
      g.beginPath();
      g.arc(x + ox, y, r, 0, Math.PI * 2);
      g.fill();
    }
  }
  g.restore();

  // Two repeats around the can so the wordmark faces you from either side.
  for (const x0 of [0, W / 2]) {
    // Vertical wordmark, printed twice: spot plate offset, then ink plate.
    g.save();
    g.translate(x0 + 150, H - 60);
    g.rotate(-Math.PI / 2);
    g.font = `800 250px ${displayFont}`;
    g.textBaseline = "alphabetic";
    g.fillStyle = f.spot;
    g.fillText("SPECIMEN", 10, 12);
    g.fillStyle = f.ink;
    g.fillText("SPECIMEN", 0, 0);
    g.restore();

    // Flavor block.
    g.fillStyle = f.ink;
    g.font = `800 112px ${displayFont}`;
    const [a, b] = f.name.split(" ");
    g.fillText(a, x0 + 330, 300);
    g.fillText(b, x0 + 330, 420);
    g.font = `500 30px ${monoFont}`;
    g.fillText(`SODA · No.${f.no} · PRINTED IN 2 INKS`, x0 + 336, 492);

    // Big number disc.
    g.beginPath();
    g.arc(x0 + 820, 700, 120, 0, Math.PI * 2);
    g.fillStyle = f.ink;
    g.fill();
    g.fillStyle = f.paper;
    g.font = `800 120px ${displayFont}`;
    g.textAlign = "center";
    g.fillText(f.no, x0 + 820, 742);
    g.textAlign = "left";

    // Fine print + barcode.
    g.fillStyle = f.ink;
    g.font = `500 22px ${monoFont}`;
    ["355 ML · 12 FL OZ", "LOT 0425 · DRUM B", "SHAKE GENTLY · OPEN SLOWLY"].forEach((l, i) => g.fillText(l, x0 + 336, 620 + i * 34));
    for (let i = 0, x = x0 + 336; i < 42; i++) {
      const w = [2, 3, 5, 2, 4][i % 5];
      g.fillRect(x, 740, w, 90);
      x += w + [3, 2, 4, 2, 3][(i * 7) % 5];
    }
  }

  // Thin ink rules at the label edges (where the label meets the aluminum).
  g.fillStyle = f.ink;
  g.fillRect(0, 0, W, 10);
  g.fillRect(0, H - 10, W, 10);
  return c;
}
