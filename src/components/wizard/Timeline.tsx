import { useState } from 'react';
import { Check, Circle, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface ActionItem {
  id: string;
  label: string;
  description?: string;
}

interface Stage {
  id: string;
  title: string;
  description: string;
  actions: ActionItem[];
}

const STAGES: Stage[] = [
  {
    id: 'acas',
    title: 'ACAS Pre-conciliation Form',
    description: 'Submit Early Conciliation notification to ACAS',
    actions: [
      { id: 'acas-1', label: 'Gather employment details', description: 'Dates, pay, employer info' },
      { id: 'acas-2', label: 'Submit ACAS Early Conciliation form online' },
      { id: 'acas-3', label: 'Receive ACAS Certificate number' },
      { id: 'acas-4', label: 'Note certificate expiry date (1 month deadline)' },
    ],
  },
  {
    id: 'et1',
    title: 'ET1 Form',
    description: 'Submit your Employment Tribunal claim',
    actions: [
      { id: 'et1-1', label: 'Prepare Grounds of Complaint' },
      { id: 'et1-2', label: 'Gather supporting documents' },
      { id: 'et1-3', label: 'Complete ET1 form online' },
      { id: 'et1-4', label: 'Submit ET1 before deadline' },
      { id: 'et1-5', label: 'Receive confirmation from Tribunal' },
    ],
  },
  {
    id: 'et3',
    title: 'ET3 Response',
    description: 'Employer response and case management',
    actions: [
      { id: 'et3-1', label: 'Wait for employer response (28 days)' },
      { id: 'et3-2', label: 'Review ET3 response from employer' },
      { id: 'et3-3', label: 'Prepare for preliminary hearing' },
      { id: 'et3-4', label: 'Upload relevant case documents' },
    ],
  },
];

export function Timeline() {
  const { signOut, user } = useAuth();
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set(['acas']));

  const toggleAction = (actionId: string) => {
    setCompletedActions((prev) => {
      const next = new Set(prev);
      if (next.has(actionId)) {
        next.delete(actionId);
      } else {
        next.add(actionId);
      }
      return next;
    });
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

  const getStageProgress = (stage: Stage) => {
    const completed = stage.actions.filter((a) => completedActions.has(a.id)).length;
    return { completed, total: stage.actions.length };
  };

  const isStageComplete = (stage: Stage) => {
    return stage.actions.every((a) => completedActions.has(a.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Your Case Timeline</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track your progress through each stage
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={signOut}>
          Sign Out
        </Button>
      </div>

      <div className="space-y-4">
        {STAGES.map((stage, index) => {
          const progress = getStageProgress(stage);
          const isComplete = isStageComplete(stage);
          const isExpanded = expandedStages.has(stage.id);

          return (
            <div key={stage.id} className="relative">
              {/* Connector line */}
              {index < STAGES.length - 1 && (
                <div
                  className={cn(
                    'absolute left-5 top-14 w-0.5 h-[calc(100%-2rem)]',
                    isComplete ? 'bg-primary' : 'bg-border'
                  )}
                />
              )}

              <div className="bg-card rounded-xl border border-border overflow-hidden">
                {/* Stage header */}
                <button
                  onClick={() => toggleStage(stage.id)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left"
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                      isComplete
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {isComplete ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="font-semibold">{index + 1}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-foreground">{stage.title}</h2>
                    <p className="text-sm text-muted-foreground">{stage.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {progress.completed} of {progress.total} completed
                    </p>
                  </div>

                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                  )}
                </button>

                {/* Stage actions */}
                {isExpanded && (
                  <div className="border-t border-border px-4 py-3 space-y-2">
                    {stage.actions.map((action) => {
                      const isChecked = completedActions.has(action.id);

                      return (
                        <button
                          key={action.id}
                          onClick={() => toggleAction(action.id)}
                          className="w-full flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
                        >
                          <div
                            className={cn(
                              'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                              isChecked
                                ? 'bg-primary border-primary text-primary-foreground'
                                : 'border-muted-foreground'
                            )}
                          >
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                          <div>
                            <p
                              className={cn(
                                'text-sm',
                                isChecked
                                  ? 'text-muted-foreground line-through'
                                  : 'text-foreground'
                              )}
                            >
                              {action.label}
                            </p>
                            {action.description && (
                              <p className="text-xs text-muted-foreground">
                                {action.description}
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
