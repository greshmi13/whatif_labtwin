import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ProcedureStep {
  title: string;
  description: string;
  duration: number; // in seconds
}

interface DemoVideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experimentId: string;
  experimentName: string;
}

const getExperimentProcedure = (experimentId: string): ProcedureStep[] => {
  const procedures: Record<string, ProcedureStep[]> = {
    'ohms-law': [
      { title: 'Setup Circuit', description: 'Connect the DC power supply, ammeter in series, and voltmeter in parallel with the resistor on the breadboard.', duration: 3 },
      { title: 'Initial Configuration', description: 'Set the power supply to 0V. Ensure ammeter reads 0A and voltmeter reads 0V.', duration: 2 },
      { title: 'Apply Voltage', description: 'Gradually increase voltage from 0V to 5V in 1V steps using the power supply knob.', duration: 3 },
      { title: 'Record Readings', description: 'At each voltage step, note down the ammeter reading (current) and voltmeter reading (voltage).', duration: 3 },
      { title: 'Vary Resistance', description: 'Replace the resistor with different values (100Ω, 220Ω, 470Ω) and repeat measurements.', duration: 3 },
      { title: 'Plot Graph', description: 'Plot V vs I graph. The slope gives resistance R. Verify V = IR relationship.', duration: 2 },
    ],
    'kvl-verification': [
      { title: 'Build Series Circuit', description: 'Connect three resistors R1, R2, R3 in series with the DC power supply.', duration: 3 },
      { title: 'Connect Voltmeters', description: 'Connect voltmeters across each resistor and across the source.', duration: 2 },
      { title: 'Apply Source Voltage', description: 'Set the DC supply to 12V and turn on the circuit.', duration: 2 },
      { title: 'Measure Drops', description: 'Record voltage drops V1, V2, V3 across each resistor using voltmeters.', duration: 3 },
      { title: 'Verify KVL', description: 'Sum all voltage drops: V1 + V2 + V3. Compare with source voltage Vs.', duration: 2 },
      { title: 'Analyze Results', description: 'Vs should equal V1 + V2 + V3, verifying Kirchhoff\'s Voltage Law.', duration: 2 },
    ],
    'transistor-ce': [
      { title: 'Identify Terminals', description: 'Identify Base, Collector, and Emitter pins of the NPN transistor (BC107).', duration: 2 },
      { title: 'Build CE Circuit', description: 'Connect transistor in Common Emitter configuration with two DC supplies for VBE and VCE.', duration: 3 },
      { title: 'Input Characteristics', description: 'Keep VCE constant at 5V. Vary VBE from 0 to 0.8V and record IB.', duration: 3 },
      { title: 'Output Characteristics', description: 'Keep IB constant. Vary VCE from 0 to 10V and record IC.', duration: 3 },
      { title: 'Calculate β', description: 'Calculate current gain β = IC/IB at operating point.', duration: 2 },
      { title: 'Identify Regions', description: 'Identify cutoff (VBE < 0.6V), active (linear), and saturation (VCE < 0.3V) regions.', duration: 3 },
    ],
    'diode-characteristics': [
      { title: 'Setup Forward Bias', description: 'Connect diode with anode to positive terminal through a series resistor.', duration: 2 },
      { title: 'Forward Measurements', description: 'Increase voltage from 0 to 1V in 0.1V steps. Record current at each step.', duration: 3 },
      { title: 'Observe Knee Voltage', description: 'Notice sharp increase in current around 0.6-0.7V (silicon diode knee).', duration: 2 },
      { title: 'Reverse Bias Setup', description: 'Reverse diode connections. Connect cathode to positive terminal.', duration: 2 },
      { title: 'Reverse Measurements', description: 'Increase reverse voltage. Observe minimal current (reverse saturation current).', duration: 3 },
      { title: 'Plot Characteristics', description: 'Plot complete V-I curve showing forward exponential and reverse regions.', duration: 2 },
    ],
    'tensile-test': [
      { title: 'Prepare Specimen', description: 'Measure and mark gauge length (50mm) on the standard tensile specimen.', duration: 2 },
      { title: 'Mount Specimen', description: 'Securely clamp the specimen in upper and lower grips of UTM.', duration: 3 },
      { title: 'Set Parameters', description: 'Set crosshead speed to standard rate. Zero the load and extension displays.', duration: 2 },
      { title: 'Apply Load', description: 'Start the test. UTM applies gradually increasing tensile load.', duration: 3 },
      { title: 'Record Data', description: 'Record load and extension at regular intervals. Observe specimen behavior.', duration: 3 },
      { title: 'Calculate Properties', description: 'Calculate stress (σ=F/A), strain (ε=ΔL/L), Young\'s modulus, yield strength.', duration: 3 },
    ],
    'bernoulli-theorem': [
      { title: 'Setup Apparatus', description: 'Connect inlet tank to converging-diverging section with piezometer tubes.', duration: 3 },
      { title: 'Prime System', description: 'Fill the apparatus with water. Remove all air bubbles from the system.', duration: 2 },
      { title: 'Set Flow Rate', description: 'Open inlet valve to establish steady flow. Measure flow rate using collecting tank.', duration: 3 },
      { title: 'Record Pressures', description: 'Read piezometer heights at inlet, throat, and outlet sections.', duration: 3 },
      { title: 'Calculate Velocities', description: 'Use continuity equation: A1V1 = A2V2 to find velocities at each section.', duration: 2 },
      { title: 'Verify Bernoulli', description: 'Verify P1/ρg + V1²/2g = P2/ρg + V2²/2g (constant total head).', duration: 3 },
    ],
    'chain-survey': [
      { title: 'Reconnaissance', description: 'Walk the area to identify major features, obstacles, and select station points.', duration: 3 },
      { title: 'Establish Baseline', description: 'Mark two intervisible stations A and B. Measure baseline with chain/tape.', duration: 3 },
      { title: 'Take Offsets', description: 'From points along baseline, measure perpendicular offsets to boundary features.', duration: 3 },
      { title: 'Record Chainages', description: 'Note chainage (distance from A) and offset distance for each point.', duration: 2 },
      { title: 'Sketch Field Book', description: 'Draw conventional symbols for features in the field book with measurements.', duration: 2 },
      { title: 'Plot Survey', description: 'Draw baseline to scale. Plot offsets to create the survey map.', duration: 3 },
    ],
    'concrete-mix': [
      { title: 'Design Requirements', description: 'Determine target strength, workability (slump), and exposure conditions.', duration: 2 },
      { title: 'Select W/C Ratio', description: 'Choose water-cement ratio based on required strength from standard curves.', duration: 2 },
      { title: 'Calculate Quantities', description: 'Calculate cement, water, fine aggregate, and coite aggregate quantities.', duration: 3 },
      { title: 'Batch Materials', description: 'Weigh materials accurately. Account for aggregate moisture content.', duration: 2 },
      { title: 'Mix Concrete', description: 'Add materials to mixer. Mix for 2 minutes until uniform consistency.', duration: 3 },
      { title: 'Test & Cast', description: 'Perform slump test. Cast cube specimens for strength testing.', duration: 3 },
    ],
  };

  // Default procedure for experiments not explicitly defined
  const defaultProcedure: ProcedureStep[] = [
    { title: 'Study Objective', description: 'Read and understand the aim and principle of the experiment.', duration: 2 },
    { title: 'Setup Apparatus', description: 'Arrange all required apparatus and ensure proper connections.', duration: 3 },
    { title: 'Initial Readings', description: 'Record initial/zero readings of all measuring instruments.', duration: 2 },
    { title: 'Perform Experiment', description: 'Vary parameters as per procedure and observe changes.', duration: 3 },
    { title: 'Record Observations', description: 'Tabulate all readings systematically in the observation table.', duration: 3 },
    { title: 'Calculate & Conclude', description: 'Perform calculations using formulas. Draw conclusions.', duration: 2 },
  ];

  return procedures[experimentId] || defaultProcedure;
};

