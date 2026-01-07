import { useState, useEffect, useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getExperimentById, getLabById, getDepartmentByLabId } from '@/data/departments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ParameterSlider } from '@/components/experiment/ParameterSlider';
import { ObservationTable } from '@/components/experiment/ObservationTable';
import { ExperimentGraph } from '@/components/experiment/ExperimentGraph';
import { AIExplanation } from '@/components/experiment/AIExplanation';
import { WhatIfPanel } from '@/components/experiment/WhatIfPanel';
import { AnimatedDiagram } from '@/components/experiment/AnimatedDiagram';
import { DemoVideoModal } from '@/components/experiment/DemoVideoModal';
import { ArrowLeft, FlaskConical, BookOpen, Lightbulb, CheckCircle, Play, Video, RotateCcw } from 'lucide-react';

export default function Experiment() {
  const { experimentId } = useParams<{ experimentId: string }>();
  const { isAuthenticated, updateProgress, progress } = useAuth();
  const experiment = experimentId ? getExperimentById(experimentId) : undefined;
  const lab = experiment ? getLabById(experiment.labId) : undefined;
  const department = lab ? getDepartmentByLabId(lab.id) : undefined;
  const [paramValues, setParamValues] = useState<Record<string, number>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  const currentProgress = progress.find(p => p.experimentId === experimentId);
  const isCompleted = currentProgress?.status === 'completed';

  useEffect(() => {
    if (experiment) {
      const initialValues: Record<string, number> = {};
      experiment.parameters.forEach(p => {
        initialValues[p.id] = p.default;
      });
      setParamValues(initialValues);
    }
  }, [experiment]);

  // Check if already in progress
  useEffect(() => {
    if (currentProgress?.status === 'in_progress') {
      setIsRunning(true);
    }
  }, [currentProgress]);

  const calculatedResults = useMemo((): Record<string, number> => {
    if (!experiment) return {};
    
    switch (experiment.id) {
      case 'ohms-law': {
        const voltage = paramValues['voltage'] || 0;
        const resistance = paramValues['resistance'] || 1;
        const current = voltage / resistance;
        const power = voltage * current;
        return { current, power, voltage };
      }
      case 'kvl-verification': {
        const sourceV = paramValues['source-voltage'] || 0;
        const r1 = paramValues['r1'] || 1;
        const r2 = paramValues['r2'] || 1;
        const r3 = paramValues['r3'] || 1;
        const totalR = r1 + r2 + r3;
        const current = sourceV / totalR;
        return { current, v1: current * r1, v2: current * r2, v3: current * r3, totalR };
      }
      case 'series-parallel': {
        const voltage = paramValues['voltage'] || 0;
        const r1 = paramValues['r1'] || 1;
        const r2 = paramValues['r2'] || 1;
        const isSeries = paramValues['config'] === 0;
        const req = isSeries ? r1 + r2 : (r1 * r2) / (r1 + r2);
        return { req, current: voltage / req, config: isSeries ? 0 : 1 };
      }
      case 'kcl-verification': {
        const voltage = paramValues['voltage'] || 0;
        const r1 = paramValues['r1'] || 1;
        const r2 = paramValues['r2'] || 1;
        const r3 = paramValues['r3'] || 1;
        const i1 = voltage / r1;
        const i2 = voltage / r2;
        const i3 = voltage / r3;
        return { i1, i2, i3, totalCurrent: i1 + i2 + i3 };
      }
      case 'power-measurement': {
        const voltage = paramValues['voltage'] || 0;
        const resistance = paramValues['resistance'] || 1;
        const current = voltage / resistance;
        const power = voltage * current;
        return { current, power, powerByI2R: current * current * resistance };
      }
      case 'superposition-theorem': {
        const v1 = paramValues['v1'] || 0;
        const v2 = paramValues['v2'] || 0;
        const r1 = paramValues['r1'] || 1;
        const r2 = paramValues['r2'] || 1;
        const rl = paramValues['rl'] || 1;
        // Simplified calculation
        const i1Due = v1 / (r1 + (r2 * rl) / (r2 + rl));
        const i2Due = v2 / (r2 + (r1 * rl) / (r1 + rl));
        return { i1Due: i1Due * 1000, i2Due: i2Due * 1000, totalI: (i1Due + i2Due) * 1000 };
      }
      case 'transistor-ce': {
        const vbe = paramValues['vbe'] || 0;
        const vce = paramValues['vce'] || 0;
        const rb = paramValues['rb'] || 50;
        const ib = vbe > 0.6 ? (vbe - 0.6) / rb : 0;
        const beta = 100;
        const ic = vce < 0.3 ? ib * beta * (vce / 0.3) : ib * beta;
        return { ib: ib * 1000, ic: ic * 1000, beta, vce };
      }
      case 'diode-characteristics': {
        const voltage = paramValues['voltage'] || 0;
        const temp = paramValues['temperature'] || 25;
        const vt = (273 + temp) / 11600;
        const is = 1e-12;
        const current = voltage > 0 ? is * (Math.exp(voltage / vt) - 1) * 1000 : -is * 1e6;
        return { current: Math.min(current, 100), forwardDrop: voltage > 0.7 ? 0.7 : voltage };
      }
      case 'zener-regulator': {
        const vin = paramValues['vin'] || 9;
        const rs = paramValues['rs'] || 220;
        const rl = paramValues['rl'] || 1000;
        const vz = 5.1;
        const vout = vin > vz ? vz : vin * 0.9;
        const il = vout / rl;
        const is = (vin - vout) / rs;
        const iz = is - il;
        return { vout, il: il * 1000, is: is * 1000, iz: iz * 1000 };
      }
      case 'rectifier-half': {
        const vm = paramValues['vm'] || 12;
        const rl = paramValues['rl'] || 1000;
        const cap = paramValues['capacitor'] || 100;
        const vdc = vm / Math.PI;
        const ripple = cap > 0 ? 1 / (2 * 50 * (cap / 1e6) * rl) : 1.21;
        return { vdc, vrms: vm / 2, ripple: Math.min(ripple, 1.21), efficiency: 40.6 };
      }
      case 'ce-amplifier': {
        const rc = paramValues['rc'] || 2.2;
        const re = paramValues['re'] || 470;
        const vin = paramValues['vin'] || 20;
        const bypass = paramValues['bypass'] || 1;
        const gain = bypass ? rc * 1000 / 25 : (rc * 1000) / re;
        const vout = Math.min(vin * gain / 1000, 5);
        return { gain, vout, phase: 180 };
      }
      case 'tensile-test': {
        const force = paramValues['force'] || 0;
        const diameter = paramValues['diameter'] || 12;
        const gaugeLength = paramValues['gauge-length'] || 50;
        const area = Math.PI * Math.pow(diameter / 2, 2);
        const stress = (force * 1000) / area;
        const strain = stress / 200000;
        const elongation = strain * gaugeLength;
        return { stress, strain: strain * 100, area, elongation };
      }
      case 'hardness-test': {
        const load = paramValues['load'] || 500;
        const ballDia = paramValues['ball-diameter'] || 10;
        const impression = paramValues['impression'] || 3.5;
        const bhn = (2 * load) / (Math.PI * ballDia * (ballDia - Math.sqrt(ballDia * ballDia - impression * impression)));
        return { bhn, load, impressionArea: Math.PI * impression * impression / 4 };
      }
      case 'impact-test': {
        const h1 = paramValues['pendulum-height'] || 1.0;
        const h2 = paramValues['final-height'] || 0.4;
        const mass = 20; // kg
        const energy = mass * 9.81 * (h1 - h2);
        const toughness = energy / 80; // per unit area
        return { energy, toughness, absorbed: ((h1 - h2) / h1) * 100 };
      }
      case 'compression-test': {
        const load = paramValues['load'] || 500;
        const cubeSize = paramValues['cube-size'] || 150;
        const area = cubeSize * cubeSize;
        const strength = (load * 1000) / area;
        return { strength, area, load };
      }
      case 'bernoulli-theorem': {
        const flowRate = paramValues['flow-rate'] || 15;
        const inletArea = paramValues['inlet-area'] || 5;
        const outletArea = paramValues['outlet-area'] || 3;
        const v1 = (flowRate / 60000) / (inletArea / 10000);
        const v2 = (flowRate / 60000) / (outletArea / 10000);
        const p1 = 101325;
        const p2 = p1 - 0.5 * 1000 * (v2 * v2 - v1 * v1);
        return { v1, v2, pressureDrop: (p1 - p2) / 1000, flowRate };
      }
      case 'reynolds-experiment': {
        const velocity = paramValues['velocity'] || 10;
        const diameter = paramValues['diameter'] || 25;
        const viscosity = paramValues['viscosity'] || 1;
        const re = (velocity / 100) * (diameter / 1000) / (viscosity / 1e6);
        const regime = re < 2000 ? 0 : re > 4000 ? 2 : 1;
        return { re, regime, velocity };
      }
      case 'venturi-meter': {
        const headDiff = paramValues['head-diff'] || 20;
        const d1 = paramValues['inlet-dia'] || 40;
        const d2 = paramValues['throat-dia'] || 20;
        const a1 = Math.PI * (d1 / 2000) ** 2;
        const a2 = Math.PI * (d2 / 2000) ** 2;
        const cd = 0.98;
        const q = cd * a2 * Math.sqrt((2 * 9.81 * headDiff / 100) / (1 - (a2 / a1) ** 2));
        return { discharge: q * 1000, velocity: q / a2, cd };
      }
      case 'pipe-friction': {
        const velocity = paramValues['velocity'] || 2;
        const length = paramValues['pipe-length'] || 5;
        const dia = paramValues['pipe-dia'] || 25;
        const roughness = paramValues['roughness'] || 0.05;
        const re = velocity * (dia / 1000) / 1e-6;
        const f = re < 2000 ? 64 / re : 0.25 / Math.pow(Math.log10(roughness / (3.7 * dia) + 5.74 / Math.pow(re, 0.9)), 2);
        const hf = f * length * velocity ** 2 / (2 * 9.81 * dia / 1000);
        return { frictionFactor: f, headLoss: hf, re };
      }
      case 'chain-survey': {
        const baseline = paramValues['baseline'] || 50;
        const offset1 = paramValues['offset1'] || 5;
        const offset2 = paramValues['offset2'] || 8;
        const angle = paramValues['chain-angle'] || 90;
        const area = 0.5 * baseline * (offset1 + offset2);
        return { area, perimeter: baseline + offset1 + offset2 + Math.sqrt(baseline ** 2 + offset1 ** 2), angle };
      }
      case 'compass-survey': {
        const sides = paramValues['sides'] || 4;
        const length = paramValues['length1'] || 50;
        const localAttr = paramValues['local-attraction'] || 0;
        const sumAngles = (2 * sides - 4) * 90;
        const perimeter = sides * length;
        return { sumAngles, perimeter, correctedBearing: 45 - localAttr };
      }
      case 'leveling': {
        const bs = paramValues['bs'] || 1.5;
        const fs = paramValues['fs'] || 2.0;
        const bm = paramValues['bm'] || 100;
        const rise = bs > fs ? bs - fs : 0;
        const fall = fs > bs ? fs - bs : 0;
        const rl = bm + rise - fall;
        return { rise, fall, rl, hi: bm + bs };
      }
      case 'plane-table': {
        const scale = paramValues['scale'] || 500;
        const stationDist = paramValues['station-dist'] || 50;
        const mapDist = stationDist / scale * 100;
        return { mapDistance: mapDist, groundDistance: stationDist, rf: 1 / scale };
      }
      case 'concrete-mix': {
        const cement = paramValues['cement'] || 350;
        const wcRatio = paramValues['wc-ratio'] || 0.45;
        const faRatio = paramValues['fa-ratio'] || 1.5;
        const caRatio = paramValues['ca-ratio'] || 3;
        const water = cement * wcRatio;
        const strength = 42.5 - 42 * (wcRatio - 0.35);
        return { water, strength: Math.max(strength, 15), totalWeight: cement + water + cement * faRatio + cement * caRatio };
      }
      case 'slump-test': {
        const waterContent = paramValues['water-content'] || 160;
        const sandPercent = paramValues['sand-percent'] || 40;
        const admixture = paramValues['admixture'] || 0;
        const slump = (waterContent - 140) * 1.5 + admixture * 20;
        const cf = 0.85 + (waterContent - 140) / 200 + admixture / 50;
        return { slump: Math.max(0, Math.min(slump, 200)), compactionFactor: Math.min(cf, 0.98) };
      }
      case 'aggregate-grading': {
        const coarse = paramValues['coarse-percent'] || 25;
        const fine = paramValues['fine-percent'] || 35;
        const fm = (coarse * 6 + fine * 3 + (100 - coarse - fine) * 1) / 100;
        return { finessModulus: fm, gapGraded: Math.abs(coarse - fine) > 20 ? 1 : 0 };
      }
      case 'cube-strength': {
        const load = paramValues['load'] || 700;
        const area = paramValues['cube-area'] || 22500;
        const days = paramValues['curing-days'] || 28;
        const factor = days === 7 ? 0.65 : days === 14 ? 0.85 : 1;
        const strength = (load * 1000) / area * factor;
        return { strength, characteristicStrength: strength * 0.85, grade: Math.floor(strength / 5) * 5 };
      }
      default:
        return {};
    }
  }, [experiment, paramValues]);

  const graphData = useMemo(() => {
    if (!experiment) return [];
    
    switch (experiment.id) {
      case 'ohms-law': {
        const resistance = paramValues['resistance'] || 100;
        return Array.from({ length: 31 }, (_, i) => ({
          x: i,
          y: i / resistance,
        }));
      }
      case 'transistor-ce': {
        return Array.from({ length: 20 }, (_, i) => {
          const vbe = 0.5 + i * 0.02;
          const ib = vbe > 0.6 ? (vbe - 0.6) / (paramValues['rb'] || 50) * 1000 : 0;
          return { x: vbe, y: ib };
        });
      }
      case 'diode-characteristics': {
        return Array.from({ length: 30 }, (_, i) => {
          const v = -1 + i * 0.1;
          const temp = paramValues['temperature'] || 25;
          const vt = (273 + temp) / 11600;
          const is = 1e-12;
          const current = v > 0 ? is * (Math.exp(v / vt) - 1) * 1000 : -is * 1e6;
          return { x: v, y: Math.min(Math.max(current, -0.01), 50) };
        });
      }
      case 'tensile-test': {
        const diameter = paramValues['diameter'] || 12;
        const area = Math.PI * Math.pow(diameter / 2, 2);
        return Array.from({ length: 21 }, (_, i) => {
          const force = i * 5;
          const stress = (force * 1000) / area;
          return { x: (stress / 200000) * 100, y: stress };
        });
      }
      case 'bernoulli-theorem': {
        return Array.from({ length: 11 }, (_, i) => {
          const area = 2 + i * 0.8;
          const flowRate = paramValues['flow-rate'] || 15;
          const velocity = (flowRate / 60000) / (area / 10000);
          return { x: area, y: velocity };
        });
      }
      case 'reynolds-experiment': {
        const diameter = paramValues['diameter'] || 25;
        const viscosity = paramValues['viscosity'] || 1;
        return Array.from({ length: 20 }, (_, i) => {
          const velocity = 2 + i * 3;
          const re = (velocity / 100) * (diameter / 1000) / (viscosity / 1e6);
          return { x: velocity, y: re };
        });
      }
      case 'concrete-mix': {
        return Array.from({ length: 11 }, (_, i) => {
          const wcRatio = 0.35 + i * 0.025;
          const strength = 42.5 - 42 * (wcRatio - 0.35);
          return { x: wcRatio, y: Math.max(strength, 15) };
        });
      }
      default:
        return [];
    }
  }, [experiment, paramValues]);

  const warningCondition = useMemo(() => {
    if (!experiment) return false;
    if (experiment.id === 'ohms-law') {
      return (calculatedResults.power as number) > 0.5;
    }
    if (experiment.id === 'concrete-mix') {
      return (paramValues['wc-ratio'] || 0.45) > 0.55;
    }
    return false;
  }, [experiment, calculatedResults, paramValues]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!experiment || !lab) {
    return (
      <div className="container py-8">
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold">Experiment not found</h1>
          <Button asChild className="mt-4">
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleParameterChange = (parameterId: string, value: number) => {
    setParamValues(prev => ({ ...prev, [parameterId]: value }));
  };

  const handleApplyScenario = (changes: Record<string, number>) => {
    setParamValues(prev => ({ ...prev, ...changes }));
  };

  const handleReset = () => {
    const resetValues: Record<string, number> = {};
    experiment.parameters.forEach(p => {
      resetValues[p.id] = p.default;
    });
    setParamValues(resetValues);
  };

  const handleStartExperiment = () => {
    setIsRunning(true);
    updateProgress(experiment.id, 'in_progress');
  };

  const handleCompleteExperiment = () => {
    updateProgress(experiment.id, 'completed');
  };

  const tableColumns = [
    ...experiment.parameters.map(p => ({ key: p.id, label: p.name, unit: p.unit })),
    ...Object.keys(calculatedResults)
      .filter(key => !experiment.parameters.find(p => p.id === key))
      .map(key => ({
        key,
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        unit: key.includes('current') || key.includes('Current') ? 'A' : 
              key.includes('power') || key.includes('Power') ? 'W' : 
              key.includes('stress') || key.includes('strength') ? 'MPa' :
              key.includes('voltage') || key.includes('Voltage') ? 'V' : '',
      })),
  ];

  const allValues = { ...paramValues, ...calculatedResults };

  return (
    <div className="container py-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          to={`/lab/${lab.id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to {lab.name}
        </Link>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {department && (
                <Badge variant="outline" className="text-xs">
                  {department.name}
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs">
                {lab.name}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold">{experiment.name}</h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setShowDemoModal(true)}>
              <Video className="h-4 w-4 mr-2" /> Watch Demo
            </Button>
            {!isRunning ? (
              <Button onClick={handleStartExperiment} className="bg-gradient-to-r from-primary to-accent">
                <Play className="h-4 w-4 mr-2" /> Start Experiment
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" /> Reset Values
                </Button>
                {isCompleted ? (
                  <Button variant="secondary" disabled>
                    <CheckCircle className="h-4 w-4 mr-2" /> Completed
                  </Button>
                ) : (
                  <Button onClick={handleCompleteExperiment} variant="accent">
                    <CheckCircle className="h-4 w-4 mr-2" /> Mark Complete
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Demo Video Modal */}
      <DemoVideoModal
        open={showDemoModal}
        onOpenChange={setShowDemoModal}
        experimentId={experiment.id}
        experimentName={experiment.name}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Panel - Controls */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5" /> Experiment Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Aim</h4>
                <p className="text-sm text-muted-foreground">{experiment.aim}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Apparatus</h4>
                <div className="flex flex-wrap gap-1">
                  {experiment.apparatus.slice(0, 5).map((item, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                  {experiment.apparatus.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{experiment.apparatus.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
              {experiment.formula && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Formula</h4>
                  <code className="text-sm bg-muted px-2 py-1 rounded font-mono block">
                    {experiment.formula}
                  </code>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <FlaskConical className="h-5 w-5" /> Parameters
              </CardTitle>
              <CardDescription>Adjust values to observe changes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {experiment.parameters.map(param => (
                <ParameterSlider
                  key={param.id}
                  parameter={param}
                  value={paramValues[param.id] ?? param.default}
                  onChange={(value) => handleParameterChange(param.id, value)}
                />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5" /> Calculated Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(calculatedResults).slice(0, 6).map(([key, value]) => (
                  <div key={key} className="p-3 rounded-lg bg-muted/50 text-center">
                    <div className="text-xs text-muted-foreground capitalize mb-1">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </div>
                    <div className="font-mono font-semibold text-sm">
                      {typeof value === 'number' ? value.toFixed(4) : value}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Visualizations */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="visualization" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="visualization">Visualization</TabsTrigger>
              <TabsTrigger value="table">Observations</TabsTrigger>
              <TabsTrigger value="whatif">What-If</TabsTrigger>
              <TabsTrigger value="ai">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="visualization" className="space-y-6 mt-6">
              <AnimatedDiagram
                experimentId={experiment.id}
                paramValues={paramValues}
                calculatedResults={calculatedResults}
              />
              {graphData.length > 0 && (
                <ExperimentGraph
                  title={
                    experiment.id === 'ohms-law' ? 'V-I Characteristics' :
                    experiment.id === 'transistor-ce' ? 'Input Characteristics (IB vs VBE)' :
                    experiment.id === 'diode-characteristics' ? 'Diode V-I Characteristics' :
                    experiment.id === 'tensile-test' ? 'Stress-Strain Curve' :
                    experiment.id === 'bernoulli-theorem' ? 'Velocity vs Area' :
                    experiment.id === 'reynolds-experiment' ? 'Reynolds Number vs Velocity' :
                    experiment.id === 'concrete-mix' ? 'Strength vs W/C Ratio' :
                    'Experiment Graph'
                  }
                  xLabel={
                    experiment.id === 'ohms-law' ? 'Voltage' :
                    experiment.id === 'transistor-ce' ? 'VBE' :
                    experiment.id === 'diode-characteristics' ? 'Voltage' :
                    experiment.id === 'tensile-test' ? 'Strain' :
                    experiment.id === 'bernoulli-theorem' ? 'Area' :
                    experiment.id === 'reynolds-experiment' ? 'Velocity' :
                    experiment.id === 'concrete-mix' ? 'W/C Ratio' :
                    'X'
                  }
                  yLabel={
                    experiment.id === 'ohms-law' ? 'Current' :
                    experiment.id === 'transistor-ce' ? 'IB' :
                    experiment.id === 'diode-characteristics' ? 'Current' :
                    experiment.id === 'tensile-test' ? 'Stress' :
                    experiment.id === 'bernoulli-theorem' ? 'Velocity' :
                    experiment.id === 'reynolds-experiment' ? 'Re' :
                    experiment.id === 'concrete-mix' ? 'Strength' :
                    'Y'
                  }
                  xUnit={
                    experiment.id === 'tensile-test' ? '%' :
                    experiment.id === 'bernoulli-theorem' ? 'cm²' :
                    experiment.id === 'reynolds-experiment' ? 'cm/s' :
                    experiment.id === 'concrete-mix' ? '' :
                    'V'
                  }
                  yUnit={
                    experiment.id === 'ohms-law' ? 'A' :
                    experiment.id === 'transistor-ce' ? 'µA' :
                    experiment.id === 'diode-characteristics' ? 'mA' :
                    experiment.id === 'tensile-test' ? 'MPa' :
                    experiment.id === 'bernoulli-theorem' ? 'm/s' :
                    experiment.id === 'reynolds-experiment' ? '' :
                    experiment.id === 'concrete-mix' ? 'MPa' :
                    ''
                  }
                  data={graphData}
                  currentPoint={{
                    x: paramValues['voltage'] || paramValues['vbe'] || paramValues['wc-ratio'] || 0,
                    y: calculatedResults.current || calculatedResults.ib || calculatedResults.strength || 0,
                  }}
                  showArea={experiment.id === 'tensile-test'}
                />
              )}
            </TabsContent>

            <TabsContent value="table" className="mt-6">
              <ObservationTable
                experimentId={experiment.id}
                columns={tableColumns}
                currentValues={allValues}
              />
            </TabsContent>

            <TabsContent value="whatif" className="mt-6">
              <WhatIfPanel
                scenarios={experiment.whatIfScenarios}
                parameters={experiment.parameters}
                currentValues={paramValues}
                onApplyScenario={handleApplyScenario}
                onReset={handleReset}
              />
            </TabsContent>

            <TabsContent value="ai" className="mt-6">
              <AIExplanation
                experimentId={experiment.id}
                experimentName={experiment.name}
                principle={experiment.principle}
                currentValues={paramValues}
                calculatedResults={calculatedResults}
                warningCondition={warningCondition}
                warningMessage={
                  warningCondition
                    ? experiment.id === 'ohms-law'
                      ? 'Power dissipation is high (>0.5W). In a real circuit, this could cause overheating of the resistor. Consider using a higher-rated resistor or reducing voltage.'
                      : experiment.id === 'concrete-mix'
                        ? 'W/C ratio is too high (>0.55). Excess water will significantly reduce concrete strength and durability.'
                        : 'Warning: Current parameters may lead to suboptimal results. Review the calculated values.'
                    : undefined
                }
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
