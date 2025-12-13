import { useState } from 'react';
import { ProgressIndicator } from './ProgressIndicator';
import { StepIntroduction } from './StepIntroduction';
import { StepUserDetails } from './StepUserDetails';
import { StepEmployerDetails } from './StepEmployerDetails';
import { StepReview } from './StepReview';
import { WizardData, initialWizardData } from '@/types/wizard';

const STEP_LABELS = ['Introduction', 'Your Details', 'Employer', 'Review'];

export function ACASWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>(initialWizardData);

  const goToStep = (step: number) => setCurrentStep(step);
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
          <StepUserDetails
            data={wizardData.userDetails}
            onChange={(userDetails) => setWizardData((prev) => ({ ...prev, userDetails }))}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {currentStep === 3 && (
          <StepEmployerDetails
            data={wizardData.employerDetails}
            onChange={(employerDetails) => setWizardData((prev) => ({ ...prev, employerDetails }))}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {currentStep === 4 && (
          <StepReview
            data={wizardData}
            onBack={prevStep}
            onEdit={goToStep}
          />
        )}
      </div>
    </div>
  );
}
