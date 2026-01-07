export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  department: Department;
  year: number;
  semester: number;
  college?: string;
  email: string;
}

export type Department = 'electrical' | 'electronics' | 'mechanical' | 'civil';

export interface Lab {
  id: string;
  name: string;
  department: Department;
  description: string;
  experimentCount: number;
}

export interface Experiment {
  id: string;
  labId: string;
  name: string;
  aim: string;
  apparatus: string[];
  principle: string;
  formula?: string;
  parameters: Parameter[];
  whatIfScenarios: WhatIfScenario[];
}

export interface Parameter {
  id: string;
  name: string;
  unit: string;
  min: number;
  max: number;
  default: number;
  step: number;
}

export interface WhatIfScenario {
  id: string;
  question: string;
  parameterChanges: { parameterId: string; newValue: number }[];
  expectedOutcome: string;
}

export interface Observation {
  id: string;
  experimentId: string;
  studentId: string;
  readings: Reading[];
  completedAt: string;
  notes?: string;
}

export interface Reading {
  id: string;
  parameters: { [key: string]: number };
  calculatedValues: { [key: string]: number };
  timestamp: string;
}

export interface ExperimentProgress {
  experimentId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completedAt?: string;
  observations?: Observation;
}

export interface DepartmentInfo {
  id: Department;
  name: string;
  fullName: string;
  color: string;
  icon: string;
  labs: Lab[];
}
