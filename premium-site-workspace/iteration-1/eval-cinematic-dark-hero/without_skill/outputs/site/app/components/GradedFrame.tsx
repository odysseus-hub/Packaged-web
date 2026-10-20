import Scene from "./Scene";

export default function GradedFrame({
  id,
  filter,
  overlay,
  blend = "soft-light",
  className = "",
}: {
  id: string;
  filter: string;
  overlay?: string;
  blend?: string;
  className?: string;
}) {
  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      <div className="absolute inset-0 transition-[filter] duration-700" style={{ filter }}>
        <Scene id={id} className="h-full w-full" />
      </div>
      {overlay && (
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{ background: overlay, mixBlendMode: blend as React.CSSProperties["mixBlendMode"] }}
        />
      )}
    </div>
  );
}
