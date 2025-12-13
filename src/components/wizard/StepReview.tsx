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

  const formatAddress = (address: { addressLine1: string; addressLine2: string; city: string; postcode: string }) => {
    const parts = [address.addressLine1];
    if (address.addressLine2) parts.push(address.addressLine2);
    parts.push(address.city);
    parts.push(address.postcode);
    return parts.join(', ');
  };

  const getSummaryText = () => {
    return `YOUR DETAILS
Name: ${data.userDetails.fullName}
Address: ${formatAddress(data.userDetails)}
Email: ${data.userDetails.email}

EMPLOYER DETAILS
Legal Name: ${data.employerDetails.legalName}
Address: ${formatAddress(data.employerDetails)}`;
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
          <CheckCircle2 className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Review Your Information</h2>
        <p className="text-muted-foreground text-sm">
          Please check that all details are correct before submitting to ACAS.
        </p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Your Details</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onEdit(2)}>
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid grid-cols-[100px_1fr] gap-1">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{data.userDetails.fullName}</span>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-1">
              <span className="text-muted-foreground">Address:</span>
              <span className="font-medium">{formatAddress(data.userDetails)}</span>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-1">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{data.userDetails.email}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Employer Details</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onEdit(3)}>
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid grid-cols-[100px_1fr] gap-1">
              <span className="text-muted-foreground">Legal Name:</span>
              <span className="font-medium">{data.employerDetails.legalName}</span>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-1">
              <span className="text-muted-foreground">Address:</span>
              <span className="font-medium">{formatAddress(data.employerDetails)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 justify-center print:hidden">
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <Copy className="w-4 h-4 mr-2" />
          Copy
        </Button>
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
      </div>

      <Card className="border-primary/20 bg-primary/5 print:hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">What's Next?</CardTitle>
          <CardDescription>
            Follow these steps to submit your Early Conciliation notification to ACAS.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">1</div>
              <div>
                <p className="font-medium text-sm">Submit to ACAS Online</p>
                <p className="text-sm text-muted-foreground">
                  Use the button below to go to the official ACAS Early Conciliation form and enter your details.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">2</div>
              <div>
                <p className="font-medium text-sm">Wait for Contact</p>
                <p className="text-sm text-muted-foreground">
                  ACAS will contact you and your employer to arrange conciliation. This usually happens within a few days.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">3</div>
              <div>
                <p className="font-medium text-sm">Receive Your Certificate</p>
                <p className="text-sm text-muted-foreground">
                  Whether conciliation succeeds or not, you'll receive a certificate number that you'll need if you proceed to tribunal.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <a
              href="https://www.acas.org.uk/early-conciliation/notify-acas"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button className="w-full sm:w-auto">
                Go to ACAS Online Form
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Or call ACAS: <strong>0300 123 1100</strong> (Monday to Friday, 8am to 6pm)
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="pt-2 print:hidden">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  );
}
