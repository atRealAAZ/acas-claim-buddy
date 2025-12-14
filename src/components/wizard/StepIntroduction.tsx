import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import confusedPersonImg from '@/assets/confused-person.png';
const EMPATHETIC_MESSAGES = ["You deserve to be treated with dignity and respect. What happened to you was wrong, and it's okay to feel angry about it.", "Remember: their behaviour says everything about them, and nothing about your worth as a person.", "You're not alone in this. Many people have been where you are, and many have found justice.", "It takes courage to stand up for yourself. You're already showing incredible strength just by being here.", "What they did was not okay. You have every right to seek accountability.", "Your feelings are valid. Being mistreated at work is genuinely painful, and you deserve support.", "This wasn't your fault. Discrimination is a choice made by those in power, not a reflection of you.", "You're taking the first step toward justice. That's something to be proud of."];
interface StepIntroductionProps {
  onNext: () => void;
}
export function StepIntroduction({
  onNext
}: StepIntroductionProps) {
  const [supportMessage, setSupportMessage] = useState<string | null>(null);
  const generateSupportMessage = () => {
    const randomIndex = Math.floor(Math.random() * EMPATHETIC_MESSAGES.length);
    setSupportMessage(EMPATHETIC_MESSAGES[randomIndex]);
  };
  return <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 animate-in fade-in duration-500">
      <div className="max-w-sm w-full space-y-8">
        {/* Illustration */}
        <div className="flex justify-center">
          <img src={confusedPersonImg} alt="Person thinking" className="w-48 h-48 object-contain" />
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Welcome,
let’s take this one step at a time</h1>
          <p className="text-muted-foreground leading-relaxed">If you’ve been treated unfairly at work, this guided process helps you begin the legal steps calmly and safely.</p>
        </div>

        {/* Encouragement Button */}
        <div className="space-y-4">
          <Button variant="outline" onClick={generateSupportMessage} className="w-full gap-2 rounded-2xl h-12">
            <Sparkles className="w-4 h-4" />
            I need some encouragement
          </Button>

          {supportMessage && <div className="bg-muted/50 rounded-xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <p className="text-sm text-foreground/80 italic leading-relaxed text-center">
                "{supportMessage}"
              </p>
            </div>}
        </div>

        {/* CTA text */}
        <p className="text-center text-sm text-muted-foreground">
          Once you're ready, we can check if you can make a claim against them.
        </p>

        {/* Button */}
        <Button onClick={onNext} size="lg" className="w-full h-14 rounded-2xl text-lg font-semibold">
          Check if I can make a claim
        </Button>
      </div>
    </div>;
}