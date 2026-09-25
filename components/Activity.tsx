"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Chip from "./Chip";
import Dot from "./Dot";
import useReducedMotion from "./useReducedMotion";
import type { ScenarioStep } from "@/lib/scenario";

export default function Activity({
  steps,
  visibleCount,
}: {
  steps: ScenarioStep[];
  visibleCount: number;
}) {
  const listRef = useRef<HTMLOListElement>(null);
  const [workDone, setWorkDone] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (visibleCount === 0) return;
    if (reduced) {
      if (visibleCount === steps.length) setWorkDone(true);
      return;
    }
    const item = listRef.current?.children[visibleCount - 1] as
      | HTMLElement
      | undefined;
    if (!item) return;

    const isLast = visibleCount === steps.length;
    const dot = item.querySelector<HTMLElement>("[data-pulse-dot]");
    let pulse: gsap.core.Tween | undefined;

    const entrance = gsap.fromTo(
      item,
      { opacity: 0, y: 8 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          // stillness signals "work done"
          if (isLast) {
            pulse?.kill();
            if (dot) gsap.set(dot, { opacity: 1 });
            setWorkDone(true);
          }
        },
      }
    );

    if (dot) {
      pulse = gsap.to(dot, {
        opacity: 0.35,
        duration: 0.55,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut",
      });
    }

    return () => {
      entrance.kill();
      pulse?.kill();
    };
  }, [visibleCount, reduced, steps.length]);

  return (
    <ol ref={listRef} className="flex flex-col gap-2">
      {steps.slice(0, visibleCount).map((step, i) => {
        const showPulseDot = !workDone && i === visibleCount - 1;
        return (
          <li key={i}>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-[10px] border border-ink/10 px-3 py-2">
              <span className="font-mono text-xs text-ink">{step.tool}</span>
              <span className="font-mono text-xs text-muted">{step.args}</span>
              <span className="ml-auto">
                <Chip>
                  {showPulseDot ? (
                    <span data-pulse-dot className="inline-flex">
                      <Dot level="real" />
                    </span>
                  ) : null}
                  {step.result}
                </Chip>
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
