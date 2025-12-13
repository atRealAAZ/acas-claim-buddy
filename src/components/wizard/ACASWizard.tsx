import { useState } from 'react';
import { ProgressIndicator } from './ProgressIndicator';
import { StepIntroduction } from './StepIntroduction';
import { StepChooseOptions } from './StepChooseOptions';
import { StepDateCheck } from './StepDateCheck';
import { StepSignUp } from './StepSignUp';
import { Timeline } from './Timeline';
import { useAuth } from '@/hooks/useAuth';

const STEP_LABELS = ['Introduction', 'Options', 'Date Check', 'Sign Up'];

export function ACASWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const { user, loading } = useAuth();

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // Show loading state
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
        <div className="mb-8">
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={4}
            labels={STEP_LABELS}
          />
        </div>

        {currentStep === 1 && (
          <StepIntroduction onNext={nextStep} />
        )}

        {currentStep === 2 && (
          <StepChooseOptions onBack={prevStep} onNext={nextStep} />
        )}

        {currentStep === 3 && (
          <StepDateCheck onBack={prevStep} onNext={nextStep} />
        )}

        {currentStep === 4 && (
          <StepSignUp onBack={prevStep} onNext={() => {}} />
        )}
      </div>
    </div>
  );
}
