import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Lightbulb, AlertTriangle, TrendingUp, Zap, Atom, FlaskConical, Droplets, Ruler, Building } from 'lucide-react';
import { useMemo } from 'react';

interface AIExplanationProps {
  experimentId: string;
  experimentName: string;
  principle: string;
  currentValues: Record<string, number>;
  calculatedResults: Record<string, number>;
  warningCondition?: boolean;
  warningMessage?: string;
}

// Dynamic physics explanations based on experiment and current values
const generateDynamicExplanation = (
  experimentId: string,
  params: Record<string, number>,
  results: Record<string, number>
): { title: string; explanation: string; concept: string; realWorld: string; icon: React.ReactNode } => {
  
  switch (experimentId) {
    case 'ohms-law': {
      const V = params['voltage'] || 0;
      const R = params['resistance'] || 1;
      const I = results.current || 0;
      const P = results.power || 0;
      
      let explanation = `With ${V}V applied across ${R}Ω resistance, `;
      if (I > 0.5) {
        explanation += `the current of ${I.toFixed(3)}A is quite high. This means electrons are flowing rapidly through the conductor.`;
      } else if (I > 0.1) {
        explanation += `the current of ${I.toFixed(3)}A indicates moderate electron flow. The resistance is effectively limiting the current.`;
      } else {
        explanation += `the current of ${I.toFixed(3)}A is relatively low. The high resistance is significantly impeding electron flow.`;
      }
      
      const concept = P > 0.5 
        ? `⚡ Power dissipation of ${P.toFixed(3)}W is significant. This energy converts to heat (Joule heating). In practice, you'd need a resistor rated for at least ${Math.ceil(P * 2)}W.`
        : `The power dissipation of ${P.toFixed(3)}W is within safe limits for most standard resistors.`;
      
      return {
        title: "Ohm's Law Analysis",
        explanation,
        concept,
        realWorld: "This relationship is fundamental in designing LED circuits, heating elements, and voltage dividers.",
        icon: <Zap className="h-5 w-5 text-yellow-500" />
      };
    }
    
    case 'kvl-verification': {
      const Vs = params['source-voltage'] || 0;
      const v1 = results.v1 || 0;
      const v2 = results.v2 || 0;
      const v3 = results.v3 || 0;
      const sum = v1 + v2 + v3;
      
      return {
        title: "Kirchhoff's Voltage Law",
        explanation: `In this series circuit, the source voltage (${Vs}V) equals the sum of voltage drops: V₁(${v1.toFixed(2)}V) + V₂(${v2.toFixed(2)}V) + V₃(${v3.toFixed(2)}V) = ${sum.toFixed(2)}V. This confirms energy conservation in the loop.`,
        concept: `The voltage drop across each resistor is proportional to its resistance value. Larger resistors "consume" more of the available voltage.`,
        realWorld: "KVL is essential for analyzing power distribution networks and designing voltage regulators.",
        icon: <Atom className="h-5 w-5 text-blue-500" />
      };
    }
    
    case 'diode-characteristics': {
      const V = params['voltage'] || 0;
      const T = params['temperature'] || 25;
      const I = results.current || 0;
      
      let explanation = '';
      if (V < 0) {
        explanation = `At ${V}V (reverse bias), the diode blocks current flow. Only a tiny leakage current (~nA) exists due to minority carriers.`;
      } else if (V < 0.6) {
        explanation = `At ${V}V, the diode is in the "knee" region. Current is small (${I.toFixed(4)}mA) as the junction barrier isn't fully overcome.`;
      } else {
        explanation = `At ${V}V (forward bias), the junction barrier is overcome. Current (${I.toFixed(2)}mA) increases exponentially with voltage.`;
      }
      
      const tempEffect = T > 30 
        ? `At ${T}°C, the thermal voltage increases, causing a slight leftward shift in the V-I curve.`
        : `At ${T}°C, the diode operates near room temperature with standard characteristics.`;
      
      return {
        title: "PN Junction Physics",
        explanation,
        concept: `${tempEffect} The exponential relationship I = Is(e^(V/Vt) - 1) is fundamental to semiconductor physics.`,
        realWorld: "Diode characteristics are crucial for rectifier design, signal clipping, and temperature sensors.",
        icon: <Atom className="h-5 w-5 text-purple-500" />
      };
    }
    
    case 'transistor-ce': {
      const Vbe = params['vbe'] || 0;
      const Vce = params['vce'] || 0;
      const Ib = results.ib || 0;
      const Ic = results.ic || 0;
      
      let region = 'cutoff';
      if (Vbe > 0.6 && Vce > 0.3) region = 'active';
      else if (Vbe > 0.6 && Vce <= 0.3) region = 'saturation';
      
      const explanations: Record<string, string> = {
        cutoff: `With VBE=${Vbe}V below 0.6V, the transistor is in cutoff. No significant current flows (IB≈0, IC≈0).`,
        active: `With VBE=${Vbe}V and VCE=${Vce}V, the transistor is in active region. IC (${Ic.toFixed(2)}mA) = β × IB (${Ib.toFixed(4)}mA). This is the amplification zone.`,
        saturation: `With VCE=${Vce}V < 0.3V, the transistor is saturated. IC is limited regardless of IB. Used for switching.`
      };
      
      return {
        title: "Transistor Operating Regions",
        explanation: explanations[region],
        concept: `Current gain β ≈ 100 means small base current changes cause large collector current changes. This is the basis of amplification.`,
        realWorld: "CE configuration is used in audio amplifiers, signal processing, and logic gates.",
        icon: <Zap className="h-5 w-5 text-green-500" />
      };
    }
    
    case 'zener-regulator': {
      const Vin = params['vin'] || 9;
      const Vout = results.vout || 0;
      const Iz = results.iz || 0;
      
      const regulating = Vin > 5.1;
      
      return {
        title: "Zener Regulation Analysis",
        explanation: regulating 
          ? `Input voltage ${Vin}V exceeds Zener breakdown (5.1V). The Zener maintains constant ${Vout.toFixed(2)}V output by absorbing excess voltage across Rs.`
          : `Input ${Vin}V is below Zener voltage. No regulation occurs - the Zener acts as an open circuit.`,
        concept: `Zener current IZ=${Iz.toFixed(2)}mA flows in reverse breakdown. The diode clamps voltage while varying current handles load changes.`,
        realWorld: "Zener regulators protect sensitive circuits from voltage spikes and provide reference voltages.",
        icon: <Zap className="h-5 w-5 text-orange-500" />
      };
    }
    
    case 'rectifier-half': {
      const Vm = params['vm'] || 12;
      const Vdc = results.vdc || 0;
      const ripple = results.ripple || 0;
      
      return {
        title: "Half-Wave Rectification",
        explanation: `Peak AC voltage of ${Vm}V produces DC output of ${Vdc.toFixed(2)}V (Vdc = Vm/π). Only positive half-cycles pass through the diode.`,
        concept: `Ripple factor ${ripple.toFixed(2)} indicates output purity. Lower values (with larger capacitors) mean smoother DC.`,
        realWorld: "Used in simple power supplies, battery chargers, and signal detection circuits.",
        icon: <Zap className="h-5 w-5 text-red-500" />
      };
    }
    
    case 'tensile-test': {
      const force = params['force'] || 0;
      const stress = results.stress || 0;
      const strain = results.strain || 0;
      
      let phase = 'elastic';
      if (stress > 350) phase = 'plastic';
      if (stress > 500) phase = 'necking';
      
      const phaseExplanations: Record<string, string> = {
        elastic: `At stress ${stress.toFixed(1)} MPa (strain ${strain.toFixed(3)}%), the material is in the elastic region. Remove the load and it returns to original shape.`,
        plastic: `At stress ${stress.toFixed(1)} MPa, permanent deformation begins. The material won't fully recover its original dimensions.`,
        necking: `At stress ${stress.toFixed(1)} MPa, necking may occur - localized thinning before fracture. Material is near failure.`
      };
      
      return {
        title: "Stress-Strain Analysis",
        explanation: phaseExplanations[phase],
        concept: `Young's Modulus E = σ/ε ≈ 200 GPa for steel. This constant slope in the elastic region defines material stiffness.`,
        realWorld: "Understanding material limits is crucial for structural engineering, aerospace design, and manufacturing.",
        icon: <FlaskConical className="h-5 w-5 text-gray-500" />
      };
    }
    
    case 'bernoulli-theorem': {
      const Q = params['flow-rate'] || 15;
      const v1 = results.v1 || 0;
      const v2 = results.v2 || 0;
      const dp = results.pressureDrop || 0;
      
      return {
        title: "Bernoulli's Principle",
        explanation: `At flow rate ${Q} L/min, velocity increases from ${v1.toFixed(2)} m/s to ${v2.toFixed(2)} m/s as area decreases. This causes pressure drop of ${dp.toFixed(2)} kPa.`,
        concept: `P₁ + ½ρv₁² = P₂ + ½ρv₂² (constant head). Faster flow = lower pressure. This is the Venturi effect.`,
        realWorld: "Explains airplane lift, carburetors, atomizers, and blood flow in arteries.",
        icon: <Droplets className="h-5 w-5 text-blue-500" />
      };
    }
    
    case 'reynolds-experiment': {
      const vel = params['velocity'] || 10;
      const Re = results.re || 0;
      const regime = results.regime || 0;
      
      const regimeNames = ['Laminar', 'Transitional', 'Turbulent'];
      const regimeDesc = [
        'Fluid flows in smooth, parallel layers. Dye streams remain distinct.',
        'Flow is unstable, occasionally breaking into turbulence.',
        'Chaotic, irregular motion with rapid mixing. Dye disperses quickly.'
      ];
      
      return {
        title: "Flow Regime Analysis",
        explanation: `At velocity ${vel} cm/s, Reynolds number = ${Re.toFixed(0)}. Flow is ${regimeNames[regime]}.`,
        concept: `${regimeDesc[regime]} Re < 2000 = laminar, Re > 4000 = turbulent.`,
        realWorld: "Critical for pipe design, aircraft aerodynamics, and blood flow analysis.",
        icon: <Droplets className="h-5 w-5 text-cyan-500" />
      };
    }
    
    case 'concrete-mix': {
      const wc = params['wc-ratio'] || 0.45;
      const strength = results.strength || 0;
      
      let quality = 'optimal';
      if (wc < 0.4) quality = 'low-workability';
      else if (wc > 0.55) quality = 'weak';
      
      const qualityExplanations: Record<string, string> = {
        'low-workability': `W/C ratio ${wc} is low. High strength (${strength.toFixed(1)} MPa) but difficult to place and compact.`,
        'optimal': `W/C ratio ${wc} provides good balance. Expected strength ${strength.toFixed(1)} MPa with adequate workability.`,
        'weak': `W/C ratio ${wc} is high. Excess water weakens concrete (${strength.toFixed(1)} MPa) due to increased porosity.`
      };
      
      return {
        title: "Concrete Mix Analysis",
        explanation: qualityExplanations[quality],
        concept: `Abrams' Law: Strength inversely proportional to W/C ratio. Every 0.05 increase reduces strength by ~5-8 MPa.`,
        realWorld: "Proper mix design ensures durability of buildings, bridges, and infrastructure.",
        icon: <Building className="h-5 w-5 text-gray-600" />
      };
    }
    
    case 'leveling': {
      const bs = params['bs'] || 1.5;
      const fs = params['fs'] || 2.0;
      const rl = results.rl || 0;
      const rise = results.rise || 0;
      const fall = results.fall || 0;
      
      return {
        title: "Differential Leveling",
        explanation: `Backsight ${bs}m, Foresight ${fs}m. ${rise > 0 ? `Rise of ${rise.toFixed(3)}m` : `Fall of ${fall.toFixed(3)}m`} gives Reduced Level = ${rl.toFixed(3)}m.`,
        concept: `RL = BM + BS - FS. The height of instrument (HI) method tracks elevation relative to a benchmark.`,
        realWorld: "Essential for construction layout, road design, and drainage planning.",
        icon: <Ruler className="h-5 w-5 text-green-600" />
      };
    }
    
    case 'slump-test': {
      const water = params['water-content'] || 160;
      const slump = results.slump || 0;
      
      let workability = 'low';
      if (slump > 75 && slump < 150) workability = 'medium';
      else if (slump >= 150) workability = 'high';
      
      return {
        title: "Workability Assessment",
        explanation: `Water content ${water} kg/m³ produces ${slump.toFixed(0)}mm slump - ${workability} workability.`,
        concept: `Higher water = higher slump but lower strength. Admixtures improve workability without excess water.`,
        realWorld: "Slump test is the most common field test for fresh concrete consistency.",
        icon: <FlaskConical className="h-5 w-5 text-amber-600" />
      };
    }
    
    default:
      return {
        title: "Experiment Analysis",
        explanation: "Adjust the parameters to see how they affect the results. The relationships follow fundamental physics principles.",
        concept: "Each parameter change demonstrates cause-and-effect relationships governed by the underlying equations.",
        realWorld: "These principles have wide applications across engineering and science.",
        icon: <Lightbulb className="h-5 w-5 text-accent" />
      };
  }
};

