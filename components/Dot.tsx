export type TraceLevel = "real" | "derived" | "convention";

const levelColor: Record<TraceLevel, string> = {
  real: "bg-signal-real",
  derived: "bg-signal-derived",
  convention: "bg-signal-convention",
};

export default function Dot({ level }: { level: TraceLevel }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-2 w-2 shrink-0 rounded-full ${levelColor[level]}`}
    />
  );
}
