import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, FileText, ExternalLink, CheckCircle } from 'lucide-react';

interface StepET1ClaimProps {
  onBack: () => void;
  onNext: () => void;
}

export function StepET1Claim({ onBack, onNext }: StepET1ClaimProps) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 animate-in fade-in duration-500">
      <Card className="bg-primary/10 border-primary/20 max-w-md w-full">
        <CardContent className="pt-8 pb-8 px-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">ET1 Claim Form</h2>
            <p className="text-muted-foreground">
              Submit Form ET1 online using the certificate from Step 2.
            </p>
          </div>

          <div className="bg-background/50 rounded-lg p-4 space-y-3">
            <p className="text-sm font-medium text-foreground">What you'll need:</p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span><strong>ACAS Certificate Number</strong> (Essential)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Employment dates</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Pay details</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span><strong>"Grounds of Complaint"</strong> — your story of why you are claiming</span>
              </li>
            </ul>
          </div>

          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm text-destructive font-medium">
              ⏰ Strict Deadline
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Usually 1 month from the date on the ACAS Certificate (or the original 3-month deadline if later).
            </p>
          </div>

          <a
            href="https://www.gov.uk/employment-tribunals/make-a-claim"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button size="lg" className="w-full text-lg py-6">
              Submit ET1 Online
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </a>

          <Button 
            size="lg" 
            variant="ghost"
            onClick={onNext}
            className="w-full text-muted-foreground hover:text-foreground"
          >
            I submitted the ET1
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