export function DemoVideoModal({ open, onOpenChange, experimentId, experimentName }: DemoVideoModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [animationFrame, setAnimationFrame] = useState(0);

  const procedure = getExperimentProcedure(experimentId);
  const totalDuration = procedure.reduce((sum, step) => sum + step.duration, 0);

  useEffect(() => {
    if (!isPlaying) return;

    const stepDuration = procedure[currentStep].duration * 1000;
    const intervalDuration = 50;
    const increment = (100 / (stepDuration / intervalDuration));

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (currentStep < procedure.length - 1) {
            setCurrentStep(c => c + 1);
            return 0;
          } else {
            setIsPlaying(false);
            return 100;
          }
        }
        return prev + increment;
      });
      setAnimationFrame(f => (f + 1) % 100);
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [isPlaying, currentStep, procedure]);

  useEffect(() => {
    if (open) {
      setCurrentStep(0);
      setProgress(0);
      setIsPlaying(false);
    }
  }, [open]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  
  const handleReset = () => {
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(false);
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (currentStep < procedure.length - 1) {
      setCurrentStep(currentStep + 1);
      setProgress(0);
    }
  };

  const overallProgress = ((currentStep * 100) + progress) / procedure.length;

  // Get animation based on experiment type and current step
  const renderStepAnimation = () => {
    const step = procedure[currentStep];
    const experimentType = getExperimentType(experimentId);

    return (
      <div className="relative aspect-video bg-gradient-to-br from-muted/50 to-muted rounded-lg overflow-hidden">
        <svg viewBox="0 0 400 225" className="w-full h-full">
          <defs>
            <linearGradient id="animGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.2" />
            </linearGradient>
            <filter id="glow2">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <rect width="400" height="225" fill="url(#animGrad)" />
          
          {experimentType === 'electrical' && renderElectricalProcedure(currentStep, animationFrame)}
          {experimentType === 'electronics' && renderElectronicsProcedure(currentStep, animationFrame)}
          {experimentType === 'mechanical' && renderMechanicalProcedure(currentStep, animationFrame)}
          {experimentType === 'fluid' && renderFluidProcedure(currentStep, animationFrame)}
          {experimentType === 'civil' && renderCivilProcedure(currentStep, animationFrame)}
          {experimentType === 'concrete' && renderConcreteProcedure(currentStep, animationFrame)}

          {/* Step indicator */}
          <text x="200" y="210" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="10">
            Step {currentStep + 1}: {step.title}
          </text>
        </svg>

        {/* Animated particles */}
        {isPlaying && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-primary/30 animate-ping"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (animationFrame + i * 20) % 40}%`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">Experiment Procedure Demo</DialogTitle>
              <DialogDescription>{experimentName}</DialogDescription>
            </div>
            <Badge variant="secondary">
              {Math.round(totalDuration)}s total
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Animation Area */}
          {renderStepAnimation()}

          {/* Step Description */}
          <div className="p-4 rounded-lg bg-muted/50 border">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default" className="text-xs">
                Step {currentStep + 1} of {procedure.length}
              </Badge>
              <span className="text-sm font-medium">{procedure[currentStep].title}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {procedure[currentStep].description}
            </p>
          </div>

          {/* Step Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Step Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Overall Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Overall Progress</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-1" />
          </div>

          {/* Step Indicators */}
          <div className="flex gap-1 justify-center">
            {procedure.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { setCurrentStep(idx); setProgress(0); }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentStep
                    ? 'bg-primary'
                    : idx < currentStep
                    ? 'bg-primary/50'
                    : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="icon" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handlePrev} disabled={currentStep === 0}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button size="lg" onClick={handlePlayPause} className="px-8">
              {isPlaying ? (
                <><Pause className="h-4 w-4 mr-2" /> Pause</>
              ) : (
                <><Play className="h-4 w-4 mr-2" /> {currentStep === procedure.length - 1 && progress >= 100 ? 'Replay' : 'Play'}</>
              )}
            </Button>
            <Button variant="outline" size="icon" onClick={handleNext} disabled={currentStep === procedure.length - 1}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Try What-If hint */}
          <div className="text-center p-3 rounded-lg bg-accent/10 border border-accent/20">
            <p className="text-sm text-muted-foreground">
              💡 After understanding the procedure, try the <strong>What-If</strong> tab to explore different scenarios!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getExperimentType(experimentId: string): string {
  const types: Record<string, string> = {
    'ohms-law': 'electrical',
    'kvl-verification': 'electrical',
    'kcl-verification': 'electrical',
    'series-parallel': 'electrical',
    'power-measurement': 'electrical',
    'superposition-theorem': 'electrical',
    'transistor-ce': 'electronics',
    'diode-characteristics': 'electronics',
    'zener-regulator': 'electronics',
    'rectifier-half': 'electronics',
    'ce-amplifier': 'electronics',
    'tensile-test': 'mechanical',
    'hardness-test': 'mechanical',
    'impact-test': 'mechanical',
    'compression-test': 'mechanical',
    'bernoulli-theorem': 'fluid',
    'reynolds-experiment': 'fluid',
    'venturi-meter': 'fluid',
    'pipe-friction': 'fluid',
    'chain-survey': 'civil',
    'compass-survey': 'civil',
    'leveling': 'civil',
    'plane-table': 'civil',
    'concrete-mix': 'concrete',
    'slump-test': 'concrete',
    'aggregate-grading': 'concrete',
    'cube-strength': 'concrete',
  };
  return types[experimentId] || 'electrical';
}

function renderElectricalProcedure(step: number, frame: number) {
  const flowOffset = (frame * 3) % 100;
  
  return (
    <g>
      {/* Power supply */}
      <rect x="30" y="60" width="60" height="80" rx="5" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
      <text x="60" y="50" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">DC Supply</text>
      <circle cx="45" cy="85" r="8" fill={step >= 1 ? "hsl(var(--primary))" : "hsl(var(--muted))"} />
      <circle cx="75" cy="85" r="8" fill={step >= 1 ? "hsl(var(--destructive))" : "hsl(var(--muted))"} />
      <rect x="40" y="100" width="40" height="8" rx="2" fill="hsl(var(--muted))" />
      <rect x="40" y="100" width={step >= 2 ? Math.min(40, frame * 0.5) : 0} height="8" rx="2" fill="hsl(var(--primary))" />
      <text x="60" y="125" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10">
        {step >= 2 ? `${Math.round(frame * 0.3)}V` : '0V'}
      </text>

      {/* Wires */}
      <path d={`M 90 75 L 150 75 L 150 100`} stroke={step >= 0 ? "hsl(var(--primary))" : "hsl(var(--muted))"} strokeWidth="3" fill="none" />
      <path d="M 150 140 L 150 165 L 310 165 L 310 120" stroke={step >= 0 ? "hsl(var(--primary))" : "hsl(var(--muted))"} strokeWidth="3" fill="none" />
      <path d="M 310 80 L 310 75 L 360 75 L 360 100" stroke={step >= 0 ? "hsl(var(--primary))" : "hsl(var(--muted))"} strokeWidth="3" fill="none" />
      <path d="M 360 140 L 360 165 L 90 165 L 90 120" stroke={step >= 0 ? "hsl(var(--primary))" : "hsl(var(--muted))"} strokeWidth="3" fill="none" />

      {/* Electron flow animation */}
      {step >= 2 && (
        <>
          <circle cx={90 + (flowOffset % 60)} cy="75" r="4" fill="hsl(var(--accent))" opacity="0.8" />
          <circle cx={150} cy={75 + (flowOffset % 65)} r="4" fill="hsl(var(--accent))" opacity="0.8" />
          <circle cx={150 + (flowOffset % 160)} cy="165" r="4" fill="hsl(var(--accent))" opacity="0.8" />
        </>
      )}

      {/* Ammeter */}
      <circle cx="150" cy="120" r="20" fill="hsl(var(--card))" stroke={step >= 0 ? "hsl(var(--primary))" : "hsl(var(--muted))"} strokeWidth="2" />
      <text x="150" y="124" textAnchor="middle" fill="hsl(var(--primary))" fontSize="14" fontWeight="bold">A</text>
      <text x="150" y="155" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="8">
        {step >= 3 ? `${(frame * 0.5).toFixed(1)}mA` : '---'}
      </text>

      {/* Resistor */}
      <rect x="295" y="85" width="30" height="50" rx="3" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="2" />
      <rect x="295" y="90" width="30" height="8" fill="hsl(var(--destructive))" opacity="0.7" />
      <rect x="295" y="102" width="30" height="8" fill="hsl(var(--primary))" opacity="0.7" />
      <rect x="295" y="114" width="30" height="8" fill="hsl(var(--accent))" opacity="0.7" />
      <text x="310" y="150" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">
        {step >= 4 ? `${100 + (step - 4) * 120}Ω` : '100Ω'}
      </text>

      {/* Voltmeter */}
      <circle cx="360" cy="120" r="20" fill="hsl(var(--card))" stroke={step >= 0 ? "hsl(var(--accent))" : "hsl(var(--muted))"} strokeWidth="2" />
      <text x="360" y="124" textAnchor="middle" fill="hsl(var(--accent))" fontSize="14" fontWeight="bold">V</text>

      {/* Observation table hint */}
      {step >= 3 && (
        <g transform="translate(220, 30)">
          <rect x="0" y="0" width="80" height="40" rx="3" fill="hsl(var(--card))" stroke="hsl(var(--border))" />
          <text x="40" y="15" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">Record:</text>
          <text x="40" y="28" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="9">V, I values</text>
        </g>
      )}

      {/* Graph hint */}
      {step >= 5 && (
        <g transform="translate(220, 30)">
          <rect x="0" y="0" width="80" height="40" rx="3" fill="hsl(var(--card))" stroke="hsl(var(--primary))" />
          <line x1="15" y1="35" x2="65" y2="35" stroke="hsl(var(--muted-foreground))" />
          <line x1="15" y1="35" x2="15" y2="10" stroke="hsl(var(--muted-foreground))" />
          <line x1="15" y1="35" x2="60" y2="15" stroke="hsl(var(--primary))" strokeWidth="2" />
          <text x="40" y="8" textAnchor="middle" fill="hsl(var(--primary))" fontSize="7">V-I Graph</text>
        </g>
      )}
    </g>
  );
}

function renderElectronicsProcedure(step: number, frame: number) {
  const pulseOffset = Math.sin(frame * 0.1) * 5;
  
  return (
    <g>
      {/* Transistor symbol */}
      <g transform="translate(180, 90)">
        <circle r="35" fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
        <line x1="-20" y1="0" x2="0" y2="0" stroke="hsl(var(--foreground))" strokeWidth="2" />
        <line x1="0" y1="-20" x2="0" y2="20" stroke="hsl(var(--foreground))" strokeWidth="3" />
        <line x1="0" y1="-10" x2="20" y2="-25" stroke="hsl(var(--foreground))" strokeWidth="2" />
        <line x1="0" y1="10" x2="20" y2="25" stroke="hsl(var(--foreground))" strokeWidth="2" />
        <polygon points="15,20 20,25 12,24" fill="hsl(var(--foreground))" />
        <text x="-35" y="5" fill="hsl(var(--muted-foreground))" fontSize="10">B</text>
        <text x="25" y="-20" fill="hsl(var(--muted-foreground))" fontSize="10">C</text>
        <text x="25" y="30" fill="hsl(var(--muted-foreground))" fontSize="10">E</text>
      </g>

      {step >= 0 && (
        <text x="180" y="145" textAnchor="middle" fill="hsl(var(--primary))" fontSize="10">NPN Transistor</text>
      )}

      {/* VBE supply */}
      <g transform="translate(60, 70)">
        <rect x="0" y="0" width="40" height="50" rx="3" fill="hsl(var(--card))" stroke={step >= 1 ? "hsl(var(--primary))" : "hsl(var(--muted))"} strokeWidth="2" />
        <text x="20" y="30" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="9">VBE</text>
        <text x="20" y="42" textAnchor="middle" fill="hsl(var(--primary))" fontSize="8">
          {step >= 2 ? `${(0.5 + frame * 0.003).toFixed(2)}V` : '0V'}
        </text>
      </g>

      {/* VCE supply */}
      <g transform="translate(280, 30)">
        <rect x="0" y="0" width="40" height="50" rx="3" fill="hsl(var(--card))" stroke={step >= 1 ? "hsl(var(--accent))" : "hsl(var(--muted))"} strokeWidth="2" />
        <text x="20" y="30" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="9">VCE</text>
        <text x="20" y="42" textAnchor="middle" fill="hsl(var(--accent))" fontSize="8">
          {step >= 3 ? `${(frame * 0.1).toFixed(1)}V` : '5V'}
        </text>
      </g>

      {/* Connections */}
      <path d="M 100 95 L 145 95" stroke={step >= 1 ? "hsl(var(--primary))" : "hsl(var(--muted))"} strokeWidth="2" fill="none" />
      <path d="M 200 65 L 200 40 L 280 40" stroke={step >= 1 ? "hsl(var(--accent))" : "hsl(var(--muted))"} strokeWidth="2" fill="none" />
      <path d="M 200 115 L 200 165 L 180 165" stroke={step >= 1 ? "hsl(var(--foreground))" : "hsl(var(--muted))"} strokeWidth="2" fill="none" />

      {/* Current indicators */}
      {step >= 2 && (
        <>
          <text x="120" y="85" fill="hsl(var(--primary))" fontSize="9">IB: {(frame * 0.1).toFixed(0)}µA</text>
          {step >= 3 && (
            <text x="230" y="50" fill="hsl(var(--accent))" fontSize="9">IC: {(frame * 10).toFixed(0)}µA</text>
          )}
        </>
      )}

      {/* Beta calculation */}
      {step >= 4 && (
        <g transform="translate(280, 100)">
          <rect x="0" y="0" width="90" height="50" rx="5" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2" />
          <text x="45" y="20" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10">β = IC/IB</text>
          <text x="45" y="38" textAnchor="middle" fill="hsl(var(--primary))" fontSize="12" fontWeight="bold">β ≈ 100</text>
        </g>
      )}

      {/* Regions indicator */}
      {step >= 5 && (
        <g transform="translate(50, 155)">
          <rect x="0" y="0" width="200" height="30" rx="3" fill="hsl(var(--card))" stroke="hsl(var(--border))" />
          <rect x="5" y="5" width="50" height="20" rx="2" fill={frame < 30 ? "hsl(var(--primary))" : "hsl(var(--muted))"} opacity="0.5" />
          <rect x="60" y="5" width="80" height="20" rx="2" fill={frame >= 30 && frame < 70 ? "hsl(var(--primary))" : "hsl(var(--muted))"} opacity="0.5" />
          <rect x="145" y="5" width="50" height="20" rx="2" fill={frame >= 70 ? "hsl(var(--primary))" : "hsl(var(--muted))"} opacity="0.5" />
          <text x="30" y="18" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="7">Cutoff</text>
          <text x="100" y="18" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="7">Active</text>
          <text x="170" y="18" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="7">Saturation</text>
        </g>
      )}
    </g>
  );
}

function renderMechanicalProcedure(step: number, frame: number) {
  const elongation = step >= 3 ? Math.min(frame * 0.3, 25) : 0;
  const force = step >= 3 ? frame * 0.5 : 0;
  
  return (
    <g>
      {/* UTM Machine */}
      <rect x="120" y="20" width="160" height="180" rx="5" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
      <text x="200" y="15" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="10">UTM</text>

      {/* Upper crosshead */}
      <rect x="140" y="35" width="120" height="20" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" />
      
      {/* Upper grip */}
      <polygon points="175,55 185,70 215,70 225,55" fill="hsl(var(--muted))" stroke="hsl(var(--border))" />

      {/* Specimen */}
      {step >= 1 && (
        <rect 
          x="190" 
          y="70" 
          width="20" 
          height={50 + elongation} 
          fill="hsl(var(--foreground))" 
          stroke="hsl(var(--border))"
        />
      )}

      {/* Gauge marks */}
      {step >= 0 && (
        <>
          <line x1="185" y1="75" x2="190" y2="75" stroke="hsl(var(--destructive))" strokeWidth="2" />
          <line x1="185" y1={115 + elongation} x2="190" y2={115 + elongation} stroke="hsl(var(--destructive))" strokeWidth="2" />
          <text x="175" y="95" textAnchor="end" fill="hsl(var(--destructive))" fontSize="8">50mm</text>
        </>
      )}

      {/* Lower grip */}
      <polygon points={`175,${120 + elongation} 185,${135 + elongation} 215,${135 + elongation} 225,${120 + elongation}`} fill="hsl(var(--muted))" stroke="hsl(var(--border))" />
      
      {/* Lower crosshead (movable) */}
      <rect x="140" y={135 + elongation} width="120" height="20" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" />

      {/* Force arrow */}
      {step >= 3 && (
        <g>
          <line x1="200" y1={160 + elongation} x2="200" y2={180 + elongation} stroke="hsl(var(--destructive))" strokeWidth="3" />
          <polygon points={`195,${175 + elongation} 200,${185 + elongation} 205,${175 + elongation}`} fill="hsl(var(--destructive))" />
          <text x="200" y={195 + elongation} textAnchor="middle" fill="hsl(var(--destructive))" fontSize="10" fontWeight="bold">
            {force.toFixed(0)} kN
          </text>
        </g>
      )}

      {/* Digital display */}
      <g transform="translate(290, 50)">
        <rect x="0" y="0" width="80" height="80" rx="5" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
        <text x="40" y="20" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">Load</text>
        <text x="40" y="35" textAnchor="middle" fill="hsl(var(--primary))" fontSize="12" fontWeight="bold">
          {step >= 2 ? `${force.toFixed(1)}kN` : '---'}
        </text>
        <line x1="10" y1="45" x2="70" y2="45" stroke="hsl(var(--border))" />
        <text x="40" y="58" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">Extension</text>
        <text x="40" y="73" textAnchor="middle" fill="hsl(var(--accent))" fontSize="12" fontWeight="bold">
          {step >= 2 ? `${elongation.toFixed(2)}mm` : '---'}
        </text>
      </g>

      {/* Calculations panel */}
      {step >= 5 && (
        <g transform="translate(30, 60)">
          <rect x="0" y="0" width="80" height="100" rx="5" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2" />
          <text x="40" y="15" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="8" fontWeight="bold">Calculations</text>
          <text x="10" y="35" fill="hsl(var(--muted-foreground))" fontSize="7">σ = F/A</text>
          <text x="10" y="50" fill="hsl(var(--primary))" fontSize="9">{(force * 10).toFixed(1)} MPa</text>
          <text x="10" y="65" fill="hsl(var(--muted-foreground))" fontSize="7">ε = ΔL/L</text>
          <text x="10" y="80" fill="hsl(var(--accent))" fontSize="9">{(elongation / 50 * 100).toFixed(3)}%</text>
        </g>
      )}
    </g>
  );
}

function renderFluidProcedure(step: number, frame: number) {
  const flowSpeed = step >= 2 ? frame * 0.5 : 0;
  const particles = Array.from({ length: 15 }, (_, i) => ({
    x: (flowSpeed + i * 20) % 280,
    y: 100 + Math.sin((frame + i * 15) * 0.1) * 8,
  }));

  return (
    <g>
      {/* Title */}
      <text x="200" y="25" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="12" fontWeight="bold">
        Bernoulli's Apparatus
      </text>

      {/* Inlet tank */}
      <rect x="20" y="50" width="50" height="80" rx="3" fill="hsl(185, 70%, 90%)" stroke="hsl(var(--border))" strokeWidth="2" />
      <rect x="25" y={step >= 1 ? 60 : 110} width="40" height={step >= 1 ? 65 : 15} fill="hsl(185, 70%, 50%)" opacity="0.6" />
      <text x="45" y="145" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">Inlet</text>

      {/* Converging-diverging section */}
      <path 
        d="M 70 80 L 100 90 L 100 110 L 70 120 Z" 
        fill="hsl(var(--muted))" 
        stroke="hsl(var(--border))" 
        strokeWidth="2"
      />
      <path 
        d="M 100 90 L 160 95 L 160 105 L 100 110 Z" 
        fill="hsl(var(--muted))" 
        stroke="hsl(var(--border))" 
        strokeWidth="2"
      />
      <path 
        d="M 160 95 L 220 90 L 220 110 L 160 105 Z" 
        fill="hsl(var(--muted))" 
        stroke="hsl(var(--border))" 
        strokeWidth="2"
      />
      <path 
        d="M 220 90 L 280 80 L 280 120 L 220 110 Z" 
        fill="hsl(var(--muted))" 
        stroke="hsl(var(--border))" 
        strokeWidth="2"
      />

      {/* Piezometer tubes */}
      {step >= 3 && (
        <>
          <rect x="83" y="40" width="8" height={50 - frame * 0.2} fill="hsl(185, 70%, 50%)" opacity="0.7" />
          <rect x="80" y="30" width="14" height={65 - frame * 0.2} fill="none" stroke="hsl(var(--border))" />
          <text x="87" y="25" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="7">P₁</text>
          
          <rect x="153" y="55" width="8" height={35 - frame * 0.1} fill="hsl(185, 70%, 50%)" opacity="0.7" />
          <rect x="150" y="45" width="14" height={50 - frame * 0.1} fill="none" stroke="hsl(var(--border))" />
          <text x="157" y="40" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="7">P₂</text>
          
          <rect x="243" y="45" width="8" height={45 - frame * 0.15} fill="hsl(185, 70%, 50%)" opacity="0.7" />
          <rect x="240" y="35" width="14" height={60 - frame * 0.15} fill="none" stroke="hsl(var(--border))" />
          <text x="247" y="30" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="7">P₃</text>
        </>
      )}

      {/* Water particles */}
      {step >= 2 && particles.map((p, i) => (
        <circle
          key={i}
          cx={70 + p.x}
          cy={p.y}
          r={3}
          fill="hsl(185, 70%, 50%)"
          opacity={0.8}
        />
      ))}

      {/* Outlet tank */}
      <rect x="290" y="50" width="50" height="80" rx="3" fill="hsl(185, 70%, 90%)" stroke="hsl(var(--border))" strokeWidth="2" />
      <rect x="295" y={step >= 2 ? 70 : 125} width="40" height={step >= 2 ? 55 : 0} fill="hsl(185, 70%, 50%)" opacity="0.6" />
      <text x="315" y="145" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">Outlet</text>

      {/* Velocity indicators */}
      {step >= 4 && (
        <g transform="translate(80, 160)">
          <text x="5" y="0" fill="hsl(var(--muted-foreground))" fontSize="8">V₁: Low</text>
          <text x="80" y="0" fill="hsl(var(--primary))" fontSize="8" fontWeight="bold">V₂: High</text>
          <text x="165" y="0" fill="hsl(var(--muted-foreground))" fontSize="8">V₃: Low</text>
        </g>
      )}

      {/* Bernoulli equation */}
      {step >= 5 && (
        <g transform="translate(70, 175)">
          <rect x="0" y="0" width="260" height="25" rx="3" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2" />
          <text x="130" y="17" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="9">
            P₁/ρg + V₁²/2g + Z₁ = P₂/ρg + V₂²/2g + Z₂ ✓
          </text>
        </g>
      )}
    </g>
  );
}

function renderCivilProcedure(step: number, frame: number) {
  const pulseR = 3 + Math.sin(frame * 0.1) * 1;
  
  return (
    <g>
      {/* Ground/field */}
      <rect x="30" y="40" width="340" height="140" rx="5" fill="hsl(142, 40%, 92%)" stroke="hsl(var(--border))" strokeWidth="2" />
      
      {/* Baseline */}
      {step >= 1 && (
        <>
          <line x1="60" y1="110" x2="320" y2="110" stroke="hsl(var(--primary))" strokeWidth="3" strokeDasharray={step >= 1 ? "none" : "5,5"} />
          <circle cx="60" cy="110" r={pulseR} fill="hsl(var(--destructive))" />
          <circle cx="320" cy="110" r={pulseR} fill="hsl(var(--destructive))" />
          <text x="60" y="130" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontWeight="bold">A</text>
          <text x="320" y="130" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontWeight="bold">B</text>
          <text x="190" y="125" textAnchor="middle" fill="hsl(var(--primary))" fontSize="9">Baseline: 50m</text>
        </>
      )}

      {/* Chain/tape animation */}
      {step >= 1 && step < 3 && (
        <g>
          <rect x={60 + (frame * 2.6) % 260} y="105" width="30" height="10" rx="2" fill="hsl(var(--accent))" opacity="0.7" />
        </g>
      )}

      {/* Offsets */}
      {step >= 2 && (
        <>
          <line x1="120" y1="110" x2="120" y2="65" stroke="hsl(var(--accent))" strokeWidth="2" strokeDasharray="4,2" />
          <circle cx="120" cy="65" r="4" fill="hsl(var(--accent))" />
          <text x="130" y="85" fill="hsl(var(--accent))" fontSize="8">5m offset</text>

          <line x1="220" y1="110" x2="220" y2="55" stroke="hsl(var(--accent))" strokeWidth="2" strokeDasharray="4,2" />
          <circle cx="220" cy="55" r="4" fill="hsl(var(--accent))" />
          <text x="230" y="80" fill="hsl(var(--accent))" fontSize="8">8m offset</text>
        </>
      )}

      {/* Chainage annotations */}
      {step >= 3 && (
        <>
          <text x="120" y="145" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">Ch: 15m</text>
          <text x="220" y="145" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">Ch: 35m</text>
        </>
      )}

      {/* Field book sketch */}
      {step >= 4 && (
        <g transform="translate(30, 155)">
          <rect x="0" y="0" width="100" height="45" rx="3" fill="hsl(var(--card))" stroke="hsl(var(--border))" />
          <text x="50" y="12" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="8" fontWeight="bold">Field Book</text>
          <line x1="10" y1="20" x2="90" y2="20" stroke="hsl(var(--primary))" strokeWidth="1" />
          <line x1="30" y1="20" x2="30" y2="35" stroke="hsl(var(--accent))" strokeWidth="1" />
          <line x1="60" y1="20" x2="60" y2="40" stroke="hsl(var(--accent))" strokeWidth="1" />
          <text x="50" y="42" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="6">Sketch with measurements</text>
        </g>
      )}

      {/* Final plot/map */}
      {step >= 5 && (
        <g transform="translate(270, 155)">
          <rect x="0" y="0" width="100" height="45" rx="3" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2" />
          <text x="50" y="12" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="8" fontWeight="bold">Survey Map</text>
          <line x1="15" y1="25" x2="85" y2="25" stroke="hsl(var(--primary))" strokeWidth="2" />
          <polygon points="30,25 30,18 40,18" fill="hsl(var(--accent))" />
          <polygon points="60,25 60,15 70,15" fill="hsl(var(--accent))" />
          <text x="50" y="42" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="6">Scale: 1:500</text>
        </g>
      )}

      {/* Surveyor figure */}
      <g transform={`translate(${step < 2 ? 60 : 120 + (step - 2) * 50}, 95)`}>
        <circle cx="0" cy="-10" r="5" fill="hsl(var(--foreground))" />
        <line x1="0" y1="-5" x2="0" y2="5" stroke="hsl(var(--foreground))" strokeWidth="2" />
        <line x1="-5" y1="0" x2="5" y2="0" stroke="hsl(var(--foreground))" strokeWidth="2" />
      </g>
    </g>
  );
}

function renderConcreteProcedure(step: number, frame: number) {
  const mixProgress = step >= 4 ? Math.min(frame, 100) : 0;
  
  return (
    <g>
      {/* Title area */}
      <text x="200" y="20" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="12" fontWeight="bold">
        Concrete Mix Design
      </text>

      {/* Material containers */}
      <g transform="translate(30, 40)">
        {/* Cement */}
        <rect x="0" y="0" width="50" height="60" rx="3" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="2" />
        <rect x="5" y={step >= 3 ? 30 : 10} width="40" height={step >= 3 ? 25 : 45} fill="hsl(220, 20%, 70%)" />
        <text x="25" y="75" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">Cement</text>
        {step >= 1 && <text x="25" y="88" textAnchor="middle" fill="hsl(var(--primary))" fontSize="7">350 kg</text>}
      </g>

      <g transform="translate(90, 40)">
        {/* Water */}
        <rect x="0" y="0" width="50" height="60" rx="3" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="2" />
        <rect x="5" y={step >= 3 ? 35 : 15} width="40" height={step >= 3 ? 20 : 40} fill="hsl(200, 80%, 60%)" opacity="0.7" />
        <text x="25" y="75" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">Water</text>
        {step >= 1 && <text x="25" y="88" textAnchor="middle" fill="hsl(var(--primary))" fontSize="7">157.5 L</text>}
      </g>

      <g transform="translate(150, 40)">
        {/* Fine aggregate */}
        <rect x="0" y="0" width="50" height="60" rx="3" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="2" />
        <rect x="5" y={step >= 3 ? 25 : 5} width="40" height={step >= 3 ? 30 : 50} fill="hsl(45, 60%, 60%)" />
        <text x="25" y="75" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">Sand</text>
        {step >= 2 && <text x="25" y="88" textAnchor="middle" fill="hsl(var(--primary))" fontSize="7">525 kg</text>}
      </g>

      <g transform="translate(210, 40)">
        {/* Coarse aggregate */}
        <rect x="0" y="0" width="50" height="60" rx="3" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="2" />
        <rect x="5" y={step >= 3 ? 20 : 5} width="40" height={step >= 3 ? 35 : 50} fill="hsl(30, 30%, 50%)" />
        <text x="25" y="75" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">Aggregate</text>
        {step >= 2 && <text x="25" y="88" textAnchor="middle" fill="hsl(var(--primary))" fontSize="7">1050 kg</text>}
      </g>

      {/* Mixer */}
      <g transform="translate(280, 35)">
        <ellipse cx="50" cy="35" rx="45" ry="30" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="2" />
        <ellipse cx="50" cy="35" rx="35" ry="20" fill="hsl(var(--card))" />
        {step >= 4 && (
          <g>
            <ellipse cx="50" cy="35" rx="30" ry="15" fill={`hsl(${200 - mixProgress}, 30%, 50%)`} opacity="0.8" />
            <line 
              x1="50" y1="25" 
              x2={50 + Math.cos(frame * 0.2) * 20} 
              y2={35 + Math.sin(frame * 0.2) * 10} 
              stroke="hsl(var(--foreground))" 
              strokeWidth="2" 
            />
          </g>
        )}
        <text x="50" y="80" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">Mixer</text>
      </g>

      {/* W/C Ratio indicator */}
      {step >= 1 && (
        <g transform="translate(90, 110)">
          <rect x="0" y="0" width="90" height="35" rx="5" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2" />
          <text x="45" y="15" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">W/C Ratio</text>
          <text x="45" y="28" textAnchor="middle" fill="hsl(var(--primary))" fontSize="11" fontWeight="bold">0.45</text>
        </g>
      )}

      {/* Slump test */}
      {step >= 5 && (
        <g transform="translate(30, 150)">
          <polygon points="20,0 30,40 10,40" fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
          <polygon points="20,5 28,40 12,40" fill="hsl(var(--muted-foreground))" opacity="0.5" />
          <line x1="35" y1="0" x2="35" y2="40" stroke="hsl(var(--accent))" strokeWidth="1" strokeDasharray="3,2" />
          <line x1="33" y1="10" x2="37" y2="10" stroke="hsl(var(--accent))" strokeWidth="2" />
          <text x="45" y="25" fill="hsl(var(--accent))" fontSize="8">Slump</text>
          <text x="45" y="37" fill="hsl(var(--accent))" fontSize="9" fontWeight="bold">75mm</text>
        </g>
      )}

      {/* Cube mould */}
      {step >= 5 && (
        <g transform="translate(120, 155)">
          <rect x="0" y="0" width="35" height="35" fill="hsl(var(--muted-foreground))" stroke="hsl(var(--border))" strokeWidth="2" />
          <rect x="3" y="3" width="29" height="29" fill="hsl(200, 20%, 55%)" />
          <text x="17" y="50" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="7">150mm cube</text>
        </g>
      )}

      {/* Expected strength */}
      {step >= 5 && (
        <g transform="translate(200, 150)">
          <rect x="0" y="0" width="160" height="45" rx="5" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2" />
          <text x="80" y="18" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">Target 28-day Strength</text>
          <text x="80" y="36" textAnchor="middle" fill="hsl(var(--primary))" fontSize="14" fontWeight="bold">M25 (25 MPa)</text>
        </g>
      )}
    </g>
  );
}
