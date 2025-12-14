import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface StepChooseOptionsProps {
  onBack: () => void;
  onNext: () => void;
}

const OPTIONS = [
  { id: "unfair-dismissal", label: "Unfair dismissal", size: "lg" },
  { id: "role-changes", label: "Role changes", size: "md" },
  { id: "workplace-bullying", label: "Workplace bullying", size: "lg" },
  { id: "reduced-hours", label: "Reduced hours", size: "lg" },
  { id: "adjustment-refusal", label: "Adjustment refusal", size: "lg" },
  { id: "other", label: "Other", size: "md" },
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
          onClick={() => toggleOption("unfair-dismissal")}
          className={`absolute left-[5%] top-[0%] w-24 h-24 rounded-full flex items-center justify-center text-center text-sm font-medium transition-all duration-200 ${
            selected.includes("I was dismissed or let go")
              ? "bg-primary text-primary-foreground scale-110"
              : "bg-primary/40 text-primary-foreground hover:bg-primary/60"
          }`}
        >
          Unfair
          <br />
          dismissal
        </button>
        <button
          onClick={() => toggleOption("role-changes")}
          className={`absolute left-[32%] top-[8%] w-20 h-20 rounded-full flex items-center justify-center text-center text-sm font-medium transition-all duration-200 ${
            selected.includes("role-changes")
              ? "bg-primary text-primary-foreground scale-110"
              : "bg-primary/60 text-primary-foreground hover:bg-primary/80"
          }`}
        >
          Role
          <br />
          changes
        </button>
        <button
          onClick={() => toggleOption("workplace-bullying")}
          className={`absolute right-[5%] top-[5%] w-24 h-24 rounded-full flex items-center justify-center text-center text-sm font-medium transition-all duration-200 ${
            selected.includes("workplace-bullying")
              ? "bg-primary text-primary-foreground scale-110"
              : "bg-primary text-primary-foreground hover:bg-primary/80"
          }`}
        >
          Workplace
          <br />
          bullying
        </button>

        {/* Row 2 */}
        <button
          onClick={() => toggleOption("reduced-hours")}
          className={`absolute left-[8%] top-[35%] w-24 h-24 rounded-full flex items-center justify-center text-center text-sm font-medium transition-all duration-200 ${
            selected.includes("reduced-hours")
              ? "bg-primary text-primary-foreground scale-110"
              : "bg-primary text-primary-foreground hover:bg-primary/80"
          }`}
        >
          Reduced
          <br />
          hours
        </button>
        <button
          onClick={() => toggleOption("adjustment-refusal")}
          className={`absolute left-[35%] top-[40%] w-24 h-24 rounded-full flex items-center justify-center text-center text-sm font-medium transition-all duration-200 ${
            selected.includes("adjustment-refusal")
              ? "bg-primary text-primary-foreground scale-110"
              : "bg-primary/60 text-primary-foreground hover:bg-primary/80"
          }`}
        >
          Adjustment
          <br />
          refusal
        </button>

        {/* Row 3 */}
        <button
          onClick={() => toggleOption("other")}
          className={`absolute left-[15%] top-[70%] w-20 h-20 rounded-full flex items-center justify-center text-center text-sm font-medium transition-all duration-200 ${
            selected.includes("other")
              ? "bg-primary text-primary-foreground scale-110"
              : "bg-primary/40 text-primary-foreground hover:bg-primary/60"
          }`}
        >
          Other
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
