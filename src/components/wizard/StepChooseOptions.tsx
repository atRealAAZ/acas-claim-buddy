import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface StepChooseOptionsProps {
  onBack: () => void;
  onNext: () => void;
}

const OPTIONS = [
  { id: "dismissed", label: "I was dismissed or let go" },
  { id: "role-changes", label: "My role or duties were changed" },
  { id: "bullying", label: "I was bullied or treated badly at work" },
  { id: "hours-pay-reduced", label: "My hours or pay were reduced" },
  { id: "adjustments-refused", label: "Adjustments I needed were refused" },
  { id: "something-else", label: "Something else happened" },
];

export function StepChooseOptions({ onBack, onNext }: StepChooseOptionsProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleOption = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]));
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center px-6 py-8 animate-in fade-in duration-500">
      {/* Speech bubble header */}
      <div className="relative mb-8 w-full max-w-md">
        <div className="bg-muted rounded-2xl p-6 text-center">
          <h2 className="text-xl font-semibold text-foreground">Choose which options apply!</h2>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[14px] border-t-muted" />
      </div>

      {/* Bubble options */}
      <div className="relative w-full max-w-md h-[320px] my-4">
        {/* Row 1 */}
        <button
          onClick={() => toggleOption("dismissed")}
          className={`absolute left-[2%] top-[0%] w-28 h-28 rounded-full flex items-center justify-center text-center text-xs font-medium transition-all duration-200 p-2 ${
            selected.includes("dismissed")
              ? "bg-primary text-primary-foreground scale-110"
              : "bg-primary/40 text-primary-foreground hover:bg-primary/60"
          }`}
        >
          I was dismissed or let go
        </button>
        <button
          onClick={() => toggleOption("role-changes")}
          className={`absolute left-[35%] top-[5%] w-24 h-24 rounded-full flex items-center justify-center text-center text-xs font-medium transition-all duration-200 p-2 ${
            selected.includes("role-changes")
              ? "bg-primary text-primary-foreground scale-110"
              : "bg-primary/60 text-primary-foreground hover:bg-primary/80"
          }`}
        >
          My role or duties were changed
        </button>
        <button
          onClick={() => toggleOption("bullying")}
          className={`absolute right-[2%] top-[0%] w-28 h-28 rounded-full flex items-center justify-center text-center text-xs font-medium transition-all duration-200 p-2 ${
            selected.includes("bullying")
              ? "bg-primary text-primary-foreground scale-110"
              : "bg-primary text-primary-foreground hover:bg-primary/80"
          }`}
        >
          I was bullied or treated badly at work
        </button>

        {/* Row 2 */}
        <button
          onClick={() => toggleOption("hours-pay-reduced")}
          className={`absolute left-[5%] top-[38%] w-28 h-28 rounded-full flex items-center justify-center text-center text-xs font-medium transition-all duration-200 p-2 ${
            selected.includes("hours-pay-reduced")
              ? "bg-primary text-primary-foreground scale-110"
              : "bg-primary text-primary-foreground hover:bg-primary/80"
          }`}
        >
          My hours or pay were reduced
        </button>
        <button
          onClick={() => toggleOption("adjustments-refused")}
          className={`absolute left-[38%] top-[35%] w-24 h-24 rounded-full flex items-center justify-center text-center text-xs font-medium transition-all duration-200 p-2 ${
            selected.includes("adjustments-refused")
              ? "bg-primary text-primary-foreground scale-110"
              : "bg-primary/60 text-primary-foreground hover:bg-primary/80"
          }`}
        >
          Adjustments I needed were refused
        </button>

        {/* Row 3 */}
        <button
          onClick={() => toggleOption("something-else")}
          className={`absolute left-[12%] top-[72%] w-24 h-24 rounded-full flex items-center justify-center text-center text-xs font-medium transition-all duration-200 p-2 ${
            selected.includes("something-else")
              ? "bg-primary text-primary-foreground scale-110"
              : "bg-primary/40 text-primary-foreground hover:bg-primary/60"
          }`}
        >
          Something else happened
        </button>
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-4 mt-8 w-full max-w-md justify-center">
        <Button
          variant="default"
          onClick={onBack}
          className="px-8 py-6 rounded-full bg-foreground text-background hover:bg-foreground/90"
        >
          Back
        </Button>
        <Button onClick={onNext} disabled={selected.length === 0} className="px-12 py-6 rounded-full">
          Next
        </Button>
      </div>
    </div>
  );
}
