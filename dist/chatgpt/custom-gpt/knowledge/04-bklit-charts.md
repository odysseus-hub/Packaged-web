# Bklit UI charts

Bklit is a shadcn registry of animated, composable SVG charts (visx + d3 + motion). On a
marketing page a chart is **evidence**. Give it a headline that states what it proves
("3.2× faster p95 since v4") and keep it free of dashboard clutter.

## Install

```bash
npx shadcn@latest add @bklit/area-chart -y </dev/null
bash <skill>/scripts/patch_registry.sh .      # always, after any @bklit add
```

Registry names: `area-chart`, `bar-chart`, `line-chart`, `live-line-chart`, `pie-chart`,
`ring-chart`, `gauge-chart`, `funnel-chart`, `radar-chart`, `scatter-chart`, `composed-chart`,
`heatmap-chart`, `sankey-chart`, `choropleth-chart`, `candlestick-chart`, `sunburst-chart`,
`profit-loss-line`, `legend`.

## Imports: these differ from the Bklit docs

The docs show `import { … } from "@bklitui/ui/charts"`, which is the monorepo package. A
registry install puts **files** in `src/components/charts/`, so import per file:

```tsx
import { AreaChart, Area } from "@/components/charts/area-chart";   // area-chart re-exports Area
import { LineChart, Line } from "@/components/charts/line-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { Bar } from "@/components/charts/bar";
import { BarXAxis } from "@/components/charts/bar-x-axis";
import { Grid } from "@/components/charts/grid";
import { XAxis } from "@/components/charts/x-axis";
import { ChartTooltip } from "@/components/charts/tooltip";
import { RingChart } from "@/components/charts/ring-chart";
import { Ring } from "@/components/charts/ring";
import { RingCenter } from "@/components/charts/ring-center";
import { Gauge } from "@/components/charts/gauge";
import { FunnelChart } from "@/components/charts/funnel-chart";
import { PieChart } from "@/components/charts/pie-chart";
import { PieSlice } from "@/components/charts/pie-slice";
import { LiveLineChart } from "@/components/charts/live-line-chart";
import { LiveLine } from "@/components/charts/live-line";
```

If unsure, run `grep -n "^export" src/components/charts/<file>.tsx`.

## Patterns

```tsx
// Time series: growth story. Data keys: `date` (Date) by default; change with xDataKey.
<InViewMount aspect="2 / 1">
  <AreaChart data={data} animationDuration={reduce ? 0 : 1100}>
    <Grid horizontal />
    <Area dataKey="throughput" fill="var(--chart-line-primary)" fadeEdges />
    <XAxis />
    <ChartTooltip />
  </AreaChart>
</InViewMount>

// Categorical comparison (us vs them). xDataKey defaults to "name".
<BarChart data={[{ name: "Us", p95: 42 }, { name: "Legacy", p95: 138 }]} animationDuration={reduce ? 0 : 1100}>
  <Grid horizontal />
  <Bar dataKey="p95" fill="var(--chart-line-primary)" lineCap="round" />
  <BarXAxis />
</BarChart>

// Single KPI as a dial
<Gauge value={66} centerValue={428_000} defaultLabel="ARR run rate" inactiveFillOpacity={0.4}
  formatOptions={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }} />

// Conversion story
<FunnelChart data={[{ label: "Visitors", value: 12400, displayValue: "12.4k" }, …]} color="var(--brand)" layers={3} />

// Rings (multiple % of target)
<RingChart data={[{ label: "Organic", value: 4250, maxValue: 5000, color: "var(--brand)" }, …]} size={300}>
  {data.map((d, i) => <Ring key={d.label} index={i} />)}
  <RingCenter defaultLabel="Sessions" />
</RingChart>
```

Common `AreaChart`/`LineChart` props: `data`, `xDataKey="date"`, `aspectRatio="2 / 1"`,
`animationDuration=1100` (ms; clip-reveal with `cubic-bezier(0.85,0,0.15,1)`),
`status="loading"|"ready"`, `loadingLabel`, `margin`. `Area`: `dataKey`, `fill`, `fillOpacity`
(0.4), `strokeWidth`, `fadeEdges`, `showMarkers`, `animate`. `Grid`: `horizontal`, `vertical`,
`numTicksRows`, `strokeDasharray`, `shimmer`. `ChartTooltip`: `showDatePill`, `showCrosshair`,
`content`, `rows`.

## Motion

- Charts play their own entrance on **mount**. Wrap each one in `<InViewMount>` (from
  `assets/motion/reveal.tsx`) so the reveal happens when the chart scrolls into view. Pass the
  same `aspect` as the chart to avoid layout shift.
- Reduced motion: `animationDuration={reduce ? 0 : 1100}`, with
  `const reduce = useReducedMotion()`. Some internals (y-domain tween, shimmer) check the
  media query themselves.
- Don't add extra transforms to the chart's SVG. Wrapping the *card* in `Reveal` is fine.
- Data updates morph smoothly without replaying the entrance. Never change `revealSignature`
  except to deliberately replay it.

## Theming to the accent

Bklit reads CSS variables (added to `globals.css` by the install). Set them once in the theme
block (`:root` or `.dark`) rather than passing per-chart colors:

```css
--chart-line-primary: var(--brand);
--chart-line-secondary: oklch(from var(--brand) l c calc(h + 40));  /* or a neutral */
--chart-grid: oklch(1 0 0 / 7%);           /* dark site; light site: oklch(0 0 0 / 7%) */
--chart-crosshair: var(--brand);
--chart-tooltip-background: var(--popover);
--chart-foreground-muted: var(--muted-foreground);
--chart-1: var(--brand);                    /* funnel/ring defaults read --chart-1… */
```

For a premium look: show one series in the accent and everything else in neutrals, keep the
grid at 5–8% opacity, drop the y-axis on hero charts, and put the key number in display type
*beside* the chart, not inside it.
