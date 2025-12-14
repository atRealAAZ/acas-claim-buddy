import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export function ProgressIndicator({ currentStep, totalSteps, labels }: ProgressIndicatorProps) {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {labels.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {index > 0 && (
                  <div 
                    className={cn(
                      "h-0.5 flex-1 -mr-px transition-colors duration-300",
                      currentStep > index ? "bg-primary" : "bg-muted"
                    )} 
                  />
                )}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 shrink-0 z-10",
                    isCompleted && "bg-primary text-primary-foreground",
                    isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : stepNumber}
                </div>
                {index < labels.length - 1 && (
                  <div 
                    className={cn(
                      "h-0.5 flex-1 -ml-px transition-colors duration-300",
                      currentStep > stepNumber ? "bg-primary" : "bg-muted"
                    )} 
                  />
                )}
              </div>
              <span 
                className={cn(
                  "mt-2 text-xs text-center hidden sm:block",
                  isCurrent ? "text-foreground font-medium" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
