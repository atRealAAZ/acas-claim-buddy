import { useState } from 'react';
import { Check, ChevronDown, ChevronRight, Upload, Sparkles, FileText, Loader2, CheckCircle2, Send, Clock } from 'lucide-react';
import { addMonths, addDays, format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { GreenPTFloatingChat } from '@/components/GreenPTFloatingChat';

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
  // ET3 specific
  et3ResponseNotes: string;
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
  et3ResponseNotes: '',
};

export function Timeline() {
  const { signOut, user } = useAuth();
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set(['acas']));
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [generatedForms, setGeneratedForms] = useState<{ acas?: string; et1?: string }>({});
  const [acceptedForms, setAcceptedForms] = useState<{ acas: boolean; et1: boolean }>({ acas: false, et1: false });
  const [sentForms, setSentForms] = useState<{ acas: boolean; et1: boolean }>({ acas: false, et1: false });
  const [collapsedForms, setCollapsedForms] = useState<{ acas: boolean; et1: boolean }>({ acas: false, et1: false });
  const [isGenerating, setIsGenerating] = useState<{ acas: boolean; et1: boolean }>({ acas: false, et1: false });
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File[] }>({});

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

  const toggleStage = (stageId: string) => {
    setExpandedStages((prev) => {
      const next = new Set(prev);
      if (next.has(stageId)) {
        next.delete(stageId);
      } else {
        next.add(stageId);
      }
      return next;
    });
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
    if (!formData.employmentEndDate) return { acas: null, et1: null, et3: null };
    const terminationDate = new Date(formData.employmentEndDate);
    const acasDeadline = addDays(addMonths(terminationDate, 3), -1); // 3 months minus 1 day
    const et1Deadline = addDays(acasDeadline, 30); // 30 days after ACAS deadline
    const et3Deadline = addDays(et1Deadline, 28); // 28 days after ET1 deadline
    return { acas: acasDeadline, et1: et1Deadline, et3: et3Deadline };
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
    { id: 'acas', title: 'ACAS Pre-conciliation Form', description: 'Submit Early Conciliation notification to ACAS', deadline: getDeadlineInfo(deadlines.acas) },
    { id: 'et1', title: 'ET1 Form', description: 'Submit your Employment Tribunal claim', deadline: getDeadlineInfo(deadlines.et1) },
    { id: 'et3', title: 'ET3 Response', description: 'Employer response and case management', deadline: getDeadlineInfo(deadlines.et3) },
  ];

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

      <div className="space-y-4">
        {stages.map((stage, index) => {
          const isExpanded = expandedStages.has(stage.id);

          return (
            <div key={stage.id} className="relative">
              {index < stages.length - 1 && (
                <div className="absolute left-5 top-14 w-0.5 h-[calc(100%-2rem)] bg-border" />
              )}

              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => toggleStage(stage.id)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors",
                    isStageComplete(stage.id) 
                      ? "bg-green-500 text-white" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {isStageComplete(stage.id) ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="font-semibold">{index + 1}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-foreground">{stage.title}</h2>
                    <p className="text-sm text-muted-foreground">{stage.description}</p>
                    {stage.deadline && (
                      <div className={cn(
                        "flex items-center gap-1 text-xs mt-1",
                        stage.deadline.isPast ? "text-red-600" : stage.deadline.isUrgent ? "text-orange-500" : "text-muted-foreground"
                      )}>
                        <Clock className="w-3 h-3" />
                        <span>
                          Deadline: {format(stage.deadline.date, 'dd MMM yyyy')} 
                          {stage.deadline.isPast 
                            ? ` (${Math.abs(stage.deadline.daysRemaining)} days overdue)`
                            : ` (${stage.deadline.daysRemaining} days remaining)`
                          }
                        </span>
                      </div>
                    )}
                  </div>

                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="border-t border-border px-4 py-4 space-y-4">
                    {/* ACAS Form Fields */}
                    {stage.id === 'acas' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                              id="fullName"
                              value={formData.fullName}
                              onChange={(e) => updateFormData('fullName', e.target.value)}
                              placeholder="Your full name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => updateFormData('email', e.target.value)}
                              placeholder="Your email address"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="employerName">Employer Name</Label>
                            <Input
                              id="employerName"
                              value={formData.employerName}
                              onChange={(e) => updateFormData('employerName', e.target.value)}
                              placeholder="Employer's name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="employerAddress">Employer Address</Label>
                            <Input
                              id="employerAddress"
                              value={formData.employerAddress}
                              onChange={(e) => updateFormData('employerAddress', e.target.value)}
                              placeholder="Employer's address"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="employmentEndDate">Termination Date</Label>
                            <Input
                              id="employmentEndDate"
                              type="date"
                              value={formData.employmentEndDate}
                              onChange={(e) => updateFormData('employmentEndDate', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="claimType">Claim Type</Label>
                            <Input
                              id="claimType"
                              value={formData.claimType}
                              onChange={(e) => updateFormData('claimType', e.target.value)}
                              placeholder="e.g., Unfair dismissal, Discrimination"
                            />
                          </div>
                        </div>

                        <Button
                          onClick={() => generateForm('acas')}
                          disabled={isGenerating.acas}
                          className="w-full"
                          size="lg"
                        >
                          {isGenerating.acas ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Generate ACAS Form
                            </>
                          )}
                        </Button>

                        {generatedForms.acas && (
                          <div className="mt-4 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                            <button
                              onClick={() => acceptedForms.acas && setCollapsedForms(prev => ({ ...prev, acas: !prev.acas }))}
                              className="w-full flex items-center justify-between mb-4"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-semibold text-foreground">Generated ACAS Form</h3>
                              </div>
                              <div className="flex items-center gap-2">
                                {sentForms.acas && (
                                  <div className="flex items-center gap-1 text-blue-600 text-sm font-medium">
                                    <Send className="w-4 h-4" />
                                    Sent
                                  </div>
                                )}
                                {acceptedForms.acas && (
                                  <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Accepted
                                  </div>
                                )}
                                {acceptedForms.acas && (
                                  collapsedForms.acas ? (
                                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                  ) : (
                                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                  )
                                )}
                              </div>
                            </button>
                            {!collapsedForms.acas && (
                              <>
                                <Textarea
                                  value={generatedForms.acas}
                                  onChange={(e) => setGeneratedForms(prev => ({ ...prev, acas: e.target.value }))}
                                  className="min-h-[400px] font-serif text-base leading-relaxed bg-background border-border resize-y"
                                  disabled={acceptedForms.acas}
                                />
                                {!acceptedForms.acas && (
                                  <Button
                                    onClick={() => {
                                      setAcceptedForms(prev => ({ ...prev, acas: true }));
                                      toast.success('ACAS form accepted!');
                                    }}
                                    className="w-full mt-4"
                                    size="lg"
                                    variant="default"
                                  >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Accept ACAS Form
                                  </Button>
                                )}
                                {acceptedForms.acas && !sentForms.acas && (
                                  <Button
                                    onClick={() => {
                                      setSentForms(prev => ({ ...prev, acas: true }));
                                      setCollapsedForms(prev => ({ ...prev, acas: true }));
                                      toast.success('ACAS form sent!');
                                    }}
                                    className="w-full mt-4"
                                    size="lg"
                                    variant="default"
                                  >
                                    <Send className="w-4 h-4 mr-2" />
                                    Send ACAS Form
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    {/* ET1 Form Fields */}
                    {stage.id === 'et1' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="acasCertificateNumber">ACAS Certificate Number</Label>
                          <Input
                            id="acasCertificateNumber"
                            value={formData.acasCertificateNumber}
                            onChange={(e) => updateFormData('acasCertificateNumber', e.target.value)}
                            placeholder="R123456/78/90"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="desiredOutcome">Desired Outcome</Label>
                          <Textarea
                            id="desiredOutcome"
                            value={formData.desiredOutcome}
                            onChange={(e) => updateFormData('desiredOutcome', e.target.value)}
                            placeholder="e.g., Compensation, reinstatement, apology"
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="detailedComplaint">Detailed Grounds of Complaint</Label>
                          <Textarea
                            id="detailedComplaint"
                            value={formData.detailedComplaint}
                            onChange={(e) => updateFormData('detailedComplaint', e.target.value)}
                            placeholder="Provide a detailed account of what happened, including dates, people involved, and how you were affected"
                            rows={6}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Upload Evidence Documents</Label>
                          <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                            <input
                              type="file"
                              multiple
                              className="hidden"
                              id="et1-upload"
                              onChange={(e) => handleFileUpload('et1', e.target.files)}
                            />
                            <label htmlFor="et1-upload" className="cursor-pointer">
                              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">Upload contracts, emails, or other evidence</p>
                            </label>
                            {uploadedFiles['et1']?.length > 0 && (
                              <div className="mt-2 text-sm text-primary">
                                {uploadedFiles['et1'].length} file(s) uploaded
                              </div>
                            )}
                          </div>
                        </div>

                        <Button
                          onClick={() => generateForm('et1')}
                          disabled={isGenerating.et1}
                          className="w-full"
                          size="lg"
                        >
                          {isGenerating.et1 ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Generate ET1 Form
                            </>
                          )}
                        </Button>

                        {generatedForms.et1 && (
                          <div className="mt-4 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                            <button
                              onClick={() => acceptedForms.et1 && setCollapsedForms(prev => ({ ...prev, et1: !prev.et1 }))}
                              className="w-full flex items-center justify-between mb-4"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-semibold text-foreground">Generated ET1 Form</h3>
                              </div>
                              <div className="flex items-center gap-2">
                                {sentForms.et1 && (
                                  <div className="flex items-center gap-1 text-blue-600 text-sm font-medium">
                                    <Send className="w-4 h-4" />
                                    Sent
                                  </div>
                                )}
                                {acceptedForms.et1 && (
                                  <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Accepted
                                  </div>
                                )}
                                {acceptedForms.et1 && (
                                  collapsedForms.et1 ? (
                                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                  ) : (
                                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                  )
                                )}
                              </div>
                            </button>
                            {!collapsedForms.et1 && (
                              <>
                                <Textarea
                                  value={generatedForms.et1}
                                  onChange={(e) => setGeneratedForms(prev => ({ ...prev, et1: e.target.value }))}
                                  className="min-h-[500px] font-serif text-base leading-relaxed bg-background border-border resize-y"
                                  disabled={acceptedForms.et1}
                                />
                                {!acceptedForms.et1 && (
                                  <Button
                                    onClick={() => {
                                      setAcceptedForms(prev => ({ ...prev, et1: true }));
                                      toast.success('ET1 form accepted!');
                                    }}
                                    className="w-full mt-4"
                                    size="lg"
                                    variant="default"
                                  >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Accept ET1 Form
                                  </Button>
                                )}
                                {acceptedForms.et1 && !sentForms.et1 && (
                                  <Button
                                    onClick={() => {
                                      setSentForms(prev => ({ ...prev, et1: true }));
                                      setCollapsedForms(prev => ({ ...prev, et1: true }));
                                      toast.success('ET1 form sent!');
                                    }}
                                    className="w-full mt-4"
                                    size="lg"
                                    variant="default"
                                  >
                                    <Send className="w-4 h-4 mr-2" />
                                    Send ET1 Form
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    {/* ET3 Response Fields */}
                    {stage.id === 'et3' && (
                      <>
                        <div className="p-4 bg-muted/50 rounded-lg mb-4">
                          <p className="text-sm text-muted-foreground">
                            After submitting your ET1 form, you'll need to wait for your employer's response (ET3). 
                            They have 28 days to respond. Use this section to upload and review their response.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label>Upload ET3 Response from Employer</Label>
                          <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                            <input
                              type="file"
                              multiple
                              className="hidden"
                              id="et3-upload"
                              onChange={(e) => handleFileUpload('et3', e.target.files)}
                            />
                            <label htmlFor="et3-upload" className="cursor-pointer">
                              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">Upload your employer's ET3 response</p>
                            </label>
                            {uploadedFiles['et3']?.length > 0 && (
                              <div className="mt-2 text-sm text-primary">
                                {uploadedFiles['et3'].length} file(s) uploaded
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="et3ResponseNotes">Notes on Employer's Response</Label>
                          <Textarea
                            id="et3ResponseNotes"
                            value={formData.et3ResponseNotes}
                            onChange={(e) => updateFormData('et3ResponseNotes', e.target.value)}
                            placeholder="Make notes about your employer's response, including any points you disagree with or want to address"
                            rows={4}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Upload Case Documents</Label>
                          <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                            <input
                              type="file"
                              multiple
                              className="hidden"
                              id="case-docs-upload"
                              onChange={(e) => handleFileUpload('case-docs', e.target.files)}
                            />
                            <label htmlFor="case-docs-upload" className="cursor-pointer">
                              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">Upload additional case documents for your hearing</p>
                            </label>
                            {uploadedFiles['case-docs']?.length > 0 && (
                              <div className="mt-2 text-sm text-primary">
                                {uploadedFiles['case-docs'].length} file(s) uploaded
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <GreenPTFloatingChat formData={formData} />
    </div>
  );
}
