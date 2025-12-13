import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';

interface StepIntroductionProps {
  onNext: () => void;
}

export function StepIntroduction({ onNext }: StepIntroductionProps) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 animate-in fade-in duration-500">
      <Card className="bg-primary/10 border-primary/20 max-w-md w-full">
        <CardContent className="pt-8 pb-8 px-6 text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-foreground">
              Were you discriminated against at work?
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              If your employer discriminated against you, we may be able to help you take the first steps towards getting justice.
            </p>
            <p className="text-muted-foreground">
              This tool will guide you through the ACAS Early Conciliation process — a free service that can help resolve workplace disputes.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="w-full max-w-md mt-8">
        <Button 
          onClick={onNext} 
          size="lg" 
          className="w-full text-lg py-6"
        >
          Check if I can make a claim
        </Button>
      </div>
    </div>
  );
}
