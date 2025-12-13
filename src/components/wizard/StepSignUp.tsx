import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface StepSignUpProps {
  onBack: () => void;
  onNext: () => void;
}

export function StepSignUp({ onBack, onNext }: StepSignUpProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp, signIn, user } = useAuth();

  const isValid = email.trim() !== '' && password.length >= 6 && (isLogin || name.trim() !== '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Logged in successfully!');
        }
      } else {
        const { error } = await signUp(email, password, name);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Account created successfully!');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {isLogin ? 'Welcome Back' : 'Create Your Account'}
        </h1>
        <p className="text-muted-foreground">
          {isLogin 
            ? 'Log in to continue with your case.' 
            : 'Sign up to save your progress and receive updates about your case.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-xl p-6 border border-border space-y-4">
        {!isLogin && (
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
        )}

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

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button type="submit" disabled={!isValid || loading} className="flex-1">
            {loading ? 'Loading...' : isLogin ? 'Log In' : 'Sign Up'}
          </Button>
        </div>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-primary hover:underline font-medium"
        >
          {isLogin ? 'Sign up' : 'Log in'}
        </button>
      </p>
    </div>
  );
}
