import { DepartmentInfo, Lab, Experiment } from '@/types';

export const departments: DepartmentInfo[] = [
  {
    id: 'electrical',
    name: 'EEE',
    fullName: 'Electrical & Electronics Engineering',
    color: 'dept-electrical',
    icon: '⚡',
    labs: [
      {
        id: 'beee-lab',
        name: 'BEEE Lab',
        department: 'electrical',
        description: 'Basic Electrical & Electronics Engineering Laboratory covering fundamental circuits, network laws, and electrical measurements.',
        experimentCount: 8,
      },
    ],
  },
  {
    id: 'electronics',
    name: 'ECE',
    fullName: 'Electronics & Communication Engineering',
    color: 'dept-electronics',
    icon: '📡',
    labs: [
      {
        id: 'ap-lab',
        name: 'Analog Electronics Lab',
        department: 'electronics',
        description: 'Analog and pulse circuits, transistor characteristics, amplifier designs.',
        experimentCount: 6,
      },
    ],
  },
  {
    id: 'mechanical',
    name: 'MECH',
    fullName: 'Mechanical Engineering',
    color: 'dept-mechanical',
    icon: '⚙️',
    labs: [
      {
        id: 'mt-lab',
        name: 'Material Testing Lab',
        department: 'mechanical',
        description: 'Material properties testing including tensile, compression, hardness, and impact tests.',
        experimentCount: 7,
      },
      {
        id: 'fm-hm-lab',
        name: 'Fluid Mechanics & Hydraulics Lab',
        department: 'mechanical',
        description: 'Fluid flow measurements, hydraulic machines, and pressure analysis.',
        experimentCount: 6,
      },
    ],
  },
  {
    id: 'civil',
    name: 'CIVIL',
    fullName: 'Civil Engineering',
    color: 'dept-civil',
    icon: '🏗️',
    labs: [
      {
        id: 'survey-lab',
        name: 'Surveying Lab',
        department: 'civil',
        description: 'Chain surveying, compass surveying, leveling, and theodolite operations.',
        experimentCount: 8,
      },
      {
        id: 'ct-lab',
        name: 'Concrete Technology Lab',
        department: 'civil',
        description: 'Concrete mix design, aggregate testing, and strength analysis.',
        experimentCount: 5,
      },
    ],
  },
];

