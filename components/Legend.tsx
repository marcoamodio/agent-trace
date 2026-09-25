import Dot from "./Dot";

const items = [
  { level: "real", label: "real data" },
  { level: "derived", label: "derived estimate with declared logic" },
  { level: "convention", label: "design convention" },
] as const;

export default function Legend() {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
      {items.map((item) => (
        <li key={item.level} className="flex items-center gap-1.5">
          <Dot level={item.level} />
          <span className="text-xs text-muted">{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
