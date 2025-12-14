import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar as CalendarIcon, ExternalLink, AlertCircle } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import confusedPersonImg from '@/assets/confused-person.png';
import sadPersonImg from '@/assets/sad-person.png';
interface StepDateCheckProps {
  onBack: () => void;
  onNext: () => void;
}
export function StepDateCheck({
  onBack,
  onNext
}: StepDateCheckProps) {
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
    return <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 animate-in fade-in duration-500">
        <div className="max-w-sm w-full space-y-8">
          {/* Illustration */}
          <div className="flex justify-center">
            <img src={sadPersonImg} alt="Sad person" className="w-48 h-48 object-contain" />
          </div>

          {/* Content */}
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold text-foreground">
              Unfortunately, you may be too late
            </h2>
            <p className="text-muted-foreground">
              ACAS Early Conciliation must typically be started within 3 months minus 1 day of the discrimination occurring.
            </p>
            <p className="text-sm text-muted-foreground">
              However, there may be exceptions. We recommend seeking legal advice to understand your options.
            </p>
          </div>

          {/* Cloisters Contact */}
          <div className="bg-muted/50 rounded-xl p-4 space-y-2">
            <p className="text-sm font-medium text-foreground text-center">Contact Cloisters for legal advice:</p>
            <div className="flex flex-col items-center gap-1">
              <a href="https://cloisters.com" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                cloisters.com
                <ExternalLink className="w-3 h-3" />
              </a>
              <a href="tel:02078274000" className="text-sm text-primary hover:underline">
                020 7827 4000
              </a>
            </div>
          </div>

          {/* Back */}
          <div className="pt-2">
            <Button variant="ghost" onClick={() => setSubmitted(false)} className="text-muted-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </div>;
  }
  if (submitted && !isTooLate()) {
    return <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 animate-in fade-in duration-500">
        <div className="max-w-sm w-full space-y-8">
          {/* Illustration */}
          <div className="flex justify-center">
            <img src={confusedPersonImg} alt="Person thinking" className="w-48 h-48 object-contain" />
          </div>

          {/* Content */}
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold text-foreground">
              You're potentially eligible
            </h2>
            <p className="text-muted-foreground">Based on the date you shared, you’re within the time limit to start ACAS Early Conciliation.  Creating an account lets you save your progress and continue when you’re ready.</p>
            <p className="text-sm text-muted-foreground">
          </p>
          </div>

          {/* Button */}
          <Button size="lg" className="w-full h-14 rounded-2xl text-lg font-semibold" onClick={onNext}>
            Create Account
          </Button>

          {/* Back */}
          <div className="pt-2">
            <Button variant="ghost" onClick={() => setSubmitted(false)} className="text-muted-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 animate-in fade-in duration-500">
      <div className="max-w-sm w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">When did this happen?</h2>
          <p className="text-sm text-muted-foreground">This helps us check time limits — if you’re not sure, that’s okay.</p>
        </div>

        {/* Inline Calendar */}
        <div className="space-y-2">
          <Label className="text-foreground text-sm font-medium">Date of discrimination</Label>
          <div className="flex justify-center">
          <Calendar mode="single" selected={date} onSelect={setDate} disabled={d => d > new Date()} className="p-4 rounded-2xl border-2 border-primary/30 bg-card" classNames={{
            months: "flex flex-col",
            month: "space-y-4",
            caption: "flex justify-between items-center px-1",
            caption_label: "text-lg font-bold text-foreground flex items-center gap-1",
            nav: "flex items-center gap-1",
            nav_button: "h-7 w-7 bg-transparent p-0 text-primary hover:text-primary/80 transition-colors inline-flex items-center justify-center",
            nav_button_previous: "",
            nav_button_next: "",
            table: "w-full border-collapse",
            head_row: "flex",
            head_cell: "text-muted-foreground w-9 font-normal text-xs text-center",
            row: "flex w-full mt-1",
            cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
            day: "h-9 w-9 p-0 font-normal text-foreground hover:bg-primary/10 rounded-lg transition-colors inline-flex items-center justify-center",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "text-muted-foreground/40",
            day_disabled: "text-muted-foreground/30",
            day_hidden: "invisible"
          }} />
          </div>
        </div>

        {/* Not sure option */}
        <button type="button" onClick={onNext} className="w-full text-center text-sm text-muted-foreground hover:text-foreground underline transition-colors">
          I'm not sure of the exact date
        </button>

        {/* Next Button */}
        <Button onClick={handleSubmit} size="lg" disabled={!date} className="w-full h-14 rounded-2xl text-lg font-semibold">
          Next
        </Button>

        {/* Back */}
        <div className="pt-2">
          <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    </div>;
}