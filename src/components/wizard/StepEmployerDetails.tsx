import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Info } from 'lucide-react';
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

  const isValid = data.legalName.trim() && data.addressLine1.trim() && data.city.trim() && data.postcode.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onNext();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Employer Details</h2>
        <p className="text-muted-foreground text-sm">
          Provide the legal name and address of your employer.
        </p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-4">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Tip:</strong> The legal name is usually found on your employment contract, payslips, or the company's Companies House registration. It may differ from the trading name.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Employer Information</CardTitle>
          <CardDescription>
            ACAS will use this to contact your employer about conciliation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="legalName">Employer's Legal Name *</Label>
              <Input
                id="legalName"
                placeholder="e.g., ABC Company Ltd"
                value={data.legalName}
                onChange={(e) => updateField('legalName', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="empAddressLine1">Address Line 1 *</Label>
              <Input
                id="empAddressLine1"
                placeholder="Street address"
                value={data.addressLine1}
                onChange={(e) => updateField('addressLine1', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="empAddressLine2">Address Line 2</Label>
              <Input
                id="empAddressLine2"
                placeholder="Building, floor, etc. (optional)"
                value={data.addressLine2}
                onChange={(e) => updateField('addressLine2', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="empCity">City *</Label>
                <Input
                  id="empCity"
                  placeholder="City"
                  value={data.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="empPostcode">Postcode *</Label>
                <Input
                  id="empPostcode"
                  placeholder="Postcode"
                  value={data.postcode}
                  onChange={(e) => updateField('postcode', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button type="submit" disabled={!isValid}>
                Review Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
