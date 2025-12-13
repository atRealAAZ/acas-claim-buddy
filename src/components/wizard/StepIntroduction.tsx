import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Clock, ExternalLink, ArrowRight } from 'lucide-react';

interface StepIntroductionProps {
  onNext: () => void;
}

export function StepIntroduction({ onNext }: StepIntroductionProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="text-center space-y-3">
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
          ACAS Early Conciliation Notification
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          We're here to help you gather the information you need to notify ACAS about your employment dispute.
        </p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            What is Early Conciliation?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Before you can make a claim to an employment tribunal, you must first notify ACAS and go through Early Conciliation. This is a free service that helps resolve workplace disputes without going to tribunal.
          </p>
          <p>
            ACAS will try to help you and your employer reach an agreement. If conciliation doesn't work, ACAS will issue you a certificate so you can proceed to tribunal if you choose.
          </p>
        </CardContent>
      </Card>

      <Card className="border-destructive/30 bg-destructive/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-destructive">
            <Clock className="w-5 h-5" />
            Important: Time Limit
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p className="text-foreground font-medium">
            You must notify ACAS within 3 months minus 1 day from the date of the incident you're complaining about (usually your dismissal date).
          </p>
          <p className="text-muted-foreground mt-2">
            If you miss this deadline, you may lose your right to make a tribunal claim.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">What you'll need</CardTitle>
          <CardDescription>
            This wizard will help you collect the following information:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <span>Your name, address, and email</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <span>Your employer's legal name and address</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="pt-2">
        <a 
          href="https://www.acas.org.uk/early-conciliation" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          Learn more about ACAS Early Conciliation
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="pt-4">
        <Button onClick={onNext} size="lg" className="w-full sm:w-auto">
          Get Started
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
