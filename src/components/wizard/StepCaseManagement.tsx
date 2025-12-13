import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, FolderOpen, Upload, FileText } from 'lucide-react';

interface StepCaseManagementProps {
  onBack: () => void;
}

export function StepCaseManagement({ onBack }: StepCaseManagementProps) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 animate-in fade-in duration-500">
      <Card className="bg-primary/10 border-primary/20 max-w-md w-full">
        <CardContent className="pt-8 pb-8 px-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Case Management</h2>
            <p className="text-muted-foreground">
              Upload and manage your case documents here.
            </p>
          </div>

          <div className="bg-background/50 rounded-lg p-4 space-y-4">
            <p className="text-sm font-medium text-foreground">Documents to upload:</p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Employer's ET3 response</span>
              </li>
              <li className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Employment contract</span>
              </li>
              <li className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Payslips and P45/P60</span>
              </li>
              <li className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Correspondence with employer</span>
              </li>
              <li className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Any evidence supporting your claim</span>
              </li>
            </ul>
          </div>

          <Button size="lg" className="w-full text-lg py-6">
            <Upload className="w-5 h-5 mr-2" />
            Upload Documents
          </Button>
        </CardContent>
      </Card>
      <div className="w-full max-w-md mt-6">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  );
}
