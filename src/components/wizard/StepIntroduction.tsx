import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Sparkles } from 'lucide-react';

const EMPATHETIC_MESSAGES = [
  "You deserve to be treated with dignity and respect. What happened to you was wrong, and it's okay to feel angry about it.",
  "Remember: their behaviour says everything about them, and nothing about your worth as a person.",
  "You're not alone in this. Many people have been where you are, and many have found justice.",
  "It takes courage to stand up for yourself. You're already showing incredible strength just by being here.",
  "What they did was not okay. You have every right to seek accountability.",
  "Your feelings are valid. Being mistreated at work is genuinely painful, and you deserve support.",
  "This wasn't your fault. Discrimination is a choice made by those in power, not a reflection of you.",
  "You're taking the first step toward justice. That's something to be proud of.",
];

interface StepIntroductionProps {
  onNext: () => void;
}

export function StepIntroduction({ onNext }: StepIntroductionProps) {
  const [supportMessage, setSupportMessage] = useState<string | null>(null);

  const generateSupportMessage = () => {
    const randomIndex = Math.floor(Math.random() * EMPATHETIC_MESSAGES.length);
    setSupportMessage(EMPATHETIC_MESSAGES[randomIndex]);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 animate-in fade-in duration-500">
      <Card className="bg-primary/10 border-primary/20 max-w-md w-full">
        <CardContent className="pt-8 pb-8 px-6 text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7 text-primary" />
          </div>
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-foreground">
              We're sorry your employer treated you unfairly
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Indeed, they are assholes. Don't worry — we'll help you make them pay.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={generateSupportMessage}
            className="gap-2"
          >
            <Sparkles className="w-4 h-4" />
            I need some encouragement
          </Button>

          {supportMessage && (
            <div className="bg-background/50 rounded-lg p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <p className="text-sm text-foreground/80 italic leading-relaxed">
                "{supportMessage}"
              </p>
            </div>
          )}

          <p className="text-muted-foreground pt-2">
            Once you're ready, we can check if you can make a claim against them.
          </p>
        </CardContent>
      </Card>

      <div className="w-full max-w-md mt-8">
        <Button 
          onClick={onNext} 
          size="lg" 
          className="w-full text-lg py-6"
        >
          Check if I can make a claim
        </Button>
      </div>
    </div>
  );
}
