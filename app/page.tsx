"use client";

import { useRef, useState } from "react";
import Activity from "@/components/Activity";
import Answer from "@/components/Answer";
import Chip from "@/components/Chip";
import Trace from "@/components/Trace";
import useReducedMotion from "@/components/useReducedMotion";
import { scenario } from "@/lib/scenario";

type Phase = "idle" | "working" | "answer" | "trace" | "done";

// choreography beats (ms) — the order is load-bearing, the pacing is the message
const INITIAL_DELAY_MS = 500; // request "in flight" before work begins
const STEP_INTERVAL_MS = 900; // watched-work cadence
const STEP_ENTER_MS = 400; // one step's entrance duration
const ANSWER_GAP_MS = 400; // causality beat after the last step completes
const TRACE_GAP_MS = 800; // the trace arrives after the answer
const TRACE_ENTER_MS = 600; // trace panel entrance
const BAR_FILL_MS = 800; // confidence bar + count-up

export default function Home() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [visibleSteps, setVisibleSteps] = useState(0);
  const timers = useRef<number[]>([]);
  const reduced = useReducedMotion();

  const running = phase !== "idle";

  function start() {
    if (reduced) {
      setVisibleSteps(scenario.steps.length);
      setPhase("done");
      return;
    }
    setPhase("working");
    const schedule = (fn: () => void, ms: number) =>
      timers.current.push(window.setTimeout(fn, ms));

    // the order is load-bearing: watch the work, then the answer, then the trace
    scenario.steps.forEach((_, i) =>
      schedule(() => setVisibleSteps(i + 1), INITIAL_DELAY_MS + i * STEP_INTERVAL_MS)
    );
    const lastStepDone =
      INITIAL_DELAY_MS +
      (scenario.steps.length - 1) * STEP_INTERVAL_MS +
      STEP_ENTER_MS;
    const answerAt = lastStepDone + ANSWER_GAP_MS;
    const traceAt = answerAt + TRACE_GAP_MS;
    schedule(() => setPhase("answer"), answerAt);
    schedule(() => setPhase("trace"), traceAt);
    schedule(() => setPhase("done"), traceAt + TRACE_ENTER_MS + BAR_FILL_MS + 150);
  }

  function restart() {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setVisibleSteps(0);
    setPhase("idle");
  }

  const showAnswer = phase === "answer" || phase === "trace" || phase === "done";
  const showTrace = phase === "trace" || phase === "done";

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
          {running ? (
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

      {showAnswer ? (
        <div className="flex flex-col gap-2">
          <Answer text={scenario.answer} />
          {showTrace ? <Trace data={scenario} /> : null}
        </div>
      ) : null}
    </main>
  );
}
