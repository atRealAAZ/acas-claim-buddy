import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar as CalendarIcon, ExternalLink, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface StepDateCheckProps {
  onBack: () => void;
  onNext: () => void;
}

export function StepDateCheck({ onBack, onNext }: StepDateCheckProps) {
  const [date, setDate] = useState<Date | undefined>();
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
            <div className="bg-background/50 rounded-lg p-4 text-left space-y-2">
              <p className="text-sm font-medium text-foreground">Contact Cloisters for legal advice:</p>
              <div className="space-y-1">
                <a 
                  href="https://cloisters.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  cloisters.com
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a 
                  href="tel:02078274000"
                  className="text-sm text-primary hover:underline block"
                >
                  020 7827 4000
                </a>
              </div>
            </div>
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
              <CalendarIcon className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              You're potentially eligible
            </h2>
            <p className="text-muted-foreground">
              Based on the date you provided, you're within the time limit to start an ACAS Early Conciliation claim.
            </p>
            <p className="text-sm text-muted-foreground">
              Create an account to save your progress and continue with the process.
            </p>
            <Button size="lg" className="w-full text-lg py-6" onClick={onNext}>
              Create an account
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

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 animate-in fade-in duration-500">
      <Card className="bg-primary/10 border-primary/20 max-w-md w-full">
        <CardContent className="pt-8 pb-8 px-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">When did the discrimination happen?</h2>
            <p className="text-sm text-muted-foreground">
              This helps us check if you're within the time limit.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-foreground">Date of discrimination</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background border-border",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(d) => d > new Date()}
                    initialFocus
                    className="p-4 pointer-events-auto rounded-xl border-2 border-primary/30 bg-card"
                    classNames={{
                      months: "flex flex-col",
                      month: "space-y-4",
                      caption: "flex justify-between items-center px-2",
                      caption_label: "text-lg font-bold text-foreground flex items-center gap-1",
                      nav: "flex items-center gap-1",
                      nav_button: "h-8 w-8 bg-transparent p-0 text-primary hover:text-primary/80 transition-colors",
                      nav_button_previous: "",
                      nav_button_next: "",
                      table: "w-full border-collapse",
                      head_row: "flex",
                      head_cell: "text-muted-foreground w-10 font-normal text-xs flex flex-col items-center",
                      row: "flex w-full",
                      cell: "h-10 w-10 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                      day: "h-10 w-10 p-0 font-normal text-foreground hover:bg-primary/10 rounded-lg transition-colors",
                      day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                      day_today: "bg-accent text-accent-foreground",
                      day_outside: "text-muted-foreground/40",
                      day_disabled: "text-muted-foreground/30",
                      day_hidden: "invisible",
                    }}
                  />
                </PopoverContent>
              </Popover>
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
