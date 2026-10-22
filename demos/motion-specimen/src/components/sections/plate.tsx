import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Page container: 1320px max, generous gutters. */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-12", className)}>{children}</div>;
}

/** The specimen-book caption every section opens with: plate number, rule name, the rule. */
export function PlateLabel({ n, name, rule }: { n: string; name: string; rule?: string }) {
  return (
    <div className="rule-draw flex flex-wrap items-baseline gap-x-4 gap-y-1 pt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
      <span className="text-brand">Plate {n}</span>
      <span className="text-foreground">{name}</span>
      {rule ? <span className="normal-case tracking-normal">{rule}</span> : null}
    </div>
  );
}
