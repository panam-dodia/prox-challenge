const PROMPTS = [
  "What's the duty cycle for MIG welding at 200A on 240V?",
  "I'm getting porosity in my flux-cored welds. What should I check?",
  "What polarity setup do I need for TIG welding? Which socket does the ground clamp go in?",
  "Build me a settings configurator for MIG welding",
  "Show me the wiring schematic",
  "How do I load a 10 lb wire spool?",
];

export function StarterPrompts({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="starter-prompts">
      <h2>Ask about the Vulcan OmniPro 220</h2>
      <p>Duty cycles, polarity setup, weld diagnosis, wiring, troubleshooting — with diagrams, not just text.</p>
      <div className="starter-grid">
        {PROMPTS.map((p) => (
          <button key={p} className="starter-chip" onClick={() => onPick(p)}>
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