export function AIExplanation({
  experimentId,
  experimentName,
  principle,
  currentValues,
  calculatedResults,
  warningCondition,
  warningMessage,
}: AIExplanationProps) {
  
  const dynamicContent = useMemo(() => 
    generateDynamicExplanation(experimentId, currentValues, calculatedResults),
    [experimentId, currentValues, calculatedResults]
  );

  return (
    <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
      <CardHeader className="py-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent animate-pulse" />
          AI-Powered Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Warning Alert */}
        {warningCondition && warningMessage && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/30 animate-pulse">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-destructive">⚠️ Warning Condition Detected</p>
              <p className="text-sm text-muted-foreground mt-1">{warningMessage}</p>
            </div>
          </div>
        )}

        {/* Dynamic Explanation Card */}
        <div className="p-4 rounded-xl bg-card border shadow-sm">
          <div className="flex items-start gap-3">
            {dynamicContent.icon}
            <div className="space-y-2 flex-1">
              <h4 className="font-semibold text-foreground">{dynamicContent.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {dynamicContent.explanation}
              </p>
            </div>
          </div>
        </div>

        {/* Concept Deep Dive */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
          <Lightbulb className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium mb-1">💡 Key Concept</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {dynamicContent.concept}
            </p>
          </div>
        </div>

        {/* Real World Application */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-success/10 border border-success/20">
          <TrendingUp className="h-5 w-5 text-success shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium mb-1">🌍 Real-World Application</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {dynamicContent.realWorld}
            </p>
          </div>
        </div>

        {/* Underlying Principle */}
        <div className="pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Governing Principle:</span> {principle.slice(0, 200)}...
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
