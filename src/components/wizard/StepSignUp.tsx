import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface StepSignUpProps {
  onBack: () => void;
  onNext: () => void;
}

export function StepSignUp({ onBack, onNext }: StepSignUpProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const isValid = name.trim() !== '' && email.trim() !== '';

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Create Your Account</h1>
        <p className="text-muted-foreground">
          Sign up to save your progress and receive updates about your case.
        </p>
      </div>

      <div className="bg-card rounded-xl p-6 border border-border space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={onNext} disabled={!isValid} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  );
}
