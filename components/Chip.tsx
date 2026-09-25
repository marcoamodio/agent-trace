import Dot, { type TraceLevel } from "./Dot";

export default function Chip({
  level,
  children,
}: {
  level?: TraceLevel;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-ink/10 px-2 py-0.5 text-xs text-ink">
      {level ? <Dot level={level} /> : null}
      {children}
    </span>
  );
}
