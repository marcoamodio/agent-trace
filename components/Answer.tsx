import Reveal from "./Reveal";

export default function Answer({ text }: { text: string }) {
  return (
    <Reveal>
      <div className="rounded-[10px] border border-ink/10 p-4">
        <p className="text-base leading-normal text-ink">{text}</p>
      </div>
    </Reveal>
  );
}
