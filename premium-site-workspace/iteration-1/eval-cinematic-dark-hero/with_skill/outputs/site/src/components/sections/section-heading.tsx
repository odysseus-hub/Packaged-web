import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Slate-style eyebrow: reel number + section name, set in mono like a clapperboard. */
export function Eyebrow({ reel, children, className }: { reel: string; children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 font-mono text-[0.72rem] tracking-[0.24em] text-muted-foreground uppercase",
        className
      )}
    >
      <span className="text-brand">Reel {reel}</span>
      <span aria-hidden="true" className="h-px w-8 bg-hairline" />
      {children}
    </p>
  );
}
