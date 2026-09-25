"use client";

import { useRef, useState } from "react";
import Activity from "@/components/Activity";
import Answer from "@/components/Answer";
import Chip from "@/components/Chip";
import Trace from "@/components/Trace";
import { scenario } from "@/lib/scenario";

type Phase = "idle" | "working" | "answer" | "trace" | "done";

const STEP_INTERVAL_MS = 900;

export default function Home() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [visibleSteps, setVisibleSteps] = useState(0);
  const timers = useRef<number[]>([]);

  const running = phase !== "idle";

  function start() {
    setPhase("working");
    const schedule = (fn: () => void, ms: number) =>
      timers.current.push(window.setTimeout(fn, ms));

    // the order is load-bearing: watch the work, then the answer, then the trace
    scenario.steps.forEach((_, i) =>
      schedule(() => setVisibleSteps(i + 1), i * STEP_INTERVAL_MS)
    );
    const afterSteps = scenario.steps.length * STEP_INTERVAL_MS + 300;
    schedule(() => setPhase("answer"), afterSteps);
    schedule(() => setPhase("trace"), afterSteps + 700);
    schedule(() => setPhase("done"), afterSteps + 1300);
  }

  function restart() {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setVisibleSteps(0);
    setPhase("idle");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-base font-medium text-ink">Agent Trace</h1>
          <Chip level="convention">prototype 0.1</Chip>
        </div>
        <p className="text-sm text-muted">See what happened after you asked.</p>
      </header>

      <section className="flex flex-col gap-3 rounded-xl border border-ink/10 p-4">
        <p className="text-base text-ink">{scenario.question}</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={start}
            disabled={running}
            className="rounded-[10px] bg-ink px-4 py-2 text-sm font-medium text-paper transition-opacity disabled:opacity-40"
          >
            Ask the agent
          </button>
          {phase === "done" ? (
            <button
              type="button"
              onClick={restart}
              className="rounded-[10px] border border-ink/15 px-4 py-2 text-sm text-muted transition-colors hover:text-ink"
            >
              Restart
            </button>
          ) : null}
        </div>
      </section>

      {running ? (
        <Activity steps={scenario.steps} visibleCount={visibleSteps} />
      ) : null}

      {phase === "answer" || phase === "trace" || phase === "done" ? (
        <Answer text={scenario.answer} />
      ) : null}

      {phase === "trace" || phase === "done" ? (
        <Trace data={scenario} />
      ) : null}
    </main>
  );
}
