import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, User } from 'lucide-react';
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

  const isValid = data.name.trim() && data.address.trim() && data.email.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onNext();
  };

  return (
    <div className="min-h-[80vh] flex flex-col px-6 py-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <User className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Tell us about you</h2>
        <p className="text-muted-foreground text-sm">
          We just need a few details so ACAS can contact you.
        </p>
      </div>

      <Card className="bg-primary/5 border-primary/20 flex-1">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Your Name</Label>
              <Input
                id="name"
                placeholder="e.g. Sarah Johnson"
                value={data.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="bg-background border-border focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-foreground">Your Address</Label>
              <Textarea
                id="address"
                placeholder="e.g. 42 High Street, Manchester, M1 2AB"
                value={data.address}
                onChange={(e) => updateField('address', e.target.value)}
                className="bg-background border-border focus:border-primary min-h-[80px] resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Your Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g. sarah@email.com"
                value={data.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="bg-background border-border focus:border-primary"
                required
              />
            </div>

            <div className="flex justify-between pt-6">
              <Button type="button" variant="ghost" onClick={onBack} className="text-muted-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button type="submit" disabled={!isValid} size="lg">
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
