import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Clock, Mail } from 'lucide-react';

interface StepWaitingResponseProps {
  onBack: () => void;
  onNext: () => void;
}

export function StepWaitingResponse({ onBack, onNext }: StepWaitingResponseProps) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 animate-in fade-in duration-500">
      <Card className="bg-primary/10 border-primary/20 max-w-md w-full">
        <CardContent className="pt-8 pb-8 px-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Waiting for Employer Response</h2>
            <p className="text-muted-foreground">
              Your employer has been notified of your claim.
            </p>
          </div>

          <div className="bg-background/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <span className="text-lg font-bold text-primary">28</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Days to respond</p>
                <p className="text-sm text-muted-foreground">
                  Your employer has 28 days to submit their response to the tribunal.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-2">
              <Mail className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                You will receive a copy of their response (called an "ET3") by post or email from the tribunal.
              </p>
            </div>
          </div>

          <Button 
            size="lg" 
            variant="outline"
            onClick={onNext}
            className="w-full text-lg py-6 border-primary/30 hover:bg-primary/10"
          >
            My employer sent a response
          </Button>
        </CardContent>
      </Card>
      <div className="w-full max-w-md mt-6">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  );
}
