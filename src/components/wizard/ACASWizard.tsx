import { useState } from 'react';
import { ProgressIndicator } from './ProgressIndicator';
import { StepIntroduction } from './StepIntroduction';
import { StepChooseOptions } from './StepChooseOptions';
import { StepDateCheck } from './StepDateCheck';
import { StepET1Claim } from './StepET1Claim';

const STEP_LABELS = ['Introduction', 'Options', 'ACAS Form', 'ET1 Claim'];

export function ACASWizard() {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

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
          <StepET1Claim onBack={prevStep} />
        )}
      </div>
    </div>
  );
}
