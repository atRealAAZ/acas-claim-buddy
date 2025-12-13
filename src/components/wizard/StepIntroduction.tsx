import { Button } from '@/components/ui/button';

interface StepIntroductionProps {
  onNext: () => void;
}

export function StepIntroduction({ onNext }: StepIntroductionProps) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 animate-in fade-in duration-500">
      {/* Speech bubble */}
      <div className="relative mb-8">
        <div className="bg-background border-2 border-foreground rounded-2xl px-6 py-4 max-w-[220px]">
          <p className="text-lg font-medium text-foreground text-center">
            How can I help you today?
          </p>
        </div>
        {/* Speech bubble tail */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
          <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[14px] border-t-foreground" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-background" />
        </div>
      </div>

      {/* Avatar circle */}
      <div className="w-24 h-24 rounded-full border-2 border-foreground mb-auto" />

      {/* Start button */}
      <div className="w-full mt-auto pb-8">
        <Button 
          onClick={onNext} 
          variant="outline"
          size="lg" 
          className="w-full border-2 border-foreground text-foreground hover:bg-foreground hover:text-background font-medium text-lg py-6"
        >
          Start
        </Button>
      </div>
    </div>
  );
}
