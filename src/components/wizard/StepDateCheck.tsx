import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar, ExternalLink, AlertCircle } from 'lucide-react';

interface StepDateCheckProps {
  onBack: () => void;
}

export function StepDateCheck({ onBack }: StepDateCheckProps) {
  const [date, setDate] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date) setSubmitted(true);
  };

  const isTooLate = () => {
    if (!date) return false;
    const discriminationDate = new Date(date);
    const today = new Date();
    const threeMonthsMinusOneDay = new Date(discriminationDate);
    threeMonthsMinusOneDay.setMonth(threeMonthsMinusOneDay.getMonth() + 3);
    threeMonthsMinusOneDay.setDate(threeMonthsMinusOneDay.getDate() - 1);
    return today > threeMonthsMinusOneDay;
  };

  if (submitted && isTooLate()) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 animate-in fade-in duration-500">
        <Card className="bg-destructive/10 border-destructive/20 max-w-md w-full">
          <CardContent className="pt-8 pb-8 px-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Unfortunately, you may be too late
            </h2>
            <p className="text-muted-foreground">
              ACAS Early Conciliation must typically be started within 3 months minus 1 day of the discrimination occurring.
            </p>
            <p className="text-sm text-muted-foreground">
              However, there may be exceptions. We recommend seeking legal advice to understand your options.
            </p>
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

  if (submitted && !isTooLate()) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 animate-in fade-in duration-500">
        <Card className="bg-primary/10 border-primary/20 max-w-md w-full">
          <CardContent className="pt-8 pb-8 px-6 text-center space-y-6">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
              <ExternalLink className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              You're within the time limit
            </h2>
            <div className="space-y-4 text-left">
              <p className="text-muted-foreground">
                To start the ACAS Early Conciliation process, you'll need to complete their official form.
              </p>
              <div className="bg-background/50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-foreground">What you'll need:</p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Your name and contact details</li>
                  <li>Your employer's name and address</li>
                  <li>Brief details of your complaint</li>
                </ul>
              </div>
            </div>
            <a
              href="https://www.acas.org.uk/notify/wizard/individual/form"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button size="lg" className="w-full text-lg py-6">
                Go to ACAS Form
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
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

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 animate-in fade-in duration-500">
      <Card className="bg-primary/10 border-primary/20 max-w-md w-full">
        <CardContent className="pt-8 pb-8 px-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">When did the discrimination happen?</h2>
            <p className="text-sm text-muted-foreground">
              This helps us check if you're within the time limit.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-foreground">Date of discrimination</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-background border-border focus:border-primary"
                required
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="ghost" onClick={onBack} className="text-muted-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button type="submit" size="lg" disabled={!date}>
                Check
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
