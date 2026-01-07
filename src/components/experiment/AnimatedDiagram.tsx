import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnimatedDiagramProps {
  experimentId: string;
  paramValues: Record<string, number>;
  calculatedResults: Record<string, number>;
}

export function AnimatedDiagram({ experimentId, paramValues, calculatedResults }: AnimatedDiagramProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const renderElectricalAnimation = () => {
    const current = calculatedResults.current || 0;
    const voltage = paramValues.voltage || paramValues['source-voltage'] || 0;
    const flowSpeed = Math.min(current * 200, 10);
    const electronPositions = Array.from({ length: 8 }, (_, i) => 
      ((animationStep * flowSpeed + i * 12.5) % 100)
    );

    return (
      <svg viewBox="0 0 400 250" className="w-full h-auto">
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3" />
          </pattern>
          <linearGradient id="wireGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <rect width="400" height="250" fill="url(#grid)" />
        
        {/* Battery/Source */}
        <g transform="translate(50, 125)">
          <rect x="-25" y="-35" width="50" height="70" rx="5" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2" />
          <line x1="-12" y1="-15" x2="12" y2="-15" stroke="hsl(var(--primary))" strokeWidth="4" />
          <line x1="-6" y1="0" x2="6" y2="0" stroke="hsl(var(--primary))" strokeWidth="4" />
          <line x1="-12" y1="15" x2="12" y2="15" stroke="hsl(var(--primary))" strokeWidth="4" />
          <text x="0" y="50" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="12" fontWeight="bold">
            {voltage.toFixed(1)}V
          </text>
          <text x="0" y="-45" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="10">Source</text>
        </g>

        {/* Top wire with electrons */}
        <path d="M 75 90 L 200 90" stroke="url(#wireGradient)" strokeWidth="4" fill="none" />
        {electronPositions.slice(0, 4).map((pos, i) => (
          <circle
            key={`top-${i}`}
            cx={75 + (pos / 100) * 125}
            cy={90}
            r={4}
            fill="hsl(var(--accent))"
            filter="url(#glow)"
            opacity={0.9}
          >
            <animate attributeName="opacity" values="0.5;1;0.5" dur="0.5s" repeatCount="indefinite" />
          </circle>
        ))}

        {/* Ammeter */}
        <g transform="translate(230, 90)">
          <circle r="25" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
          <circle r="20" fill="none" stroke="hsl(var(--muted))" strokeWidth="1" />
          <text x="0" y="5" textAnchor="middle" fill="hsl(var(--primary))" fontSize="14" fontWeight="bold">A</text>
          <text x="0" y="45" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="11" fontWeight="medium">
            {(current * 1000).toFixed(1)}mA
          </text>
        </g>

        {/* Wire to resistor */}
        <path d="M 255 90 L 320 90" stroke="url(#wireGradient)" strokeWidth="4" fill="none" />
        {electronPositions.slice(4, 6).map((pos, i) => (
          <circle
            key={`mid-${i}`}
            cx={255 + (pos / 100) * 65}
            cy={90}
            r={4}
            fill="hsl(var(--accent))"
            filter="url(#glow)"
            opacity={0.9}
          />
        ))}

        {/* Resistor */}
        <g transform="translate(320, 125)">
          <rect x="-15" y="-35" width="30" height="70" rx="3" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="2" />
          {/* Resistor bands */}
          <rect x="-15" y="-25" width="30" height="8" fill="hsl(var(--destructive))" opacity="0.7" />
          <rect x="-15" y="-5" width="30" height="8" fill="hsl(var(--primary))" opacity="0.7" />
          <rect x="-15" y="15" width="30" height="8" fill="hsl(var(--accent))" opacity="0.7" />
          <text x="0" y="55" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="11" fontWeight="medium">
            {(paramValues.resistance || paramValues.r1 || 100)}Ω
          </text>
        </g>

        {/* Right side wire down */}
        <path d="M 350 90 L 350 160" stroke="url(#wireGradient)" strokeWidth="4" fill="none" />
        
        {/* Bottom wire */}
        <path d="M 350 160 L 50 160" stroke="url(#wireGradient)" strokeWidth="4" fill="none" />
        {electronPositions.map((pos, i) => (
          <circle
            key={`bottom-${i}`}
            cx={350 - (pos / 100) * 300}
            cy={160}
            r={4}
            fill="hsl(var(--accent))"
            filter="url(#glow)"
            opacity={0.9}
          />
        ))}

        {/* Left side wire up */}
        <path d="M 50 160 L 50 140" stroke="url(#wireGradient)" strokeWidth="4" fill="none" />

        {/* Current flow direction indicator */}
        <g transform="translate(200, 75)">
          <path d="M -15 0 L 15 0 M 8 -6 L 15 0 L 8 6" fill="none" stroke="hsl(var(--accent))" strokeWidth="2" />
          <text x="0" y="-10" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">Current Flow</text>
        </g>

        {/* Power indicator */}
        <g transform="translate(320, 200)">
          <rect x="-50" y="-15" width="100" height="30" rx="5" fill="hsl(var(--card))" stroke="hsl(var(--border))" />
          <text x="0" y="5" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="11">
            Power: {(calculatedResults.power || 0).toFixed(3)}W
          </text>
        </g>
      </svg>
    );
  };

  const renderMechanicalAnimation = () => {
    const force = paramValues.force || 0;
    const stress = calculatedResults.stress || 0;
    const strain = calculatedResults.strain || 0;
    const elongation = Math.min(strain * 2, 30);
    const pulseScale = 1 + Math.sin(animationStep * 0.1) * 0.02;

    return (
      <svg viewBox="0 0 400 250" className="w-full h-auto">
        <defs>
          <linearGradient id="steelGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6b7280" />
            <stop offset="50%" stopColor="#9ca3af" />
            <stop offset="100%" stopColor="#6b7280" />
          </linearGradient>
          <linearGradient id="stressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset={`${Math.min(stress / 400 * 100, 100)}%`} stopColor="hsl(var(--destructive))" />
            <stop offset="100%" stopColor="hsl(var(--destructive))" />
          </linearGradient>
        </defs>

        {/* UTM Machine Frame */}
        <rect x="50" y="30" width="300" height="190" rx="5" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
        <text x="200" y="20" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="11">Universal Testing Machine</text>

        {/* Top grip */}
        <rect x="160" y="50" width="80" height="30" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="2" />
        <polygon points="175,80 185,95 215,95 225,80" fill="hsl(var(--muted))" stroke="hsl(var(--border))" />

        {/* Specimen with elongation */}
        <rect 
          x="185" 
          y="95" 
          width="30" 
          height={60 + elongation}
          fill="url(#steelGradient)" 
          stroke="hsl(var(--border))" 
          strokeWidth="1"
          style={{ transform: `scaleY(${pulseScale})`, transformOrigin: 'center' }}
        />
        
        {/* Stress visualization on specimen */}
        <rect 
          x="185" 
          y="95" 
          width="30" 
          height={60 + elongation}
          fill="url(#stressGradient)" 
          opacity="0.3"
        />

        {/* Bottom grip */}
        <polygon points="175,{155 + elongation} 185,{170 + elongation} 215,{170 + elongation} 225,{155 + elongation}" fill="hsl(var(--muted))" stroke="hsl(var(--border))" />
        <rect x="160" y={170 + elongation} width="80" height="30" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="2" />

        {/* Force arrows */}
        <g>
          <line x1="200" y1="35" x2="200" y2="50" stroke="hsl(var(--primary))" strokeWidth="3" markerEnd="url(#arrowhead)" />
          <text x="200" y="28" textAnchor="middle" fill="hsl(var(--primary))" fontSize="10">↓ Fixed</text>
        </g>
        <g>
          <line x1="200" y1={200 + elongation} x2="200" y2={215 + elongation} stroke="hsl(var(--destructive))" strokeWidth="3" />
          <text x="200" y={228 + elongation} textAnchor="middle" fill="hsl(var(--destructive))" fontSize="10" fontWeight="bold">
            ↓ {force} kN
          </text>
        </g>

        {/* Readings panel */}
        <g transform="translate(360, 80)">
          <rect x="0" y="0" width="35" height="100" rx="3" fill="hsl(var(--card))" stroke="hsl(var(--border))" />
          <text x="17" y="20" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">Stress</text>
          <text x="17" y="35" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontWeight="bold">
            {stress.toFixed(1)}
          </text>
          <text x="17" y="47" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">MPa</text>
          <line x1="5" y1="55" x2="30" y2="55" stroke="hsl(var(--border))" />
          <text x="17" y="70" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">Strain</text>
          <text x="17" y="85" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontWeight="bold">
            {strain.toFixed(4)}
          </text>
          <text x="17" y="97" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">%</text>
        </g>
      </svg>
    );
  };

  const renderFluidAnimation = () => {
    const flowRate = paramValues['flow-rate'] || 15;
    const inletArea = paramValues['inlet-area'] || 5;
    const outletArea = paramValues['outlet-area'] || 3;
    const flowSpeed = flowRate / 10;
    
    const particles = Array.from({ length: 20 }, (_, i) => ({
      x: ((animationStep * flowSpeed + i * 5) % 100),
      y: 125 + Math.sin((animationStep + i * 10) * 0.1) * 10,
    }));

    return (
      <svg viewBox="0 0 400 250" className="w-full h-auto">
        <defs>
          <linearGradient id="pipeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--muted))" />
            <stop offset="50%" stopColor="hsl(var(--card))" />
            <stop offset="100%" stopColor="hsl(var(--muted))" />
          </linearGradient>
          <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(185, 70%, 50%)" />
            <stop offset="100%" stopColor="hsl(200, 70%, 40%)" />
          </linearGradient>
        </defs>

        {/* Title */}
        <text x="200" y="25" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="14" fontWeight="bold">
          Bernoulli's Apparatus
        </text>

        {/* Inlet pipe (wider) */}
        <rect x="30" y={105 - inletArea * 3} width="100" height={inletArea * 6} fill="url(#pipeGradient)" stroke="hsl(var(--border))" strokeWidth="2" rx="3" />
        
        {/* Converging section */}
        <polygon 
          points={`130,${105 - inletArea * 3} 180,${105 - outletArea * 3} 180,${145 + outletArea * 3} 130,${145 + inletArea * 3}`}
          fill="url(#pipeGradient)" 
          stroke="hsl(var(--border))" 
          strokeWidth="2"
        />

        {/* Throat (narrow) */}
        <rect x="180" y={105 - outletArea * 3} width="60" height={outletArea * 6} fill="url(#pipeGradient)" stroke="hsl(var(--border))" strokeWidth="2" rx="3" />

        {/* Diverging section */}
        <polygon 
          points={`240,${105 - outletArea * 3} 290,${105 - inletArea * 3} 290,${145 + inletArea * 3} 240,${145 + outletArea * 3}`}
          fill="url(#pipeGradient)" 
          stroke="hsl(var(--border))" 
          strokeWidth="2"
        />

        {/* Outlet pipe (wider again) */}
        <rect x="290" y={105 - inletArea * 3} width="80" height={inletArea * 6} fill="url(#pipeGradient)" stroke="hsl(var(--border))" strokeWidth="2" rx="3" />

        {/* Water flow particles */}
        {particles.map((p, i) => {
          const x = 30 + (p.x / 100) * 340;
          let y = p.y;
          
          // Adjust Y based on pipe section
          if (x < 130) {
            y = 125 + Math.sin((animationStep + i * 10) * 0.1) * (inletArea * 2);
          } else if (x < 180) {
            const t = (x - 130) / 50;
            const height = inletArea * 3 * (1 - t) + outletArea * 3 * t;
            y = 125 + Math.sin((animationStep + i * 10) * 0.1) * height * 0.6;
          } else if (x < 240) {
            y = 125 + Math.sin((animationStep + i * 10) * 0.1) * (outletArea * 1.5);
          } else if (x < 290) {
            const t = (x - 240) / 50;
            const height = outletArea * 3 * (1 - t) + inletArea * 3 * t;
            y = 125 + Math.sin((animationStep + i * 10) * 0.1) * height * 0.6;
          } else {
            y = 125 + Math.sin((animationStep + i * 10) * 0.1) * (inletArea * 2);
          }

          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={3}
              fill="url(#waterGradient)"
              opacity={0.8}
            />
          );
        })}

        {/* Piezometer tubes */}
        <g transform="translate(80, 50)">
          <rect x="-5" y="0" width="10" height={60 - flowRate} fill="hsl(185, 70%, 50%)" opacity="0.5" />
          <rect x="-5" y={-10} width="10" height={70 - flowRate + 10} stroke="hsl(var(--border))" fill="none" strokeWidth="1" />
          <text x="0" y="-15" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">P₁</text>
        </g>
        <g transform="translate(210, 50)">
          <rect x="-5" y="0" width="10" height={40 - flowRate * 0.5} fill="hsl(185, 70%, 50%)" opacity="0.5" />
          <rect x="-5" y={-10} width="10" height={50 - flowRate * 0.5 + 10} stroke="hsl(var(--border))" fill="none" strokeWidth="1" />
          <text x="0" y="-15" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">P₂</text>
        </g>
        <g transform="translate(320, 50)">
          <rect x="-5" y="0" width="10" height={55 - flowRate * 0.8} fill="hsl(185, 70%, 50%)" opacity="0.5" />
          <rect x="-5" y={-10} width="10" height={65 - flowRate * 0.8 + 10} stroke="hsl(var(--border))" fill="none" strokeWidth="1" />
          <text x="0" y="-15" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">P₃</text>
        </g>

        {/* Velocity indicators */}
        <g transform="translate(80, 180)">
          <text x="0" y="0" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10">v₁: Low</text>
          <text x="0" y="15" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">High P</text>
        </g>
        <g transform="translate(210, 180)">
          <text x="0" y="0" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontWeight="bold">v₂: High</text>
          <text x="0" y="15" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">Low P</text>
        </g>
        <g transform="translate(320, 180)">
          <text x="0" y="0" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10">v₃: Low</text>
          <text x="0" y="15" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">P recovers</text>
        </g>

        {/* Flow rate indicator */}
        <rect x="150" y="210" width="100" height="25" rx="5" fill="hsl(var(--card))" stroke="hsl(var(--border))" />
        <text x="200" y="227" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="11">
          Q = {flowRate} L/min
        </text>
      </svg>
    );
  };

  const renderCivilAnimation = () => {
    const baseline = paramValues.baseline || 50;
    const offset1 = paramValues.offset1 || 5;
    const offset2 = paramValues.offset2 || 8;
    const angle = paramValues['chain-angle'] || 90;
    const pulse = Math.sin(animationStep * 0.05) * 2;

    return (
      <svg viewBox="0 0 400 250" className="w-full h-auto">
        <defs>
          <pattern id="groundPattern" patternUnits="userSpaceOnUse" width="20" height="20">
            <rect width="20" height="20" fill="hsl(142, 40%, 90%)" />
            <circle cx="10" cy="10" r="1" fill="hsl(142, 30%, 70%)" />
          </pattern>
        </defs>

        {/* Ground */}
        <rect x="20" y="40" width="360" height="180" fill="url(#groundPattern)" stroke="hsl(var(--border))" rx="5" />

        {/* Title */}
        <text x="200" y="25" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="14" fontWeight="bold">
          Chain Survey Layout
        </text>

        {/* Main baseline */}
        <line 
          x1="50" y1="130" 
          x2={50 + baseline * 3} y2="130" 
          stroke="hsl(var(--primary))" 
          strokeWidth="3"
          strokeDasharray="10 5"
        />
        
        {/* Ranging rods at ends */}
        <g transform="translate(50, 130)">
          <rect x="-4" y="-40" width="8" height="50" fill="hsl(var(--destructive))" />
          <rect x="-4" y="-40" width="8" height="10" fill="white" />
          <rect x="-4" y="-20" width="8" height="10" fill="white" />
          <circle cx="0" cy="0" r="6" fill="hsl(var(--primary))" />
          <text x="0" y="20" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10">A</text>
        </g>
        <g transform={`translate(${50 + baseline * 3}, 130)`}>
          <rect x="-4" y="-40" width="8" height="50" fill="hsl(var(--destructive))" />
          <rect x="-4" y="-40" width="8" height="10" fill="white" />
          <rect x="-4" y="-20" width="8" height="10" fill="white" />
          <circle cx="0" cy="0" r="6" fill="hsl(var(--primary))" />
          <text x="0" y="20" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10">B</text>
        </g>

        {/* Baseline length indicator */}
        <g transform={`translate(${50 + baseline * 1.5}, 150)`}>
          <text x="0" y="0" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="11">
            Baseline: {baseline}m
          </text>
        </g>

        {/* Chain animation */}
        {Array.from({ length: Math.floor(baseline / 5) }, (_, i) => (
          <circle
            key={i}
            cx={50 + i * 15 + pulse}
            cy={130}
            r={3}
            fill="hsl(var(--accent))"
            opacity={0.7}
          />
        ))}

        {/* Offset 1 */}
        <line 
          x1={50 + baseline * 0.4} y1="130" 
          x2={50 + baseline * 0.4} y2={130 - offset1 * 5} 
          stroke="hsl(var(--accent))" 
          strokeWidth="2"
        />
        <circle cx={50 + baseline * 0.4} cy={130 - offset1 * 5} r="5" fill="hsl(var(--accent))" />
        <text x={50 + baseline * 0.4 + 10} y={130 - offset1 * 2.5} fill="hsl(var(--accent))" fontSize="10">
          {offset1}m
        </text>

        {/* Offset 2 */}
        <line 
          x1={50 + baseline * 0.7} y1="130" 
          x2={50 + baseline * 0.7} y2={130 - offset2 * 5} 
          stroke="hsl(var(--accent))" 
          strokeWidth="2"
        />
        <circle cx={50 + baseline * 0.7} cy={130 - offset2 * 5} r="5" fill="hsl(var(--accent))" />
        <text x={50 + baseline * 0.7 + 10} y={130 - offset2 * 2.5} fill="hsl(var(--accent))" fontSize="10">
          {offset2}m
        </text>

        {/* Triangle formation */}
        <polygon 
          points={`50,130 ${50 + baseline * 3},130 ${50 + baseline * 1.5 + Math.cos(angle * Math.PI / 180) * 40},${130 - Math.sin(angle * Math.PI / 180) * 60}`}
          fill="hsl(var(--primary))"
          opacity="0.1"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          strokeDasharray="5 3"
        />

        {/* Angle indicator */}
        <g transform={`translate(${50 + baseline * 1.5}, 130)`}>
          <path 
            d={`M -20 0 A 20 20 0 0 1 ${-20 * Math.cos(angle * Math.PI / 180)} ${-20 * Math.sin(angle * Math.PI / 180)}`}
            fill="none" 
            stroke="hsl(var(--foreground))" 
            strokeWidth="1"
          />
          <text x="0" y="-50" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10">
            Angle: {angle}°
          </text>
        </g>

        {/* Cross staff */}
        <g transform={`translate(${50 + baseline * 0.55}, 130)`}>
          <rect x="-15" y="-5" width="30" height="10" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" />
          <line x1="0" y1="-15" x2="0" y2="15" stroke="hsl(var(--border))" strokeWidth="2" />
          <text x="0" y="25" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">Cross Staff</text>
        </g>

        {/* Legend */}
        <g transform="translate(300, 200)">
          <rect x="-80" y="-15" width="160" height="40" rx="5" fill="hsl(var(--card))" stroke="hsl(var(--border))" />
          <line x1="-70" y1="0" x2="-50" y2="0" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="5 3" />
          <text x="-45" y="4" fill="hsl(var(--muted-foreground))" fontSize="9">Main Chain</text>
          <line x1="10" y1="0" x2="30" y2="0" stroke="hsl(var(--accent))" strokeWidth="2" />
          <text x="35" y="4" fill="hsl(var(--muted-foreground))" fontSize="9">Offset</text>
        </g>
      </svg>
    );
  };

  const renderConcreteAnimation = () => {
    const cement = paramValues.cement || 350;
    const wcRatio = paramValues['wc-ratio'] || 0.45;
    const faRatio = paramValues['fa-ratio'] || 1.5;
    const caRatio = paramValues['ca-ratio'] || 3;
    const mixPulse = Math.sin(animationStep * 0.15) * 3;

    const total = 1 + faRatio + caRatio;
    const cementAngle = (1 / total) * 360;
    const faAngle = (faRatio / total) * 360;

    return (
      <svg viewBox="0 0 400 250" className="w-full h-auto">
        <defs>
          <pattern id="cementPattern" patternUnits="userSpaceOnUse" width="4" height="4">
            <rect width="4" height="4" fill="hsl(var(--muted))" />
            <rect width="2" height="2" fill="hsl(var(--border))" />
          </pattern>
          <pattern id="sandPattern" patternUnits="userSpaceOnUse" width="3" height="3">
            <circle cx="1.5" cy="1.5" r="1" fill="hsl(45, 70%, 60%)" />
          </pattern>
        </defs>

        {/* Title */}
        <text x="200" y="20" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="14" fontWeight="bold">
          Concrete Mix Design
        </text>

        {/* Mixer drum */}
        <ellipse cx="200" cy="130" rx="100" ry="70" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="3" />
        <ellipse cx="200" cy="130" rx="80" ry="55" fill="hsl(var(--card))" />
        
        {/* Mixing contents */}
        <g style={{ transform: `rotate(${animationStep}deg)`, transformOrigin: '200px 130px' }}>
          {/* Aggregate particles */}
          {Array.from({ length: 15 }, (_, i) => {
            const angle = (i * 24 + animationStep * 2) * Math.PI / 180;
            const r = 30 + (i % 3) * 15;
            return (
              <g key={i}>
                <circle
                  cx={200 + Math.cos(angle) * r + mixPulse}
                  cy={130 + Math.sin(angle) * r * 0.7}
                  r={5 + (i % 3) * 2}
                  fill={i % 2 === 0 ? 'hsl(var(--muted))' : 'hsl(45, 50%, 50%)'}
                  opacity={0.8}
                />
              </g>
            );
          })}
        </g>

        {/* Water drops */}
        {wcRatio > 0.4 && Array.from({ length: 5 }, (_, i) => (
          <circle
            key={i}
            cx={200 + Math.sin(animationStep * 0.1 + i) * 40}
            cy={120 + (animationStep + i * 20) % 40}
            r={3}
            fill="hsl(200, 70%, 60%)"
            opacity={0.6}
          />
        ))}

        {/* Mix ratio pie chart */}
        <g transform="translate(60, 180)">
          <text x="0" y="-50" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="10">Mix Ratio</text>
          <circle cx="0" cy="0" r="35" fill="hsl(var(--muted))" stroke="hsl(var(--border))" />
          {/* Cement sector */}
          <path
            d={`M 0 0 L 0 -35 A 35 35 0 ${cementAngle > 180 ? 1 : 0} 1 ${35 * Math.sin(cementAngle * Math.PI / 180)} ${-35 * Math.cos(cementAngle * Math.PI / 180)} Z`}
            fill="hsl(var(--primary))"
          />
          {/* FA sector */}
          <path
            d={`M 0 0 L ${35 * Math.sin(cementAngle * Math.PI / 180)} ${-35 * Math.cos(cementAngle * Math.PI / 180)} A 35 35 0 ${faAngle > 180 ? 1 : 0} 1 ${35 * Math.sin((cementAngle + faAngle) * Math.PI / 180)} ${-35 * Math.cos((cementAngle + faAngle) * Math.PI / 180)} Z`}
            fill="hsl(45, 70%, 50%)"
          />
          <text x="0" y="55" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="9">1:{faRatio}:{caRatio}</text>
        </g>

        {/* W/C Ratio indicator */}
        <g transform="translate(340, 100)">
          <rect x="-30" y="-40" width="60" height="80" rx="5" fill="hsl(var(--card))" stroke="hsl(var(--border))" />
          <text x="0" y="-25" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="10">W/C</text>
          <rect x="-15" y="-15" width="30" height="50" fill="hsl(var(--muted))" rx="3" />
          <rect x="-15" y={35 - wcRatio * 80} width="30" height={wcRatio * 80} fill="hsl(200, 70%, 60%)" rx="3" />
          <text x="0" y="50" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="11" fontWeight="bold">
            {wcRatio.toFixed(2)}
          </text>
        </g>

        {/* Cement content */}
        <g transform="translate(340, 200)">
          <rect x="-40" y="-15" width="80" height="35" rx="5" fill="hsl(var(--card))" stroke="hsl(var(--border))" />
          <text x="0" y="0" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">Cement</text>
          <text x="0" y="15" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="11" fontWeight="bold">
            {cement} kg/m³
          </text>
        </g>

        {/* Slump indicator */}
        <g transform="translate(60, 80)">
          <polygon points="0,-20 15,20 -15,20" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="2" />
          <polygon 
            points={`0,${-20 + wcRatio * 30} 12,20 -12,20`} 
            fill="hsl(var(--secondary))" 
            stroke="hsl(var(--border))"
          />
          <text x="0" y="35" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">Slump</text>
          <text x="0" y="50" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10">
            {Math.round(wcRatio * 150)}mm
          </text>
        </g>

        {/* Legend */}
        <g transform="translate(200, 230)">
          <circle cx="-80" cy="0" r="5" fill="hsl(var(--primary))" />
          <text x="-70" y="4" fill="hsl(var(--muted-foreground))" fontSize="9">Cement</text>
          <circle cx="-20" cy="0" r="5" fill="hsl(45, 70%, 50%)" />
          <text x="-10" y="4" fill="hsl(var(--muted-foreground))" fontSize="9">Sand</text>
          <circle cx="40" cy="0" r="5" fill="hsl(var(--muted))" />
          <text x="50" y="4" fill="hsl(var(--muted-foreground))" fontSize="9">Aggregate</text>
        </g>
      </svg>
    );
  };

  const renderDiagram = () => {
    // Electrical experiments
    if (['ohms-law', 'kvl-verification', 'series-parallel', 'kcl-verification', 'power-measurement', 'superposition-theorem'].includes(experimentId)) {
      return renderElectricalAnimation();
    }
    // Electronics experiments
    if (['transistor-ce', 'diode-characteristics', 'zener-regulator', 'rectifier-half', 'ce-amplifier'].includes(experimentId)) {
      return renderElectricalAnimation();
    }
    // Mechanical experiments
    if (['tensile-test', 'hardness-test', 'impact-test', 'compression-test'].includes(experimentId)) {
      return renderMechanicalAnimation();
    }
    // Fluid mechanics experiments
    if (['bernoulli-theorem', 'reynolds-experiment', 'venturi-meter', 'pipe-friction'].includes(experimentId)) {
      return renderFluidAnimation();
    }
    // Civil surveying experiments
    if (['chain-survey', 'compass-survey', 'leveling', 'plane-table'].includes(experimentId)) {
      return renderCivilAnimation();
    }
    // Concrete experiments
    if (['concrete-mix', 'slump-test', 'aggregate-grading', 'cube-strength'].includes(experimentId)) {
      return renderConcreteAnimation();
    }
    
    return renderElectricalAnimation();
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="py-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Interactive Visualization</CardTitle>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setAnimationStep(0)}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="bg-gradient-to-br from-background to-muted/30 rounded-lg p-2">
          {renderDiagram()}
        </div>
      </CardContent>
    </Card>
  );
}
