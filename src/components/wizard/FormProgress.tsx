import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormProgressProps {
  currentSegment: number;
  totalSegments: number;
  timeEstimate: string;
}

export function FormProgress({ currentSegment, totalSegments, timeEstimate }: FormProgressProps) {
  const percentComplete = Math.round((currentSegment / totalSegments) * 100);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-foreground">
          {percentComplete}% to complete
        </span>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{timeEstimate}</span>
        </div>
      </div>

      {/* Segmented Progress Bar */}
      <div className="flex gap-1">
        {Array.from({ length: totalSegments }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "flex-1 h-10 rounded-full flex items-center justify-center transition-colors",
              index < currentSegment
                ? "bg-primary"
                : "bg-primary/20"
            )}
          >
            <div className="w-2 h-2 rounded-full bg-white/80" />
          </div>
        ))}
      </div>
    </div>
  );
}