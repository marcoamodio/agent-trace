"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import useReducedMotion from "./useReducedMotion";

export default function Answer({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    const tween = gsap.fromTo(
      ref.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
    return () => {
      tween.kill();
    };
  }, [reduced]);

  return (
    <div ref={ref} className="rounded-[10px] border border-ink/10 p-4">
      <p className="text-base leading-normal text-ink">{text}</p>
    </div>
  );
}
