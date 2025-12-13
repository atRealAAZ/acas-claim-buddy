import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, Building2, Info } from 'lucide-react';
import { EmployerDetails } from '@/types/wizard';

interface StepEmployerDetailsProps {
  data: EmployerDetails;
  onChange: (data: EmployerDetails) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepEmployerDetails({ data, onChange, onNext, onBack }: StepEmployerDetailsProps) {
  const updateField = (field: keyof EmployerDetails, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const isValid = data.name.trim() && data.address.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onNext();
  };

  return (
    <div className="min-h-[80vh] flex flex-col px-6 py-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">About your employer</h2>
        <p className="text-muted-foreground text-sm">
          We need their legal name and address for ACAS.
        </p>
      </div>

      <Card className="bg-muted/50 border-muted mb-4">
        <CardContent className="pt-4 pb-4">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              The legal name is usually on your payslips or contract. It may differ from the trading name.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20 flex-1">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="employerName" className="text-foreground">Employer Name</Label>
              <Input
                id="employerName"
                placeholder="e.g. ABC Company Ltd"
                value={data.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="bg-background border-border focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employerAddress" className="text-foreground">Employer Address</Label>
              <Textarea
                id="employerAddress"
                placeholder="e.g. 100 Business Park, London, EC1A 1BB"
                value={data.address}
                onChange={(e) => updateField('address', e.target.value)}
                className="bg-background border-border focus:border-primary min-h-[80px] resize-none"
                required
              />
            </div>

            <div className="flex justify-between pt-6">
              <Button type="button" variant="ghost" onClick={onBack} className="text-muted-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button type="submit" disabled={!isValid} size="lg">
                Review
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
