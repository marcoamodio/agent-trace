import Chip from "./Chip";
import Reveal from "./Reveal";
import type { ScenarioStep } from "@/lib/scenario";

export default function Activity({
  steps,
  visibleCount,
}: {
  steps: ScenarioStep[];
  visibleCount: number;
}) {
  return (
    <ol className="flex flex-col gap-2">
      {steps.slice(0, visibleCount).map((step, i) => (
        <li key={i}>
          <Reveal>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-[10px] border border-ink/10 px-3 py-2">
              <span className="font-mono text-xs text-ink">{step.tool}</span>
              <span className="font-mono text-xs text-muted">{step.args}</span>
              <span className="ml-auto">
                <Chip>{step.result}</Chip>
              </span>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
