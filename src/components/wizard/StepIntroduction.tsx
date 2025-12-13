import { Button } from '@/components/ui/button';

interface StepIntroductionProps {
  onNext: () => void;
}

export function StepIntroduction({ onNext }: StepIntroductionProps) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 animate-in fade-in duration-500">
      {/* Speech bubble */}
      <div className="relative mb-8">
        <div className="bg-background border-2 border-foreground rounded-2xl px-6 py-4 max-w-[280px]">
          <p className="text-base font-medium text-foreground text-center leading-relaxed">
            We're sorry you experienced discrimination. We're here to help you take the next step.
          </p>
        </div>
        {/* Speech bubble tail */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
          <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[14px] border-t-foreground" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-background" />
        </div>
      </div>

      {/* Avatar circle with empathetic face */}
      <div className="w-24 h-24 rounded-full border-2 border-foreground mb-auto flex items-center justify-center">
        <svg viewBox="0 0 48 48" className="w-16 h-16 text-foreground">
          {/* Eyes - gentle, caring */}
          <circle cx="16" cy="18" r="2.5" fill="currentColor" />
          <circle cx="32" cy="18" r="2.5" fill="currentColor" />
          {/* Eyebrows - slightly raised, empathetic */}
          <path d="M12 13 Q16 11, 20 13" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M28 13 Q32 11, 36 13" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Gentle, warm smile */}
          <path d="M16 30 Q24 36, 32 30" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>

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
