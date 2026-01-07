import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student, Department, ExperimentProgress } from '@/types';

interface AuthContextType {
  student: Student | null;
  isAuthenticated: boolean;
  login: (student: Student) => void;
  logout: () => void;
  register: (studentData: Omit<Student, 'id'>) => void;
  progress: ExperimentProgress[];
  updateProgress: (experimentId: string, status: ExperimentProgress['status']) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'whatif_student';
const PROGRESS_KEY = 'whatif_progress';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [progress, setProgress] = useState<ExperimentProgress[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setStudent(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    const storedProgress = localStorage.getItem(PROGRESS_KEY);
    if (storedProgress) {
      try {
        setProgress(JSON.parse(storedProgress));
      } catch {
        localStorage.removeItem(PROGRESS_KEY);
      }
    }
  }, []);

  const login = (studentData: Student) => {
    setStudent(studentData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(studentData));
  };

  const logout = () => {
    setStudent(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const register = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: crypto.randomUUID(),
    };
    login(newStudent);
  };

  const updateProgress = (experimentId: string, status: ExperimentProgress['status']) => {
    setProgress(prev => {
      const existing = prev.find(p => p.experimentId === experimentId);
      let newProgress: ExperimentProgress[];
      
      if (existing) {
        newProgress = prev.map(p => 
          p.experimentId === experimentId 
            ? { ...p, status, completedAt: status === 'completed' ? new Date().toISOString() : undefined }
            : p
        );
      } else {
        newProgress = [...prev, { 
          experimentId, 
          status,
          completedAt: status === 'completed' ? new Date().toISOString() : undefined,
        }];
      }
      
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(newProgress));
      return newProgress;
    });
  };

  return (
    <AuthContext.Provider value={{
      student,
      isAuthenticated: !!student,
      login,
      logout,
      register,
      progress,
      updateProgress,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
