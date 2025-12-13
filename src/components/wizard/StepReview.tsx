import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Printer, ExternalLink, Phone, CheckCircle2 } from 'lucide-react';
import { WizardData } from '@/types/wizard';
import { useToast } from '@/hooks/use-toast';

interface StepReviewProps {
  data: WizardData;
  onBack: () => void;
  onEdit: (step: number) => void;
}

export function StepReview({ data, onBack, onEdit }: StepReviewProps) {
  const { toast } = useToast();

  const getSummaryText = () => {
    return `YOUR DETAILS
Name: ${data.userDetails.name}
Address: ${data.userDetails.address}
Email: ${data.userDetails.email}

EMPLOYER DETAILS
Name: ${data.employerDetails.name}
Address: ${data.employerDetails.address}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getSummaryText());
      toast({
        title: "Copied to clipboard",
        description: "You can now paste this information into the ACAS form.",
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Please select and copy the text manually.",
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-[80vh] flex flex-col px-6 py-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Review Your Information</h2>
        <p className="text-muted-foreground text-sm">
          Check everything looks right before submitting.
        </p>
      </div>

      <div className="grid gap-4 mb-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Your Details</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onEdit(2)} className="text-primary">
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Name: </span>
              <span className="font-medium">{data.userDetails.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Address: </span>
              <span className="font-medium">{data.userDetails.address}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Email: </span>
              <span className="font-medium">{data.userDetails.email}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Employer Details</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onEdit(3)} className="text-primary">
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Name: </span>
              <span className="font-medium">{data.employerDetails.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Address: </span>
              <span className="font-medium">{data.employerDetails.address}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 justify-center mb-6 print:hidden">
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <Copy className="w-4 h-4 mr-2" />
          Copy
        </Button>
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
      </div>

      <Card className="border-primary/20 bg-primary/5 print:hidden mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">What's Next?</CardTitle>
          <CardDescription>
            Submit your details to ACAS to start Early Conciliation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">1</div>
              <p className="text-sm text-muted-foreground">
                Go to the ACAS website and enter your details
              </p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">2</div>
              <p className="text-sm text-muted-foreground">
                ACAS will contact you and your employer
              </p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">3</div>
              <p className="text-sm text-muted-foreground">
                You'll receive a certificate for tribunal (if needed)
              </p>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <a
              href="https://www.acas.org.uk/early-conciliation/notify-acas"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button className="w-full" size="lg">
                Go to ACAS Form
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              Or call: <strong>0300 123 1100</strong>
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="print:hidden">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  );
}
