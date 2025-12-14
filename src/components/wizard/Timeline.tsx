import { useState, useEffect, useRef } from 'react';
import { Check, ChevronDown, ChevronRight, Upload, Sparkles, FileText, Loader2, CheckCircle2, Send, Clock, CalendarIcon } from 'lucide-react';
import { addMonths, addDays, format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { GreenPTFloatingChat } from '@/components/GreenPTFloatingChat';
import { MeditationWidget } from '@/components/MeditationWidget';
import { FormProgress } from './FormProgress';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

interface FormData {
  // Personal details
  fullName: string;
  address: string;
  email: string;
  phone: string;
  // Employer details
  employerName: string;
  employerAddress: string;
  // Employment details
  employmentStartDate: string;
  employmentEndDate: string;
  jobTitle: string;
  weeklyPay: string;
  noticePeriod: string;
  // ACAS specific
  complaintSummary: string;
  // ET1 specific
  acasCertificateNumber: string;
  claimType: string;
  detailedComplaint: string;
  desiredOutcome: string;
}

const initialFormData: FormData = {
  fullName: '',
  address: '',
  email: '',
  phone: '',
  employerName: '',
  employerAddress: '',
  employmentStartDate: '',
  employmentEndDate: '',
  jobTitle: '',
  weeklyPay: '',
  noticePeriod: '',
  complaintSummary: '',
  acasCertificateNumber: '',
  claimType: '',
  detailedComplaint: '',
  desiredOutcome: '',
};

export function Timeline() {
  const { signOut, user } = useAuth();
  const [activeStage, setActiveStage] = useState<string>('acas');
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [generatedForms, setGeneratedForms] = useState<{ acas?: string; et1?: string }>({});
  const [acceptedForms, setAcceptedForms] = useState<{ acas: boolean; et1: boolean }>({ acas: false, et1: false });
  const [sentForms, setSentForms] = useState<{ acas: boolean; et1: boolean }>({ acas: false, et1: false });
  const [expandedForms, setExpandedForms] = useState<{ acas: boolean; et1: boolean }>({ acas: true, et1: true });
  const [isGenerating, setIsGenerating] = useState<{ acas: boolean; et1: boolean }>({ acas: false, et1: false });
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File[] }>({});
  const [showAutosaved, setShowAutosaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Autosave effect - triggers when form data changes
  useEffect(() => {
    // Clear existing timeout
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    // Only show autosave if there's actual data
    const hasData = Object.values(formData).some(value => value.trim() !== '');
    if (!hasData) {
      setShowAutosaved(false);
      return;
    }

    // Show saving state immediately
    setIsSaving(true);

    // Debounce autosave by 1 second
    autosaveTimeoutRef.current = setTimeout(() => {
      // Simulate autosave (in real app, this would save to backend)
      setIsSaving(false);
      setShowAutosaved(true);
    }, 1000);

    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, [formData]);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (stageId: string, files: FileList | null) => {
    if (files) {
      setUploadedFiles(prev => ({
        ...prev,
        [stageId]: [...(prev[stageId] || []), ...Array.from(files)]
      }));
      toast.success(`${files.length} file(s) uploaded`);
    }
  };

  const generateForm = async (formType: 'acas' | 'et1') => {
    setIsGenerating(prev => ({ ...prev, [formType]: true }));
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-form`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ formType, formData }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate form');
      }

      const data = await response.json();
      setGeneratedForms(prev => ({ ...prev, [formType]: data.generatedForm }));
      toast.success(`${formType.toUpperCase()} form generated successfully!`);
    } catch (error) {
      console.error('Error generating form:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate form');
    } finally {
      setIsGenerating(prev => ({ ...prev, [formType]: false }));
    }
  };

  // Calculate deadlines based on termination date
  const getDeadlines = () => {
    if (!formData.employmentEndDate) return { acas: null, et1: null };
    const terminationDate = new Date(formData.employmentEndDate);
    const acasDeadline = addDays(addMonths(terminationDate, 3), -1);
    const et1Deadline = addDays(acasDeadline, 30);
    return { acas: acasDeadline, et1: et1Deadline };
  };

  const deadlines = getDeadlines();

  const getDeadlineInfo = (deadline: Date | null) => {
    if (!deadline) return null;
    const daysRemaining = differenceInDays(deadline, new Date());
    const isUrgent = daysRemaining <= 14;
    const isPast = daysRemaining < 0;
    return { date: deadline, daysRemaining, isUrgent, isPast };
  };

  const isStageComplete = (stageId: string) => {
    if (stageId === 'acas') return sentForms.acas;
    if (stageId === 'et1') return sentForms.et1;
    return false;
  };

  const stages = [
    { id: 'acas', title: 'ACAS Pre-conciliation', timeEstimate: '13min', progress: 0 },
    { id: 'et1', title: 'ET1 Form', timeEstimate: '9min', progress: 33 },
    { id: 'waiting', title: 'Waiting Employer Response', timeEstimate: '5min', progress: 66 },
  ];

  const navigateToNextStage = () => {
    const currentIndex = stages.findIndex(s => s.id === activeStage);
    if (currentIndex < stages.length - 1) {
      setActiveStage(stages[currentIndex + 1].id);
    }
  };

  const inputClassName = "h-14 rounded-2xl border-2 border-muted/50 bg-background px-5 text-base placeholder:text-muted-foreground/60 focus:border-primary";
  const textareaClassName = "rounded-2xl border-2 border-muted/50 bg-background px-5 py-4 text-base placeholder:text-muted-foreground/60 focus:border-primary resize-none";

  // Render ACAS Form
  const renderAcasForm = () => (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-primary font-medium">Full Name</Label>
        <Input
          id="fullName"
          value={formData.fullName}
          onChange={(e) => updateFormData('fullName', e.target.value)}
          placeholder="Enter your full name"
          className={inputClassName}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-primary font-medium">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData('email', e.target.value)}
          placeholder="Enter your email"
          className={inputClassName}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="employerName" className="text-primary font-medium">Employer Name</Label>
        <Input
          id="employerName"
          value={formData.employerName}
          onChange={(e) => updateFormData('employerName', e.target.value)}
          placeholder="Enter employer name"
          className={inputClassName}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="employerAddress" className="text-primary font-medium">Employer Address</Label>
        <Input
          id="employerAddress"
          value={formData.employerAddress}
          onChange={(e) => updateFormData('employerAddress', e.target.value)}
          placeholder="Enter employer address"
          className={inputClassName}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-primary font-medium">Employment End Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full h-14 rounded-2xl border-2 border-muted/50 bg-background px-5 text-base justify-start text-left font-normal overflow-hidden",
                !formData.employmentEndDate && "text-muted-foreground/60"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
              <span className="truncate">
                {formData.employmentEndDate ? format(new Date(formData.employmentEndDate), "PPP") : "Select the date your employment ended"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.employmentEndDate ? new Date(formData.employmentEndDate) : undefined}
              onSelect={(date) => updateFormData('employmentEndDate', date ? format(date, 'yyyy-MM-dd') : '')}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="pt-4">
        <Button
          onClick={() => generateForm('acas')}
          disabled={isGenerating.acas}
          className="w-full h-14 rounded-full text-lg font-semibold"
          size="lg"
        >
          {isGenerating.acas ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate ACAS Form'
          )}
        </Button>
      </div>

      {generatedForms.acas && (
        <Collapsible
          open={expandedForms.acas}
          onOpenChange={(open) => setExpandedForms(prev => ({ ...prev, acas: open }))}
        >
          <div className="mt-4 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/20">
            <CollapsibleTrigger className="w-full flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Generated ACAS Form</h3>
                {sentForms.acas && (
                  <span className="ml-2 px-2.5 py-0.5 bg-green-500/20 text-green-600 text-xs font-semibold rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Sent
                  </span>
                )}
              </div>
              {expandedForms.acas ? (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <Textarea
                value={generatedForms.acas}
                onChange={(e) => setGeneratedForms(prev => ({ ...prev, acas: e.target.value }))}
                className="min-h-[300px] font-serif text-base leading-relaxed bg-background border-border resize-y rounded-xl"
                disabled={acceptedForms.acas}
              />
              {!acceptedForms.acas && (
                <Button
                  onClick={() => {
                    setAcceptedForms(prev => ({ ...prev, acas: true }));
                    toast.success('ACAS form accepted!');
                  }}
                  className="w-full mt-4 h-12 rounded-full"
                  size="lg"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Accept ACAS Form
                </Button>
              )}
              {acceptedForms.acas && !sentForms.acas && (
                <Button
                  onClick={() => {
                    setSentForms(prev => ({ ...prev, acas: true }));
                    toast.success('ACAS form sent!');
                  }}
                  className="w-full mt-4 h-12 rounded-full"
                  size="lg"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send ACAS Form
                </Button>
              )}
            </CollapsibleContent>
          </div>
        </Collapsible>
      )}

      <div className="pt-4">
        <Button
          onClick={navigateToNextStage}
          variant="outline"
          className="w-full h-12 rounded-full"
          size="lg"
        >
          Next
        </Button>
      </div>
    </div>
  );

  // Render ET1 Form
  const renderET1Form = () => (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="acasCertificateNumber" className="text-primary font-medium">ACAS Certificate Number</Label>
        <Input
          id="acasCertificateNumber"
          value={formData.acasCertificateNumber}
          onChange={(e) => updateFormData('acasCertificateNumber', e.target.value)}
          placeholder="R123456/78/90"
          className={inputClassName}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="desiredOutcome" className="text-primary font-medium">Desired Outcome</Label>
        <Textarea
          id="desiredOutcome"
          value={formData.desiredOutcome}
          onChange={(e) => updateFormData('desiredOutcome', e.target.value)}
          placeholder="e.g., Compensation, reinstatement, apology"
          rows={4}
          className={textareaClassName}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="detailedComplaint" className="text-primary font-medium">Detailed Ground of Complaint</Label>
        <Textarea
          id="detailedComplaint"
          value={formData.detailedComplaint}
          onChange={(e) => updateFormData('detailedComplaint', e.target.value)}
          placeholder="Provide a detailed account of what happened..."
          rows={6}
          className={textareaClassName}
        />
      </div>

      <div className="pt-4">
        <Button
          onClick={() => generateForm('et1')}
          disabled={isGenerating.et1}
          className="w-full h-14 rounded-full text-lg font-semibold"
          size="lg"
        >
          {isGenerating.et1 ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate ET1 Form'
          )}
        </Button>
      </div>

      {generatedForms.et1 && (
        <Collapsible
          open={expandedForms.et1}
          onOpenChange={(open) => setExpandedForms(prev => ({ ...prev, et1: open }))}
        >
          <div className="mt-4 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/20">
            <CollapsibleTrigger className="w-full flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Generated ET1 Form</h3>
                {sentForms.et1 && (
                  <span className="ml-2 px-2.5 py-0.5 bg-green-500/20 text-green-600 text-xs font-semibold rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Sent
                  </span>
                )}
              </div>
              {expandedForms.et1 ? (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <Textarea
                value={generatedForms.et1}
                onChange={(e) => setGeneratedForms(prev => ({ ...prev, et1: e.target.value }))}
                className="min-h-[400px] font-serif text-base leading-relaxed bg-background border-border resize-y rounded-xl"
                disabled={acceptedForms.et1}
              />
              {!acceptedForms.et1 && (
                <Button
                  onClick={() => {
                    setAcceptedForms(prev => ({ ...prev, et1: true }));
                    toast.success('ET1 form accepted!');
                  }}
                  className="w-full mt-4 h-12 rounded-full"
                  size="lg"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Accept ET1 Form
                </Button>
              )}
              {acceptedForms.et1 && !sentForms.et1 && (
                <Button
                  onClick={() => {
                    setSentForms(prev => ({ ...prev, et1: true }));
                    toast.success('ET1 form sent!');
                  }}
                  className="w-full mt-4 h-12 rounded-full"
                  size="lg"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send ET1 Form
                </Button>
              )}
            </CollapsibleContent>
          </div>
        </Collapsible>
      )}

      <div className="pt-4">
        <Button
          onClick={navigateToNextStage}
          variant="outline"
          className="w-full h-12 rounded-full"
          size="lg"
        >
          Next
        </Button>
      </div>
    </div>
  );


  // Render Waiting Response section with meditation
  const renderWaitingResponse = () => (
    <div className="space-y-5">
      <div className="text-center py-8">
        <Clock className="w-16 h-16 mx-auto mb-4 text-primary/50" />
        <h3 className="text-xl font-semibold text-foreground mb-2">Waiting for Employer Response</h3>
        <p className="text-muted-foreground">Your case has been submitted. Take some time to relax while waiting for a response.</p>
      </div>
      
      <div className="mb-4">
        <MeditationWidget />
      </div>
    </div>
  );

  const renderStageContent = (stageId: string) => {
    switch (stageId) {
      case 'acas':
        return renderAcasForm();
      case 'et1':
        return renderET1Form();
      case 'waiting':
        return renderWaitingResponse();
      default:
        return null;
    }
  };

  const currentStage = stages.find(s => s.id === activeStage) || stages[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Your Case Timeline</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Fill in your details and generate your forms
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={signOut}>
          Sign Out
        </Button>
      </div>

      {/* Stage Navigation with Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">
            {currentStage.progress}% complete
          </span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{currentStage.timeEstimate}</span>
          </div>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          {stages.map((stage) => (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                activeStage === stage.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {isStageComplete(stage.id) && <Check className="w-4 h-4 inline mr-1" />}
              {stage.title}
            </button>
          ))}
        </div>
      </div>

      {/* Active Stage Form */}
      <div className="relative bg-card rounded-2xl border border-border p-6 animate-in fade-in duration-300">
        {/* Top right badges */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {/* Deadline Badge - only for ACAS and ET1 */}
          {activeStage === 'acas' && deadlines.acas && (
            <div className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full",
              getDeadlineInfo(deadlines.acas)?.isUrgent 
                ? "bg-destructive/10 text-destructive" 
                : "bg-amber-500/10 text-amber-600"
            )}>
              <Clock className="w-3.5 h-3.5" />
              {getDeadlineInfo(deadlines.acas)?.isPast 
                ? "Overdue" 
                : `${getDeadlineInfo(deadlines.acas)?.daysRemaining} days left`}
            </div>
          )}
          {activeStage === 'et1' && deadlines.et1 && (
            <div className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full",
              getDeadlineInfo(deadlines.et1)?.isUrgent 
                ? "bg-destructive/10 text-destructive" 
                : "bg-amber-500/10 text-amber-600"
            )}>
              <Clock className="w-3.5 h-3.5" />
              {getDeadlineInfo(deadlines.et1)?.isPast 
                ? "Overdue" 
                : `${getDeadlineInfo(deadlines.et1)?.daysRemaining} days left`}
            </div>
          )}

          {/* Autosave Notification - only for ACAS and ET1 */}
          {(activeStage === 'acas' || activeStage === 'et1') && (showAutosaved || isSaving) && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 text-green-600 text-xs font-medium rounded-full">
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Autosaved
                </>
              )}
            </div>
          )}
        </div>

        {/* Form Content */}
        {renderStageContent(activeStage)}
      </div>
      
      <GreenPTFloatingChat formData={formData} />
    </div>
  );
}