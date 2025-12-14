import { useState, useEffect, useRef } from 'react';
import { ProgressIndicator } from './ProgressIndicator';
import { StepIntroduction } from './StepIntroduction';
import { StepChooseOptions } from './StepChooseOptions';
import { StepDateCheck } from './StepDateCheck';
import { StepSignUp } from './StepSignUp';
import { StepACASForm } from './StepACASForm';
import { Timeline } from './Timeline';
import { useAuth } from '@/hooks/useAuth';

const STEP_LABELS = ['Introduction', 'Options', 'Date Check', 'Sign Up', 'ACAS Form'];

export function ACASWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [discriminationDate, setDiscriminationDate] = useState<string | undefined>();
  const { user, loading } = useAuth();
  const wasLoggedIn = useRef(false);

  // Track login state and redirect to sign-up on logout
  useEffect(() => {
    if (user) {
      wasLoggedIn.current = true;
    } else if (wasLoggedIn.current && !loading) {
      // User just logged out, go to sign-up step
      setCurrentStep(4);
      wasLoggedIn.current = false;
    }
  }, [user, loading]);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleDateCheckNext = (date?: string) => {
    setDiscriminationDate(date);
    nextStep();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // If user is logged in, show timeline
  if (user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
          <Timeline />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">

        {currentStep === 1 && (
          <StepIntroduction onNext={nextStep} />
        )}

        {currentStep === 2 && (
          <StepChooseOptions onBack={prevStep} onNext={nextStep} />
        )}

        {currentStep === 3 && (
          <StepDateCheck onBack={prevStep} onNext={handleDateCheckNext} />
        )}

        {currentStep === 4 && (
          <StepSignUp onBack={prevStep} onNext={nextStep} discriminationDate={discriminationDate} />
        )}

        {currentStep === 5 && (
          <StepACASForm onBack={prevStep} onNext={() => {}} />
        )}
      </div>
    </div>
  );
}
