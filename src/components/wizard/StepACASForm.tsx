import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepACASFormProps {
  onBack: () => void;
  onNext: () => void;
}

export function StepACASForm({ onBack, onNext }: StepACASFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [employerAddress, setEmployerAddress] = useState('');

  const currentSegment = 1;
  const totalSegments = 4;
  const percentComplete = Math.round((currentSegment / totalSegments) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="min-h-[80vh] flex flex-col px-6 py-8 animate-in fade-in duration-500">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-primary text-center mb-8">
        ACAS Pre-conciliation
      </h1>

      {/* Progress Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-foreground">
            {percentComplete}% to complete
          </span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">13min</span>
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="space-y-5 flex-1">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-primary font-medium">
              Full Name
            </Label>
            <Input
              id="fullName"
              placeholder="Email"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-14 rounded-2xl border-2 border-muted/50 bg-background px-5 text-base placeholder:text-muted-foreground/60 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-primary font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 rounded-2xl border-2 border-muted/50 bg-background px-5 text-base placeholder:text-muted-foreground/60 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employerName" className="text-primary font-medium">
              Employer Name
            </Label>
            <Input
              id="employerName"
              placeholder="Email"
              value={employerName}
              onChange={(e) => setEmployerName(e.target.value)}
              className="h-14 rounded-2xl border-2 border-muted/50 bg-background px-5 text-base placeholder:text-muted-foreground/60 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employerAddress" className="text-primary font-medium">
              Employer Address
            </Label>
            <Input
              id="employerAddress"
              placeholder="Email"
              value={employerAddress}
              onChange={(e) => setEmployerAddress(e.target.value)}
              className="h-14 rounded-2xl border-2 border-muted/50 bg-background px-5 text-base placeholder:text-muted-foreground/60 focus:border-primary"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-8">
          <Button
            type="submit"
            className="w-full h-14 rounded-full text-lg font-semibold"
          >
            Generate ACAS Form
          </Button>
        </div>
      </form>
    </div>
  );
}