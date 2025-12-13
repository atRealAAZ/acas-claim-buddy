import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { UserDetails } from '@/types/wizard';

interface StepUserDetailsProps {
  data: UserDetails;
  onChange: (data: UserDetails) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepUserDetails({ data, onChange, onNext, onBack }: StepUserDetailsProps) {
  const updateField = (field: keyof UserDetails, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const isValid = data.fullName.trim() && data.addressLine1.trim() && data.city.trim() && data.postcode.trim() && data.email.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onNext();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Your Details</h2>
        <p className="text-muted-foreground text-sm">
          Please provide your contact information as it should appear on the ACAS notification.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Personal Information</CardTitle>
          <CardDescription>
            This is how ACAS will contact you about your case.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                value={data.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="addressLine1">Address Line 1 *</Label>
              <Input
                id="addressLine1"
                placeholder="Street address"
                value={data.addressLine1}
                onChange={(e) => updateField('addressLine1', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="addressLine2">Address Line 2</Label>
              <Input
                id="addressLine2"
                placeholder="Apartment, suite, etc. (optional)"
                value={data.addressLine2}
                onChange={(e) => updateField('addressLine2', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={data.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postcode">Postcode *</Label>
                <Input
                  id="postcode"
                  placeholder="Postcode"
                  value={data.postcode}
                  onChange={(e) => updateField('postcode', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={data.email}
                onChange={(e) => updateField('email', e.target.value)}
                required
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button type="submit" disabled={!isValid}>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
