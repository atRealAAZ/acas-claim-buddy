import { useState } from "react";
import { Button } from "@/components/ui/button";

interface StepChooseOptionsProps {
  onBack: () => void;
  onNext: () => void;
}

const OPTIONS = [
  { id: "dismissed", label: "Unfair\ndismissal" },
  { id: "role-changes", label: "Role\nchanges" },
  { id: "bullying", label: "Workplace\nbullying" },
  { id: "hours-pay-reduced", label: "Reduced\nhours" },
  { id: "adjustments-refused", label: "Adjustment\nrefusal" },
  { id: "something-else", label: "Other" },
];

export function StepChooseOptions({
  onBack,
  onNext,
}: StepChooseOptionsProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleOption = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-between px-6 py-8 animate-in fade-in duration-500">
      <div className="flex-1 flex flex-col items-center w-full max-w-sm">
        {/* Header text */}
        <div className="text-center space-y-3 mt-8 mb-8">
          <h1 className="text-2xl font-bold text-foreground">Which of these feels closest to what happened to you?</h1>
          <p className="text-muted-foreground leading-relaxed">
            You can choose one, more than one, or skip this for now.
          </p>
        </div>

        {/* Overlapping bubble options */}
        <div className="relative w-full h-[340px]">
          {/* Unfair dismissal - top left */}
          <button
            onClick={() => toggleOption("dismissed")}
            className={`absolute left-[2%] top-[5%] w-[100px] h-[100px] rounded-full flex items-center justify-center text-center text-sm font-medium transition-all duration-200 whitespace-pre-line leading-tight ${
              selected.includes("dismissed")
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground border-2 border-muted-foreground/30"
            }`}
          >
            Unfair{"\n"}dismissal
          </button>

          {/* Role changes - center top, overlapping */}
          <button
            onClick={() => toggleOption("role-changes")}
            className={`absolute left-[28%] top-[20%] w-[90px] h-[90px] rounded-full flex items-center justify-center text-center text-sm font-medium transition-all duration-200 whitespace-pre-line leading-tight ${
              selected.includes("role-changes")
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground border-2 border-muted-foreground/30"
            }`}
          >
            Role{"\n"}changes
          </button>

          {/* Workplace bullying - right side */}
          <button
            onClick={() => toggleOption("bullying")}
            className={`absolute right-[5%] top-[18%] w-[105px] h-[105px] rounded-full flex items-center justify-center text-center text-sm font-medium transition-all duration-200 whitespace-pre-line leading-tight ${
              selected.includes("bullying")
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground border-2 border-muted-foreground/30"
            }`}
          >
            Workplace{"\n"}bullying
          </button>

          {/* Reduced hours - left middle */}
          <button
            onClick={() => toggleOption("hours-pay-reduced")}
            className={`absolute left-[0%] top-[38%] w-[95px] h-[95px] rounded-full flex items-center justify-center text-center text-sm font-medium transition-all duration-200 whitespace-pre-line leading-tight ${
              selected.includes("hours-pay-reduced")
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground border-2 border-muted-foreground/30"
            }`}
          >
            Reduced{"\n"}hours
          </button>

          {/* Adjustment refusal - center, larger */}
          <button
            onClick={() => toggleOption("adjustments-refused")}
            className={`absolute left-[30%] top-[42%] w-[115px] h-[115px] rounded-full flex items-center justify-center text-center text-sm font-medium transition-all duration-200 whitespace-pre-line leading-tight z-10 ${
              selected.includes("adjustments-refused")
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground border-2 border-muted-foreground/30"
            }`}
          >
            Adjustment{"\n"}refusal
          </button>

          {/* Other - bottom left */}
          <button
            onClick={() => toggleOption("something-else")}
            className={`absolute left-[8%] top-[68%] w-[85px] h-[85px] rounded-full flex items-center justify-center text-center text-sm font-medium transition-all duration-200 ${
              selected.includes("something-else")
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground border-2 border-muted-foreground/30"
            }`}
          >
            Other
          </button>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3 w-full max-w-sm pt-4">
        <Button
          variant="secondary"
          onClick={onBack}
          className="flex-1 h-12 rounded-full text-base font-medium bg-muted hover:bg-muted/80"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={selected.length === 0}
          className="flex-[2] h-12 rounded-full text-base font-medium"
        >
          Next
        </Button>
      </div>
    </div>
  );
}