export const experiments: Record<string, Experiment[]> = {
  'beee-lab': [
    {
      id: 'ohms-law',
      labId: 'beee-lab',
      name: "Verification of Ohm's Law",
      aim: "To verify Ohm's law and understand the linear relationship between voltage and current in a resistive circuit.",
      apparatus: ['DC Power Supply (0-30V)', 'Digital Ammeter', 'Digital Voltmeter', 'Resistors (100Ω, 220Ω, 470Ω)', 'Connecting wires', 'Breadboard'],
      principle: "Ohm's Law states that the current flowing through a conductor is directly proportional to the voltage across it, provided the temperature remains constant. Mathematically: V = I × R",
      formula: 'V = I × R',
      parameters: [
        { id: 'voltage', name: 'Voltage', unit: 'V', min: 0, max: 30, default: 5, step: 0.5 },
        { id: 'resistance', name: 'Resistance', unit: 'Ω', min: 10, max: 1000, default: 100, step: 10 },
      ],
      whatIfScenarios: [
        { id: 'double-voltage', question: 'What if the voltage is doubled?', parameterChanges: [{ parameterId: 'voltage', newValue: 10 }], expectedOutcome: 'Current doubles proportionally (I = V/R). Linear relationship is maintained.' },
        { id: 'increase-resistance', question: 'What if resistance is increased 5x?', parameterChanges: [{ parameterId: 'resistance', newValue: 500 }], expectedOutcome: 'Current decreases to 1/5th. Higher resistance opposes current flow.' },
        { id: 'extreme-voltage', question: 'What if voltage exceeds safe limits?', parameterChanges: [{ parameterId: 'voltage', newValue: 28 }], expectedOutcome: 'Power dissipation (P=V²/R) increases. May cause overheating.' },
        { id: 'very-low-resistance', question: 'What if resistance is very low?', parameterChanges: [{ parameterId: 'resistance', newValue: 10 }], expectedOutcome: 'High current flows. This is a near short-circuit condition.' },
      ],
    },
    {
      id: 'kvl-verification',
      labId: 'beee-lab',
      name: "Verification of Kirchhoff's Voltage Law",
      aim: "To verify that the algebraic sum of voltages around any closed loop equals zero.",
      apparatus: ['DC Power Supply', 'Resistors (Different values)', 'Digital Voltmeter', 'Connecting wires', 'Breadboard'],
      principle: "Kirchhoff's Voltage Law (KVL) states that the sum of all voltages around a closed loop equals zero: ΣV = 0. This follows from conservation of energy.",
      formula: 'Vs = V₁ + V₂ + V₃ (Source = Sum of drops)',
      parameters: [
        { id: 'source-voltage', name: 'Source Voltage', unit: 'V', min: 0, max: 24, default: 12, step: 1 },
        { id: 'r1', name: 'R₁', unit: 'Ω', min: 100, max: 1000, default: 200, step: 50 },
        { id: 'r2', name: 'R₂', unit: 'Ω', min: 100, max: 1000, default: 300, step: 50 },
        { id: 'r3', name: 'R₃', unit: 'Ω', min: 100, max: 1000, default: 500, step: 50 },
      ],
      whatIfScenarios: [
        { id: 'unequal-resistors', question: 'What if one resistor dominates?', parameterChanges: [{ parameterId: 'r2', newValue: 800 }], expectedOutcome: 'Most voltage drops across largest resistor. Sum still equals source.' },
        { id: 'equal-resistors', question: 'What if all resistors are equal?', parameterChanges: [{ parameterId: 'r1', newValue: 330 }, { parameterId: 'r2', newValue: 330 }, { parameterId: 'r3', newValue: 330 }], expectedOutcome: 'Voltage divides equally among resistors (4V each for 12V source).' },
        { id: 'high-voltage', question: 'What if source voltage increases?', parameterChanges: [{ parameterId: 'source-voltage', newValue: 20 }], expectedOutcome: 'All voltage drops increase proportionally. Current increases.' },
      ],
    },
    {
      id: 'series-parallel',
      labId: 'beee-lab',
      name: 'Series and Parallel Resistor Networks',
      aim: 'To compare equivalent resistance and current distribution in series vs parallel configurations.',
      apparatus: ['DC Power Supply', 'Resistors (Various values)', 'Digital Multimeter', 'Connecting wires', 'Breadboard'],
      principle: 'Series: Req = R₁ + R₂ (resistances add). Parallel: 1/Req = 1/R₁ + 1/R₂ (equivalent is less than smallest).',
      formula: 'Series: Req = ΣR, Parallel: 1/Req = Σ(1/R)',
      parameters: [
        { id: 'voltage', name: 'Supply Voltage', unit: 'V', min: 0, max: 24, default: 12, step: 1 },
        { id: 'r1', name: 'R₁', unit: 'Ω', min: 100, max: 1000, default: 200, step: 50 },
        { id: 'r2', name: 'R₂', unit: 'Ω', min: 100, max: 1000, default: 300, step: 50 },
        { id: 'config', name: 'Configuration', unit: '', min: 0, max: 1, default: 0, step: 1 },
      ],
      whatIfScenarios: [
        { id: 'series-to-parallel', question: 'What if we switch to parallel?', parameterChanges: [{ parameterId: 'config', newValue: 1 }], expectedOutcome: 'Equivalent resistance drops significantly. Current increases dramatically.' },
        { id: 'equal-resistors-parallel', question: 'What if equal resistors in parallel?', parameterChanges: [{ parameterId: 'r1', newValue: 200 }, { parameterId: 'r2', newValue: 200 }, { parameterId: 'config', newValue: 1 }], expectedOutcome: 'Req = R/2 = 100Ω. Current splits equally between branches.' },
      ],
    },
    {
      id: 'kcl-verification',
      labId: 'beee-lab',
      name: "Verification of Kirchhoff's Current Law",
      aim: "To verify that the algebraic sum of currents at a node equals zero.",
      apparatus: ['DC Power Supply', 'Resistors', 'Digital Ammeter', 'Connecting wires', 'Breadboard'],
      principle: "Kirchhoff's Current Law states that the sum of currents entering a node equals the sum leaving: ΣI_in = ΣI_out",
      formula: 'I_total = I₁ + I₂ + I₃ (at any node)',
      parameters: [
        { id: 'voltage', name: 'Source Voltage', unit: 'V', min: 0, max: 20, default: 10, step: 1 },
        { id: 'r1', name: 'Branch R₁', unit: 'Ω', min: 100, max: 500, default: 200, step: 50 },
        { id: 'r2', name: 'Branch R₂', unit: 'Ω', min: 100, max: 500, default: 300, step: 50 },
        { id: 'r3', name: 'Branch R₃', unit: 'Ω', min: 100, max: 500, default: 400, step: 50 },
      ],
      whatIfScenarios: [
        { id: 'low-r1', question: 'What if R₁ branch has lower resistance?', parameterChanges: [{ parameterId: 'r1', newValue: 100 }], expectedOutcome: 'More current flows through R₁ branch. Total current increases.' },
        { id: 'equal-branches', question: 'What if all branches are equal?', parameterChanges: [{ parameterId: 'r1', newValue: 200 }, { parameterId: 'r2', newValue: 200 }, { parameterId: 'r3', newValue: 200 }], expectedOutcome: 'Current divides equally among all three branches.' },
      ],
    },
    {
      id: 'power-measurement',
      labId: 'beee-lab',
      name: 'Power Measurement in DC Circuits',
      aim: 'To measure and verify power dissipation in resistive circuits using voltage and current.',
      apparatus: ['DC Power Supply', 'Wattmeter', 'Ammeter', 'Voltmeter', 'Load Resistors', 'Rheostat'],
      principle: 'Power is the rate of energy transfer. In DC circuits: P = V × I = I²R = V²/R',
      formula: 'P = V × I = I²R = V²/R',
      parameters: [
        { id: 'voltage', name: 'Applied Voltage', unit: 'V', min: 0, max: 24, default: 12, step: 1 },
        { id: 'resistance', name: 'Load Resistance', unit: 'Ω', min: 10, max: 200, default: 50, step: 10 },
      ],
      whatIfScenarios: [
        { id: 'double-voltage', question: 'What if voltage is doubled?', parameterChanges: [{ parameterId: 'voltage', newValue: 24 }], expectedOutcome: 'Power quadruples (P ∝ V²). Current doubles, heating increases 4x.' },
        { id: 'half-resistance', question: 'What if resistance is halved?', parameterChanges: [{ parameterId: 'resistance', newValue: 25 }], expectedOutcome: 'Power doubles. Current increases, more heat dissipation.' },
        { id: 'power-limit', question: 'What if operating near power limit?', parameterChanges: [{ parameterId: 'voltage', newValue: 20 }, { parameterId: 'resistance', newValue: 20 }], expectedOutcome: 'High power (20W). Requires adequate cooling or higher rated resistor.' },
      ],
    },
    {
      id: 'superposition-theorem',
      labId: 'beee-lab',
      name: 'Verification of Superposition Theorem',
      aim: 'To verify that in a linear circuit with multiple sources, the response equals the sum of individual responses.',
      apparatus: ['Two DC Power Supplies', 'Resistors', 'Digital Multimeter', 'SPDT Switches', 'Breadboard'],
      principle: 'In a linear circuit, the total response is the algebraic sum of responses caused by each independent source acting alone.',
      formula: 'I_total = I₁ (due to V₁) + I₂ (due to V₂)',
      parameters: [
        { id: 'v1', name: 'Source V₁', unit: 'V', min: 0, max: 15, default: 10, step: 1 },
        { id: 'v2', name: 'Source V₂', unit: 'V', min: 0, max: 15, default: 5, step: 1 },
        { id: 'r1', name: 'R₁', unit: 'Ω', min: 100, max: 500, default: 200, step: 50 },
        { id: 'r2', name: 'R₂', unit: 'Ω', min: 100, max: 500, default: 300, step: 50 },
        { id: 'rl', name: 'R_load', unit: 'Ω', min: 100, max: 500, default: 150, step: 50 },
      ],
      whatIfScenarios: [
        { id: 'sources-opposing', question: 'What if sources oppose each other?', parameterChanges: [{ parameterId: 'v1', newValue: 10 }, { parameterId: 'v2', newValue: 10 }], expectedOutcome: 'Currents may partially cancel. Net effect depends on relative magnitudes.' },
        { id: 'one-source-off', question: 'What if V₂ is turned off?', parameterChanges: [{ parameterId: 'v2', newValue: 0 }], expectedOutcome: 'Only V₁ contributes. Current is due to single source through network.' },
      ],
    },
  ],
  'ap-lab': [
    {
      id: 'transistor-ce',
      labId: 'ap-lab',
      name: 'Common Emitter Transistor Characteristics',
      aim: 'To plot input and output characteristics of BJT in Common Emitter configuration.',
      apparatus: ['NPN Transistor (BC107)', 'DC Power Supplies (2)', 'Microammeter', 'Milliammeter', 'Resistors', 'Potentiometers'],
      principle: 'In CE configuration, emitter is common. Input: IB vs VBE curve. Output: IC vs VCE for constant IB. Current gain β = IC/IB.',
      formula: 'β = IC / IB, IC = βIB',
      parameters: [
        { id: 'vbe', name: 'Base-Emitter Voltage', unit: 'V', min: 0, max: 0.8, default: 0.6, step: 0.02 },
        { id: 'vce', name: 'Collector-Emitter Voltage', unit: 'V', min: 0, max: 10, default: 5, step: 0.5 },
        { id: 'rb', name: 'Base Resistance', unit: 'kΩ', min: 10, max: 100, default: 50, step: 5 },
      ],
      whatIfScenarios: [
        { id: 'saturation', question: 'What happens in saturation?', parameterChanges: [{ parameterId: 'vce', newValue: 0.3 }], expectedOutcome: 'VCE < 0.3V: Transistor saturates. IC limited, no longer proportional to IB.' },
        { id: 'cutoff', question: 'What if VBE is below threshold?', parameterChanges: [{ parameterId: 'vbe', newValue: 0.4 }], expectedOutcome: 'VBE < 0.6V: Transistor in cutoff. No base current, IC ≈ 0.' },
        { id: 'active-region', question: 'What if VBE = 0.7V (active)?', parameterChanges: [{ parameterId: 'vbe', newValue: 0.7 }], expectedOutcome: 'Transistor in active region. IC = βIB, linear amplification possible.' },
      ],
    },
    {
      id: 'diode-characteristics',
      labId: 'ap-lab',
      name: 'PN Junction Diode Characteristics',
      aim: 'To plot forward and reverse bias characteristics of a silicon diode.',
      apparatus: ['Silicon Diode (1N4007)', 'DC Power Supply', 'Ammeter', 'Voltmeter', 'Resistors', 'Breadboard'],
      principle: 'A diode allows current in one direction. Forward bias: current flows after threshold (0.7V for Si). Reverse bias: negligible current until breakdown.',
      formula: 'I = Is(e^(V/Vt) - 1)',
      parameters: [
        { id: 'voltage', name: 'Applied Voltage', unit: 'V', min: -10, max: 2, default: 0.5, step: 0.1 },
        { id: 'temperature', name: 'Temperature', unit: '°C', min: 20, max: 80, default: 25, step: 5 },
      ],
      whatIfScenarios: [
        { id: 'forward-bias', question: 'What if voltage exceeds 0.7V?', parameterChanges: [{ parameterId: 'voltage', newValue: 1.0 }], expectedOutcome: 'Diode conducts heavily. Current increases exponentially with voltage.' },
        { id: 'reverse-bias', question: 'What if reverse biased?', parameterChanges: [{ parameterId: 'voltage', newValue: -5 }], expectedOutcome: 'Only tiny reverse saturation current flows (microamps or less).' },
        { id: 'temperature-effect', question: 'What if temperature increases?', parameterChanges: [{ parameterId: 'temperature', newValue: 60 }], expectedOutcome: 'Knee voltage decreases ~2mV/°C. Reverse current increases.' },
      ],
    },
    {
      id: 'zener-regulator',
      labId: 'ap-lab',
      name: 'Zener Diode as Voltage Regulator',
      aim: 'To study Zener diode characteristics and design a voltage regulator circuit.',
      apparatus: ['Zener Diode (5.1V)', 'DC Power Supply', 'Resistors', 'Ammeter', 'Voltmeter'],
      principle: 'Zener diode operates in reverse breakdown region to maintain constant voltage. Used for voltage regulation.',
      formula: 'Vout = Vz, Is = (Vin - Vz)/Rs',
      parameters: [
        { id: 'vin', name: 'Input Voltage', unit: 'V', min: 6, max: 15, default: 9, step: 0.5 },
        { id: 'rs', name: 'Series Resistance', unit: 'Ω', min: 100, max: 500, default: 220, step: 20 },
        { id: 'rl', name: 'Load Resistance', unit: 'Ω', min: 200, max: 2000, default: 1000, step: 100 },
      ],
      whatIfScenarios: [
        { id: 'high-input', question: 'What if input voltage increases?', parameterChanges: [{ parameterId: 'vin', newValue: 12 }], expectedOutcome: 'Output stays at Vz (5.1V). Excess voltage drops across Rs.' },
        { id: 'low-input', question: 'What if input drops below Vz?', parameterChanges: [{ parameterId: 'vin', newValue: 6 }], expectedOutcome: 'Zener stops regulating. Output follows input minus drop.' },
        { id: 'heavy-load', question: 'What if load is heavy?', parameterChanges: [{ parameterId: 'rl', newValue: 200 }], expectedOutcome: 'Load current increases. May exceed Zener current capacity.' },
      ],
    },
    {
      id: 'rectifier-half',
      labId: 'ap-lab',
      name: 'Half-Wave Rectifier',
      aim: 'To study half-wave rectifier and calculate ripple factor and efficiency.',
      apparatus: ['Transformer', 'Diode', 'Resistor', 'Capacitor', 'Oscilloscope', 'Multimeter'],
      principle: 'Half-wave rectifier converts AC to pulsating DC by allowing only one half-cycle. Efficiency = 40.6%, Ripple factor = 1.21.',
      formula: 'Vdc = Vm/π, Ripple = 1.21',
      parameters: [
        { id: 'vm', name: 'Peak AC Voltage', unit: 'V', min: 5, max: 20, default: 12, step: 1 },
        { id: 'rl', name: 'Load Resistance', unit: 'Ω', min: 100, max: 2000, default: 1000, step: 100 },
        { id: 'capacitor', name: 'Filter Capacitor', unit: 'µF', min: 0, max: 1000, default: 100, step: 50 },
      ],
      whatIfScenarios: [
        { id: 'no-filter', question: 'What if no filter capacitor?', parameterChanges: [{ parameterId: 'capacitor', newValue: 0 }], expectedOutcome: 'Output is pure pulsating DC. High ripple (121%).' },
        { id: 'large-capacitor', question: 'What if large filter capacitor?', parameterChanges: [{ parameterId: 'capacitor', newValue: 1000 }], expectedOutcome: 'Ripple reduces significantly. Approaches smooth DC.' },
        { id: 'light-load', question: 'What if load resistance is high?', parameterChanges: [{ parameterId: 'rl', newValue: 2000 }], expectedOutcome: 'Less current drawn. Better filtering, lower ripple.' },
      ],
    },
    {
      id: 'ce-amplifier',
      labId: 'ap-lab',
      name: 'Common Emitter Amplifier',
      aim: 'To design and analyze a single-stage CE amplifier and measure voltage gain.',
      apparatus: ['NPN Transistor', 'Resistors', 'Capacitors', 'DC Supply', 'Signal Generator', 'Oscilloscope'],
      principle: 'CE amplifier provides voltage gain with 180° phase shift. Gain depends on collector and emitter resistors.',
      formula: 'Av = -RC/RE (with bypass), Av = -gm × RC',
      parameters: [
        { id: 'rc', name: 'Collector Resistance', unit: 'kΩ', min: 1, max: 10, default: 2.2, step: 0.1 },
        { id: 're', name: 'Emitter Resistance', unit: 'Ω', min: 100, max: 1000, default: 470, step: 50 },
        { id: 'vin', name: 'Input Signal', unit: 'mV', min: 10, max: 100, default: 20, step: 5 },
        { id: 'bypass', name: 'Bypass Capacitor', unit: '', min: 0, max: 1, default: 1, step: 1 },
      ],
      whatIfScenarios: [
        { id: 'increase-rc', question: 'What if RC is increased?', parameterChanges: [{ parameterId: 'rc', newValue: 4.7 }], expectedOutcome: 'Voltage gain increases. Output swing may be limited.' },
        { id: 'no-bypass', question: 'What if bypass capacitor is removed?', parameterChanges: [{ parameterId: 'bypass', newValue: 0 }], expectedOutcome: 'Gain drops to RC/RE. Better stability but lower gain.' },
        { id: 'high-input', question: 'What if input is too high?', parameterChanges: [{ parameterId: 'vin', newValue: 100 }], expectedOutcome: 'Output may clip. Distortion increases.' },
      ],
    },
  ],
  'mt-lab': [
    {
      id: 'tensile-test',
      labId: 'mt-lab',
      name: 'Tensile Test on Mild Steel',
      aim: 'To determine tensile strength, yield strength, and percentage elongation of mild steel.',
      apparatus: ['Universal Testing Machine', 'Mild Steel Specimen', 'Vernier Caliper', 'Steel Scale', 'Extensometer'],
      principle: 'Tensile test reveals material properties through stress-strain relationship: elastic limit, yield point, ultimate strength, fracture point.',
      formula: 'σ = F/A, ε = ΔL/L₀, E = σ/ε',
      parameters: [
        { id: 'force', name: 'Applied Force', unit: 'kN', min: 0, max: 100, default: 10, step: 5 },
        { id: 'diameter', name: 'Specimen Diameter', unit: 'mm', min: 8, max: 16, default: 12, step: 1 },
        { id: 'gauge-length', name: 'Gauge Length', unit: 'mm', min: 40, max: 60, default: 50, step: 5 },
      ],
      whatIfScenarios: [
        { id: 'smaller-diameter', question: 'What if diameter is smaller?', parameterChanges: [{ parameterId: 'diameter', newValue: 8 }], expectedOutcome: 'Cross-section decreases. Stress increases. Specimen fails at lower force.' },
        { id: 'yield-point', question: 'What happens at yield point?', parameterChanges: [{ parameterId: 'force', newValue: 35 }], expectedOutcome: 'Material yields plastically. Permanent deformation begins.' },
        { id: 'ultimate-strength', question: 'What happens at ultimate load?', parameterChanges: [{ parameterId: 'force', newValue: 55 }], expectedOutcome: 'Necking begins. Cross-section reduces locally. Fracture imminent.' },
      ],
    },
    {
      id: 'hardness-test',
      labId: 'mt-lab',
      name: 'Brinell and Rockwell Hardness Test',
      aim: 'To determine hardness of materials using Brinell and Rockwell methods.',
      apparatus: ['Hardness Testing Machine', 'Steel Ball Indenter', 'Diamond Cone', 'Test Specimens', 'Measuring Microscope'],
      principle: 'Hardness is resistance to indentation. Brinell uses steel ball, measures impression diameter. Rockwell measures depth directly.',
      formula: 'BHN = 2P/(πD(D-√(D²-d²)))',
      parameters: [
        { id: 'load', name: 'Applied Load', unit: 'kgf', min: 100, max: 3000, default: 500, step: 100 },
        { id: 'ball-diameter', name: 'Ball Diameter', unit: 'mm', min: 2.5, max: 10, default: 10, step: 2.5 },
        { id: 'impression', name: 'Impression Diameter', unit: 'mm', min: 2, max: 6, default: 3.5, step: 0.1 },
      ],
      whatIfScenarios: [
        { id: 'higher-load', question: 'What if load is increased?', parameterChanges: [{ parameterId: 'load', newValue: 1500 }], expectedOutcome: 'Larger impression. Used for softer materials or more accurate reading.' },
        { id: 'harder-material', question: 'What if material is harder?', parameterChanges: [{ parameterId: 'impression', newValue: 2.5 }], expectedOutcome: 'Smaller impression indicates higher hardness number.' },
        { id: 'smaller-ball', question: 'What if smaller ball is used?', parameterChanges: [{ parameterId: 'ball-diameter', newValue: 5 }], expectedOutcome: 'More localized test. Better for thin specimens.' },
      ],
    },
    {
      id: 'impact-test',
      labId: 'mt-lab',
      name: 'Charpy Impact Test',
      aim: 'To determine the impact strength and toughness of materials.',
      apparatus: ['Impact Testing Machine', 'Charpy Specimens', 'Vernier Caliper', 'Temperature Bath'],
      principle: 'Impact test measures energy absorbed during fracture. Indicates material toughness and brittleness transition.',
      formula: 'Energy = mg(h₁ - h₂)',
      parameters: [
        { id: 'pendulum-height', name: 'Initial Height', unit: 'm', min: 0.5, max: 1.5, default: 1.0, step: 0.1 },
        { id: 'final-height', name: 'Final Height', unit: 'm', min: 0.1, max: 1.2, default: 0.4, step: 0.05 },
        { id: 'temperature', name: 'Test Temperature', unit: '°C', min: -40, max: 100, default: 25, step: 5 },
      ],
      whatIfScenarios: [
        { id: 'low-temperature', question: 'What if tested at low temperature?', parameterChanges: [{ parameterId: 'temperature', newValue: -20 }], expectedOutcome: 'Material becomes brittle. Energy absorption decreases significantly.' },
        { id: 'high-energy', question: 'What if material is ductile?', parameterChanges: [{ parameterId: 'final-height', newValue: 0.15 }], expectedOutcome: 'High energy absorbed. Material deforms before fracture.' },
        { id: 'brittle-failure', question: 'What indicates brittle material?', parameterChanges: [{ parameterId: 'final-height', newValue: 0.85 }], expectedOutcome: 'Low energy absorbed. Clean fracture with little deformation.' },
      ],
    },
    {
      id: 'compression-test',
      labId: 'mt-lab',
      name: 'Compression Test on Concrete/Wood',
      aim: 'To determine the compressive strength of concrete cubes or wood specimens.',
      apparatus: ['Compression Testing Machine', 'Concrete Cubes (150mm)', 'Vernier Caliper', 'Scale'],
      principle: 'Compressive strength is maximum stress before crushing. Critical for structural materials.',
      formula: 'σc = P/A (Compressive Stress)',
      parameters: [
        { id: 'load', name: 'Applied Load', unit: 'kN', min: 0, max: 2000, default: 500, step: 50 },
        { id: 'cube-size', name: 'Cube Size', unit: 'mm', min: 100, max: 150, default: 150, step: 50 },
        { id: 'curing-days', name: 'Curing Period', unit: 'days', min: 3, max: 28, default: 28, step: 7 },
      ],
      whatIfScenarios: [
        { id: 'early-testing', question: 'What if tested at 7 days?', parameterChanges: [{ parameterId: 'curing-days', newValue: 7 }], expectedOutcome: 'Strength is ~65% of 28-day strength. Concrete still curing.' },
        { id: 'small-specimen', question: 'What if smaller specimen?', parameterChanges: [{ parameterId: 'cube-size', newValue: 100 }], expectedOutcome: 'Higher apparent strength due to size effect. Correction needed.' },
        { id: 'failure-load', question: 'What happens at failure?', parameterChanges: [{ parameterId: 'load', newValue: 1500 }], expectedOutcome: 'Concrete crushes with characteristic cone fracture pattern.' },
      ],
    },
  ],
  'fm-hm-lab': [
    {
      id: 'bernoulli-theorem',
      labId: 'fm-hm-lab',
      name: "Verification of Bernoulli's Theorem",
      aim: "To verify Bernoulli's theorem and understand energy conservation in fluid flow.",
      apparatus: ['Bernoulli\'s apparatus', 'Hydraulic bench', 'Stopwatch', 'Measuring cylinder', 'Piezometer tubes'],
      principle: "Total mechanical energy remains constant: P/ρg + v²/2g + z = constant. Pressure head + velocity head + elevation = constant.",
      formula: 'P₁/ρg + v₁²/2g + z₁ = P₂/ρg + v₂²/2g + z₂',
      parameters: [
        { id: 'flow-rate', name: 'Flow Rate', unit: 'L/min', min: 5, max: 30, default: 15, step: 1 },
        { id: 'inlet-area', name: 'Inlet Area', unit: 'cm²', min: 2, max: 10, default: 5, step: 0.5 },
        { id: 'outlet-area', name: 'Outlet Area', unit: 'cm²', min: 1, max: 8, default: 3, step: 0.5 },
      ],
      whatIfScenarios: [
        { id: 'constriction', question: 'What if pipe narrows?', parameterChanges: [{ parameterId: 'outlet-area', newValue: 1.5 }], expectedOutcome: 'Velocity increases, pressure decreases (Venturi effect).' },
        { id: 'high-flow', question: 'What if flow rate increases?', parameterChanges: [{ parameterId: 'flow-rate', newValue: 25 }], expectedOutcome: 'All velocities increase proportionally. Pressure differences increase.' },
        { id: 'expansion', question: 'What if pipe expands?', parameterChanges: [{ parameterId: 'outlet-area', newValue: 7 }], expectedOutcome: 'Velocity decreases, pressure recovers (diffuser effect).' },
      ],
    },
    {
      id: 'reynolds-experiment',
      labId: 'fm-hm-lab',
      name: "Reynolds Number Experiment",
      aim: 'To observe laminar and turbulent flow and determine critical Reynolds number.',
      apparatus: ['Reynolds apparatus', 'Dye tank', 'Measuring cylinder', 'Stopwatch', 'Thermometer'],
      principle: 'Reynolds number Re = ρvD/μ indicates flow regime. Re < 2000: laminar, Re > 4000: turbulent.',
      formula: 'Re = ρvD/μ = vD/ν',
      parameters: [
        { id: 'velocity', name: 'Flow Velocity', unit: 'cm/s', min: 1, max: 50, default: 10, step: 2 },
        { id: 'diameter', name: 'Pipe Diameter', unit: 'mm', min: 10, max: 50, default: 25, step: 5 },
        { id: 'viscosity', name: 'Kinematic Viscosity', unit: 'mm²/s', min: 0.5, max: 2, default: 1, step: 0.1 },
      ],
      whatIfScenarios: [
        { id: 'high-velocity', question: 'What if velocity is high?', parameterChanges: [{ parameterId: 'velocity', newValue: 40 }], expectedOutcome: 'Re exceeds 4000. Flow becomes turbulent, dye disperses.' },
        { id: 'low-velocity', question: 'What if velocity is very low?', parameterChanges: [{ parameterId: 'velocity', newValue: 5 }], expectedOutcome: 'Re below 2000. Flow remains laminar, dye streak is clear.' },
        { id: 'high-viscosity', question: 'What if fluid is more viscous?', parameterChanges: [{ parameterId: 'viscosity', newValue: 1.5 }], expectedOutcome: 'Re decreases. Flow tends toward laminar regime.' },
      ],
    },
    {
      id: 'venturi-meter',
      labId: 'fm-hm-lab',
      name: 'Venturi Meter Calibration',
      aim: 'To calibrate a venturi meter and determine coefficient of discharge.',
      apparatus: ['Venturi meter', 'Manometer', 'Measuring tank', 'Stopwatch', 'Hydraulic bench'],
      principle: 'Venturi meter measures flow using pressure difference. Cd accounts for losses.',
      formula: 'Q = Cd × A₂ × √(2gh/(1-(A₂/A₁)²))',
      parameters: [
        { id: 'head-diff', name: 'Head Difference', unit: 'cm', min: 5, max: 50, default: 20, step: 2 },
        { id: 'inlet-dia', name: 'Inlet Diameter', unit: 'mm', min: 25, max: 50, default: 40, step: 5 },
        { id: 'throat-dia', name: 'Throat Diameter', unit: 'mm', min: 10, max: 30, default: 20, step: 2 },
      ],
      whatIfScenarios: [
        { id: 'large-head', question: 'What if head difference is larger?', parameterChanges: [{ parameterId: 'head-diff', newValue: 40 }], expectedOutcome: 'Higher flow rate indicated. Velocity at throat increases.' },
        { id: 'small-throat', question: 'What if throat is smaller?', parameterChanges: [{ parameterId: 'throat-dia', newValue: 15 }], expectedOutcome: 'Higher sensitivity but greater pressure drop. May cause cavitation.' },
        { id: 'gradual-change', question: 'What if throat is larger?', parameterChanges: [{ parameterId: 'throat-dia', newValue: 28 }], expectedOutcome: 'Lower sensitivity but reduced energy losses.' },
      ],
    },
    {
      id: 'pipe-friction',
      labId: 'fm-hm-lab',
      name: 'Friction Factor in Pipes',
      aim: 'To determine friction factor for different flow conditions in pipes.',
      apparatus: ['Pipe flow apparatus', 'Manometer', 'Flow meter', 'Pipes (smooth/rough)'],
      principle: 'Head loss due to friction: hf = fLv²/(2gD). Friction factor depends on Re and roughness.',
      formula: 'hf = fLv²/(2gD) (Darcy-Weisbach)',
      parameters: [
        { id: 'velocity', name: 'Flow Velocity', unit: 'm/s', min: 0.5, max: 5, default: 2, step: 0.25 },
        { id: 'pipe-length', name: 'Pipe Length', unit: 'm', min: 1, max: 10, default: 5, step: 0.5 },
        { id: 'pipe-dia', name: 'Pipe Diameter', unit: 'mm', min: 15, max: 50, default: 25, step: 5 },
        { id: 'roughness', name: 'Roughness (ε)', unit: 'mm', min: 0, max: 0.5, default: 0.05, step: 0.01 },
      ],
      whatIfScenarios: [
        { id: 'rough-pipe', question: 'What if pipe is rough?', parameterChanges: [{ parameterId: 'roughness', newValue: 0.3 }], expectedOutcome: 'Higher friction factor. Greater head loss for same velocity.' },
        { id: 'long-pipe', question: 'What if pipe is longer?', parameterChanges: [{ parameterId: 'pipe-length', newValue: 10 }], expectedOutcome: 'Head loss doubles (proportional to length).' },
        { id: 'high-velocity', question: 'What if velocity is high?', parameterChanges: [{ parameterId: 'velocity', newValue: 4 }], expectedOutcome: 'Head loss quadruples (proportional to v²).' },
      ],
    },
  ],
  'survey-lab': [
    {
      id: 'chain-survey',
      labId: 'survey-lab',
      name: 'Chain Surveying',
      aim: 'To survey a given area using chain and tape and prepare a map.',
      apparatus: ['Chain (20m/30m)', 'Tape', 'Arrows', 'Ranging rods', 'Cross staff', 'Offset rods'],
      principle: 'Chain surveying uses triangulation. Area divided into triangles, distances measured, offsets taken for boundaries.',
      formula: 'Area = √(s(s-a)(s-b)(s-c))',
      parameters: [
        { id: 'baseline', name: 'Baseline Length', unit: 'm', min: 20, max: 100, default: 50, step: 5 },
        { id: 'offset1', name: 'Offset 1', unit: 'm', min: 0, max: 20, default: 5, step: 0.5 },
        { id: 'offset2', name: 'Offset 2', unit: 'm', min: 0, max: 20, default: 8, step: 0.5 },
        { id: 'chain-angle', name: 'Triangle Angle', unit: '°', min: 30, max: 150, default: 90, step: 5 },
      ],
      whatIfScenarios: [
        { id: 'ill-conditioned', question: 'What if angle is acute?', parameterChanges: [{ parameterId: 'chain-angle', newValue: 35 }], expectedOutcome: 'Ill-conditioned triangle. Plotting errors amplified.' },
        { id: 'large-offset', question: 'What if offset is too large?', parameterChanges: [{ parameterId: 'offset1', newValue: 18 }], expectedOutcome: 'Offset limit exceeded. Need intermediate points.' },
        { id: 'optimal-angle', question: 'What if angle is 60°?', parameterChanges: [{ parameterId: 'chain-angle', newValue: 60 }], expectedOutcome: 'Well-conditioned triangle. Accurate area calculation.' },
      ],
    },
    {
      id: 'compass-survey',
      labId: 'survey-lab',
      name: 'Compass Traversing',
      aim: 'To conduct a closed traverse using prismatic compass and calculate closing error.',
      apparatus: ['Prismatic Compass', 'Tripod', 'Chain', 'Ranging rods', 'Field book'],
      principle: 'Compass measures bearings. Closed traverse: sum of interior angles = (2n-4)×90°. Closing error indicates accuracy.',
      formula: 'Error = √((ΣL)² + (ΣD)²)',
      parameters: [
        { id: 'sides', name: 'Number of Sides', unit: '', min: 3, max: 8, default: 4, step: 1 },
        { id: 'bearing1', name: 'Initial Bearing', unit: '°', min: 0, max: 360, default: 45, step: 5 },
        { id: 'length1', name: 'Side Length', unit: 'm', min: 20, max: 100, default: 50, step: 5 },
        { id: 'local-attraction', name: 'Local Attraction', unit: '°', min: 0, max: 5, default: 0, step: 0.5 },
      ],
      whatIfScenarios: [
        { id: 'local-attraction', question: 'What if local attraction exists?', parameterChanges: [{ parameterId: 'local-attraction', newValue: 3 }], expectedOutcome: 'Bearings affected at certain stations. Corrections needed.' },
        { id: 'more-sides', question: 'What if traverse has more sides?', parameterChanges: [{ parameterId: 'sides', newValue: 6 }], expectedOutcome: 'More measurements. Error accumulation possible.' },
        { id: 'longer-sides', question: 'What if sides are longer?', parameterChanges: [{ parameterId: 'length1', newValue: 80 }], expectedOutcome: 'Angular errors have larger linear effect. Careful ranging needed.' },
      ],
    },
    {
      id: 'leveling',
      labId: 'survey-lab',
      name: 'Differential Leveling',
      aim: 'To determine the difference in elevation between two points using dumpy level.',
      apparatus: ['Dumpy Level', 'Leveling Staff', 'Tripod', 'Measuring Tape', 'Field Book'],
      principle: 'Leveling determines elevation differences. Rise = BS - FS (if positive). Fall = FS - BS (if positive).',
      formula: 'RL = BM + Rise - Fall',
      parameters: [
        { id: 'bs', name: 'Back Sight', unit: 'm', min: 0.5, max: 4, default: 1.5, step: 0.1 },
        { id: 'fs', name: 'Fore Sight', unit: 'm', min: 0.5, max: 4, default: 2.0, step: 0.1 },
        { id: 'distance', name: 'Sight Distance', unit: 'm', min: 10, max: 100, default: 50, step: 5 },
        { id: 'bm', name: 'Benchmark RL', unit: 'm', min: 100, max: 200, default: 100, step: 1 },
      ],
      whatIfScenarios: [
        { id: 'rise', question: 'What if BS > FS?', parameterChanges: [{ parameterId: 'bs', newValue: 2.5 }, { parameterId: 'fs', newValue: 1.2 }], expectedOutcome: 'Rise of 1.3m. Ground rising from instrument position.' },
        { id: 'fall', question: 'What if BS < FS?', parameterChanges: [{ parameterId: 'bs', newValue: 1.0 }, { parameterId: 'fs', newValue: 2.8 }], expectedOutcome: 'Fall of 1.8m. Ground falling from instrument position.' },
        { id: 'long-sight', question: 'What if sight distance is large?', parameterChanges: [{ parameterId: 'distance', newValue: 90 }], expectedOutcome: 'Reading accuracy decreases. Collimation error magnified.' },
      ],
    },
    {
      id: 'plane-table',
      labId: 'survey-lab',
      name: 'Plane Table Surveying',
      aim: 'To prepare a map of given area by plane table surveying methods.',
      apparatus: ['Plane Table', 'Alidade', 'Spirit Level', 'Trough Compass', 'Drawing Sheet', 'Plumb Bob'],
      principle: 'Plane table combines fieldwork and plotting. Methods: radiation, intersection, traversing, resection.',
      formula: 'Scale = Map Distance / Ground Distance',
      parameters: [
        { id: 'scale', name: 'Map Scale', unit: '', min: 100, max: 1000, default: 500, step: 50 },
        { id: 'station-dist', name: 'Station Distance', unit: 'm', min: 20, max: 100, default: 50, step: 10 },
        { id: 'angle', name: 'Ray Angle', unit: '°', min: 10, max: 90, default: 45, step: 5 },
      ],
      whatIfScenarios: [
        { id: 'small-scale', question: 'What if scale is larger (smaller number)?', parameterChanges: [{ parameterId: 'scale', newValue: 200 }], expectedOutcome: 'More detail possible. Larger drawing area needed.' },
        { id: 'poor-intersection', question: 'What if rays are nearly parallel?', parameterChanges: [{ parameterId: 'angle', newValue: 15 }], expectedOutcome: 'Poor intersection. Point location inaccurate.' },
        { id: 'good-intersection', question: 'What if rays are perpendicular?', parameterChanges: [{ parameterId: 'angle', newValue: 90 }], expectedOutcome: 'Ideal intersection. Maximum accuracy in point location.' },
      ],
    },
  ],
  'ct-lab': [
    {
      id: 'concrete-mix',
      labId: 'ct-lab',
      name: 'Concrete Mix Design',
      aim: 'To design a concrete mix for specified strength and workability.',
      apparatus: ['Weighing balance', 'Concrete mixer', 'Slump cone', 'Compaction factor apparatus', 'Cube moulds'],
      principle: 'Mix design proportions cement, aggregates, and water for target strength. W/C ratio is critical.',
      formula: 'W/C ratio, Mix = 1:FA:CA',
      parameters: [
        { id: 'cement', name: 'Cement Content', unit: 'kg/m³', min: 250, max: 450, default: 350, step: 10 },
        { id: 'wc-ratio', name: 'W/C Ratio', unit: '', min: 0.35, max: 0.6, default: 0.45, step: 0.01 },
        { id: 'fa-ratio', name: 'Fine Aggregate Ratio', unit: '', min: 1, max: 3, default: 1.5, step: 0.1 },
        { id: 'ca-ratio', name: 'Coarse Aggregate Ratio', unit: '', min: 2, max: 5, default: 3, step: 0.1 },
      ],
      whatIfScenarios: [
        { id: 'high-wc', question: 'What if W/C ratio is high?', parameterChanges: [{ parameterId: 'wc-ratio', newValue: 0.55 }], expectedOutcome: 'Higher workability but lower strength. Excess water creates voids.' },
        { id: 'low-wc', question: 'What if W/C ratio is low?', parameterChanges: [{ parameterId: 'wc-ratio', newValue: 0.38 }], expectedOutcome: 'Higher strength but poor workability. May need plasticizer.' },
        { id: 'rich-mix', question: 'What if cement content is high?', parameterChanges: [{ parameterId: 'cement', newValue: 420 }], expectedOutcome: 'Richer mix. Higher strength but more expensive and heat.' },
      ],
    },
    {
      id: 'slump-test',
      labId: 'ct-lab',
      name: 'Workability Tests (Slump & Compaction Factor)',
      aim: 'To determine the workability of fresh concrete using slump and compaction factor tests.',
      apparatus: ['Slump cone', 'Tamping rod', 'Base plate', 'Compaction factor apparatus', 'Scale'],
      principle: 'Slump measures consistency. Compaction factor indicates workability more accurately for stiffer mixes.',
      formula: 'Slump = H_cone - H_slumped, CF = W_partial/W_full',
      parameters: [
        { id: 'water-content', name: 'Water Content', unit: 'L/m³', min: 140, max: 200, default: 160, step: 5 },
        { id: 'sand-percent', name: 'Fine Aggregate %', unit: '%', min: 30, max: 50, default: 40, step: 2 },
        { id: 'admixture', name: 'Plasticizer', unit: 'mL/kg', min: 0, max: 5, default: 0, step: 0.5 },
      ],
      whatIfScenarios: [
        { id: 'more-water', question: 'What if more water is added?', parameterChanges: [{ parameterId: 'water-content', newValue: 185 }], expectedOutcome: 'Higher slump (more fluid). Strength decreases, segregation risk.' },
        { id: 'plasticizer', question: 'What if plasticizer is added?', parameterChanges: [{ parameterId: 'admixture', newValue: 3 }], expectedOutcome: 'Better workability without extra water. Strength maintained.' },
        { id: 'more-sand', question: 'What if sand content is high?', parameterChanges: [{ parameterId: 'sand-percent', newValue: 48 }], expectedOutcome: 'More cohesive mix. Higher water demand, better finish.' },
      ],
    },
    {
      id: 'aggregate-grading',
      labId: 'ct-lab',
      name: 'Sieve Analysis of Aggregates',
      aim: 'To determine the particle size distribution and fineness modulus of aggregates.',
      apparatus: ['Set of sieves', 'Weighing balance', 'Sieve shaker', 'Sample splitter'],
      principle: 'Grading affects workability and strength. Fineness Modulus (FM) indicates average size.',
      formula: 'FM = Σ(Cumulative % retained)/100',
      parameters: [
        { id: 'sample-weight', name: 'Sample Weight', unit: 'g', min: 500, max: 2000, default: 1000, step: 100 },
        { id: 'coarse-percent', name: 'Coarse Fraction', unit: '%', min: 0, max: 50, default: 25, step: 5 },
        { id: 'fine-percent', name: 'Fine Fraction', unit: '%', min: 10, max: 60, default: 35, step: 5 },
      ],
      whatIfScenarios: [
        { id: 'gap-graded', question: 'What if certain sizes are missing?', parameterChanges: [{ parameterId: 'coarse-percent', newValue: 45 }, { parameterId: 'fine-percent', newValue: 45 }], expectedOutcome: 'Gap-graded aggregate. May have poor workability or segregation.' },
        { id: 'well-graded', question: 'What if well-graded?', parameterChanges: [{ parameterId: 'coarse-percent', newValue: 30 }, { parameterId: 'fine-percent', newValue: 35 }], expectedOutcome: 'Good particle distribution. Better packing, less voids.' },
        { id: 'fine-heavy', question: 'What if too much fines?', parameterChanges: [{ parameterId: 'fine-percent', newValue: 55 }], expectedOutcome: 'High FM. More surface area, needs more cement paste.' },
      ],
    },
    {
      id: 'cube-strength',
      labId: 'ct-lab',
      name: 'Compressive Strength of Concrete Cubes',
      aim: 'To determine the compressive strength of concrete cubes at various ages.',
      apparatus: ['Compression Testing Machine', 'Concrete Cubes (150mm)', 'Curing Tank'],
      principle: 'Compressive strength is key property. Tested at 7 and 28 days. Target characteristic strength.',
      formula: 'fck = P/A (N/mm²)',
      parameters: [
        { id: 'load', name: 'Failure Load', unit: 'kN', min: 400, max: 1200, default: 700, step: 50 },
        { id: 'cube-area', name: 'Cube Face Area', unit: 'mm²', min: 22500, max: 22500, default: 22500, step: 0 },
        { id: 'curing-days', name: 'Curing Age', unit: 'days', min: 3, max: 28, default: 28, step: 7 },
      ],
      whatIfScenarios: [
        { id: 'seven-day', question: 'What if tested at 7 days?', parameterChanges: [{ parameterId: 'curing-days', newValue: 7 }], expectedOutcome: 'Expect ~65% of 28-day strength. Early strength indicator.' },
        { id: 'low-load', question: 'What if load is low?', parameterChanges: [{ parameterId: 'load', newValue: 450 }], expectedOutcome: 'Low strength (20 MPa). May indicate poor mix or curing.' },
        { id: 'high-load', question: 'What if load is high?', parameterChanges: [{ parameterId: 'load', newValue: 1000 }], expectedOutcome: 'High strength (~44 MPa). Good quality M40+ concrete.' },
      ],
    },
  ],
};

export const getDepartmentById = (id: string): DepartmentInfo | undefined => {
  return departments.find(d => d.id === id);
};

export const getLabById = (labId: string): Lab | undefined => {
  for (const dept of departments) {
    const lab = dept.labs.find(l => l.id === labId);
    if (lab) return lab;
  }
  return undefined;
};

export const getExperimentsByLabId = (labId: string): Experiment[] => {
  return experiments[labId] || [];
};

export const getExperimentById = (experimentId: string): Experiment | undefined => {
  for (const labExperiments of Object.values(experiments)) {
    const exp = labExperiments.find(e => e.id === experimentId);
    if (exp) return exp;
  }
  return undefined;
};

export const getDepartmentByLabId = (labId: string): DepartmentInfo | undefined => {
  return departments.find(d => d.labs.some(l => l.id === labId));
};
