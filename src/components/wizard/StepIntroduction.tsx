import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';

interface StepIntroductionProps {
  onNext: () => void;
}

export function StepIntroduction({ onNext }: StepIntroductionProps) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 animate-in fade-in duration-500">
      <Card className="bg-primary/10 border-primary/20 max-w-sm w-full">
        <CardContent className="pt-8 pb-8 px-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <p className="text-lg font-medium text-foreground leading-relaxed">
            We're sorry you experienced discrimination. We're here to help you take the next step.
          </p>
          <p className="text-sm text-muted-foreground">
            This tool will guide you through the ACAS Early Conciliation process.
          </p>
        </CardContent>
      </Card>

      {/* Start button */}
      <div className="w-full max-w-sm mt-8">
        <Button 
          onClick={onNext} 
          size="lg" 
          className="w-full text-lg py-6"
        >
          Start
        </Button>
      </div>
    </div>
  );
}
