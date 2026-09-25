"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Chip from "./Chip";
import Dot from "./Dot";
import Legend from "./Legend";
import useReducedMotion from "./useReducedMotion";
import type { Scenario } from "@/lib/scenario";

function SourceRow({
  source,
  open,
  onToggle,
}: {
  source: Scenario["sources"][number];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-[10px] border border-ink/10">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-3 py-2 text-left"
      >
        <span className="text-sm text-ink">{source.title}</span>
        <a
          href={source.url}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Open source: ${source.title}`}
          className="text-muted hover:text-ink"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            aria-hidden="true"
          >
            <path d="M4.5 2.5h5v5" />
            <path d="M9.5 2.5 5 7" />
            <path d="M8 8.5v1.5h-5.5v-5.5H4" />
          </svg>
        </a>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
          className={`ml-auto text-muted transition-transform duration-300 ${
            open ? "rotate-90" : ""
          }`}
        >
          <path d="M4.5 2.5 7.5 6 4.5 9.5" />
        </svg>
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <blockquote className="mx-3 mb-3 border-l border-ink/10 pl-3 text-sm text-muted">
            “{source.excerpt}”
          </blockquote>
        </div>
      </div>
    </div>
  );
}

export default function Trace({ data }: { data: Scenario }) {
  const [openSource, setOpenSource] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const value = data.confidence.value;
    const bar = barRef.current;
    const num = numRef.current;
    if (!bar || !num) return;

    if (reduced) {
      gsap.set(bar, { width: `${value}%` });
      num.textContent = `${value}%`;
      return;
    }

    const tweens: gsap.core.Tween[] = [];
    const counter = { v: 0 };

    // the bar and the number only start once the panel is fully visible
    tweens.push(
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            tweens.push(
              gsap.to(bar, {
                width: `${value}%`,
                duration: 0.8,
                ease: "power2.out",
              }),
              gsap.to(counter, {
                v: value,
                duration: 0.8,
                ease: "power2.out",
                onUpdate: () => {
                  num.textContent = `${Math.round(counter.v)}%`;
                },
              })
            );
          },
        }
      )
    );

    return () => tweens.forEach((t) => t.kill());
  }, [reduced, data.confidence.value]);

  const toolCounts = data.steps.reduce<Record<string, number>>((acc, s) => {
    acc[s.tool] = (acc[s.tool] ?? 0) + 1;
    return acc;
  }, {});
  const toolsSummary = Object.entries(toolCounts)
    .map(([tool, count]) => `${tool} ×${count}`)
    .join(", ");

  return (
    <section
      ref={sectionRef}
      aria-label="Agent Trace"
      className="divide-y divide-ink/10 rounded-xl border border-ink/10"
    >
      {/* header — the trace format itself is a design convention */}
      <div className="flex items-center gap-2 px-4 py-3">
        <h2 className="text-sm font-medium text-ink">Agent Trace</h2>
        <Chip level="convention">design convention</Chip>
      </div>

      {/* sources — real data */}
      <div className="px-4 py-4">
        <div className="mb-2 flex items-center gap-1.5">
          <Dot level="real" />
          <h3 className="text-xs font-medium text-ink">Sources</h3>
          <span className="text-xs text-muted">· real data</span>
        </div>
        <div className="flex flex-col gap-2">
          {data.sources.map((source, i) => (
            <SourceRow
              key={source.url}
              source={source}
              open={openSource === i}
              onToggle={() => setOpenSource(openSource === i ? null : i)}
            />
          ))}
        </div>
      </div>

      {/* tools — real data */}
      <div className="px-4 py-4">
        <div className="mb-2 flex items-center gap-1.5">
          <Dot level="real" />
          <h3 className="text-xs font-medium text-ink">Tools</h3>
          <span className="text-xs text-muted">· real data</span>
        </div>
        <p className="font-mono text-xs text-ink">{toolsSummary}</p>
        <p className="tnum mt-1 text-xs text-muted">
          ~{data.tokenCost.toLocaleString("en-US")} tokens · real data from API
        </p>
      </div>

      {/* confidence — derived estimate */}
      <div className="px-4 py-4">
        <div className="mb-2 flex items-center gap-1.5">
          <Dot level="derived" />
          <h3 className="text-xs font-medium text-ink">Confidence</h3>
          <Chip level="derived">derived estimate</Chip>
        </div>
        <div className="flex items-center gap-3">
          <span ref={numRef} className="tnum text-2xl text-ink">
            0%
          </span>
          <div className="h-1.5 flex-1 rounded-full bg-ink/10">
            <div
              ref={barRef}
              className="h-full rounded-full bg-signal-derived"
              style={{ width: "0%" }}
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-muted">
          derived from: {data.confidence.ingredients.join(" · ")}
        </p>
      </div>

      {/* not verified — declared by the agent, styled quietly */}
      <div className="px-4 py-4">
        <div className="mb-2 flex items-center gap-1.5">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            aria-hidden="true"
            className="text-muted"
          >
            <circle cx="6" cy="6" r="4.5" />
            <path d="M4.6 4.4c0-.8.6-1.4 1.4-1.4s1.4.6 1.4 1.4c0 1-1.4 1.1-1.4 2.1" />
            <circle cx="6" cy="8.8" r="0.2" fill="currentColor" />
          </svg>
          <h3 className="text-xs font-medium text-ink">Not verified</h3>
          <Dot level="real" />
        </div>
        <ul className="flex flex-col gap-2">
          {data.notVerified.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-muted">
              <span aria-hidden="true" className="mt-2 h-px w-3 shrink-0 bg-signal-convention" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* footer legend */}
      <div className="px-4 py-3">
        <Legend />
      </div>
    </section>
  );
}
