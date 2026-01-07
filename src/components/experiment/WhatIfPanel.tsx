import { useState } from 'react';
import { WhatIfScenario, Parameter } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, ArrowRight, RotateCcw, Sparkles, Beaker, ChevronDown, ChevronUp } from 'lucide-react';

interface WhatIfPanelProps {
  scenarios: WhatIfScenario[];
  parameters: Parameter[];
  currentValues: Record<string, number>;
  onApplyScenario: (changes: Record<string, number>) => void;
  onReset: () => void;
}

export function WhatIfPanel({ scenarios, parameters, currentValues, onApplyScenario, onReset }: WhatIfPanelProps) {
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null);
  const [appliedScenario, setAppliedScenario] = useState<string | null>(null);

  const handleApply = (scenario: WhatIfScenario) => {
    const changes: Record<string, number> = {};
    scenario.parameterChanges.forEach(change => { changes[change.parameterId] = change.newValue; });
    onApplyScenario(changes);
    setAppliedScenario(scenario.id);
  };

  const handleReset = () => {
    onReset();
    setAppliedScenario(null);
  };

  const getParameterName = (id: string) => parameters.find(p => p.id === id)?.name || id;
  const getParameterUnit = (id: string) => parameters.find(p => p.id === id)?.unit || '';

  const isScenarioApplied = (scenario: WhatIfScenario) => {
    return scenario.parameterChanges.every(change => 
      currentValues[change.parameterId] === change.newValue
    );
  };

  return (
    <Card className="border-accent/20">
      <CardHeader className="py-4 flex flex-row items-center justify-between bg-gradient-to-r from-accent/5 to-transparent">
        <CardTitle className="text-lg flex items-center gap-2">
          <Beaker className="h-5 w-5 text-accent" />
          What-If Scenarios
          <Badge variant="secondary" className="ml-2 text-xs">
            {scenarios.length} scenarios
          </Badge>
        </CardTitle>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-1" /> Reset All
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        <div className="p-3 rounded-lg bg-muted/50 border border-dashed mb-4">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-accent mt-0.5" />
            <div>
              <p className="text-sm font-medium">Explore & Learn!</p>
              <p className="text-xs text-muted-foreground">
                Click "Try This" on any scenario to instantly see how changing parameters affects the experiment results.
              </p>
            </div>
          </div>
        </div>

        {scenarios.map((scenario) => {
          const isApplied = isScenarioApplied(scenario);
          const isExpanded = expandedScenario === scenario.id;

          return (
            <div 
              key={scenario.id} 
              className={`p-4 rounded-lg border transition-all duration-300 ${
                isApplied 
                  ? 'border-primary bg-primary/5 shadow-sm' 
                  : 'border-border hover:border-accent/50 hover:bg-accent/5'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <HelpCircle className="h-4 w-4 text-accent" />
                    <p className="font-medium text-sm">{scenario.question}</p>
                    {isApplied && (
                      <Badge variant="default" className="text-xs animate-pulse">
                        Active
                      </Badge>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setExpandedScenario(isExpanded ? null : scenario.id)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
                  >
                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    {isExpanded ? 'Hide details' : 'Show details'}
                  </button>

                  {isExpanded && (
                    <div className="animate-fade-in space-y-2 mt-3 pl-6 border-l-2 border-accent/30">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Parameter Changes:</p>
                        <div className="flex flex-wrap gap-1">
                          {scenario.parameterChanges.map((change, i) => (
                            <Badge key={i} variant="secondary" className="text-xs font-mono">
                              {getParameterName(change.parameterId)}: {change.newValue}{getParameterUnit(change.parameterId)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Expected Outcome:</p>
                        <p className="text-sm text-foreground bg-muted/50 p-2 rounded">
                          {scenario.expectedOutcome}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <Button 
                  variant={isApplied ? "secondary" : "default"} 
                  size="sm" 
                  onClick={() => handleApply(scenario)} 
                  className="shrink-0"
                  disabled={isApplied}
                >
                  {isApplied ? (
                    <>Applied</>
                  ) : (
                    <>Try This <ArrowRight className="h-4 w-4 ml-1" /></>
                  )}
                </Button>
              </div>
            </div>
          );
        })}

        {scenarios.length === 0 && (
          <div className="text-center py-8">
            <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground">No predefined scenarios for this experiment.</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting the parameters manually to explore!</p>
          </div>
        )}

        {appliedScenario && (
          <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-center">
              <span className="font-medium">Scenario applied!</span> Observe the changes in the visualization and results above.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
