import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Download, Save, History } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Reading {
  id: string;
  values: Record<string, number>;
  timestamp: string;
}

interface ObservationTableProps {
  experimentId: string;
  columns: { key: string; label: string; unit: string }[];
  currentValues: Record<string, number | boolean>;
}

const OBSERVATIONS_KEY = 'whatif_observations';

export function ObservationTable({ experimentId, columns, currentValues }: ObservationTableProps) {
  const { student } = useAuth();
  const [readings, setReadings] = useState<Reading[]>([]);

  // Load saved observations
  useEffect(() => {
    const saved = localStorage.getItem(OBSERVATIONS_KEY);
    if (saved) {
      try {
        const allObservations = JSON.parse(saved);
        const experimentObs = allObservations[experimentId] || [];
        setReadings(experimentObs);
      } catch {
        // Ignore parse errors
      }
    }
  }, [experimentId]);

  // Save observations when they change
  const saveObservations = (newReadings: Reading[]) => {
    const saved = localStorage.getItem(OBSERVATIONS_KEY);
    let allObservations: Record<string, Reading[]> = {};
    if (saved) {
      try {
        allObservations = JSON.parse(saved);
      } catch {
        // Start fresh
      }
    }
    allObservations[experimentId] = newReadings;
    localStorage.setItem(OBSERVATIONS_KEY, JSON.stringify(allObservations));
  };

  const addReading = () => {
    const numericValues: Record<string, number> = {};
    Object.entries(currentValues).forEach(([key, val]) => {
      if (typeof val === 'number') numericValues[key] = val;
    });
    const newReadings = [
      ...readings,
      {
        id: crypto.randomUUID(),
        values: numericValues,
        timestamp: new Date().toLocaleTimeString(),
      },
    ];
    setReadings(newReadings);
    saveObservations(newReadings);
  };

  const removeReading = (id: string) => {
    const newReadings = readings.filter(r => r.id !== id);
    setReadings(newReadings);
    saveObservations(newReadings);
  };

  const clearAll = () => {
    setReadings([]);
    saveObservations([]);
  };

  const exportTable = () => {
    const headers = ['S.No', 'Time', ...columns.map(c => `${c.label} (${c.unit})`)];
    const rows = readings.map((r, i) => [
      i + 1,
      r.timestamp,
      ...columns.map(c => r.values[c.key]?.toFixed(4) || '-'),
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    
    // Add student info header
    const studentInfo = student 
      ? `Student: ${student.name}, Roll No: ${student.rollNumber}, Dept: ${student.department}\nExperiment: ${experimentId}\nDate: ${new Date().toLocaleDateString()}\n\n`
      : '';
    
    const blob = new Blob([studentInfo + csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `observation_${experimentId}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">Observation Table</CardTitle>
          {readings.length > 0 && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {readings.length} readings
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={addReading} size="sm" variant="default">
            <Plus className="h-4 w-4 mr-1" /> Add Reading
          </Button>
          {readings.length > 0 && (
            <>
              <Button onClick={exportTable} size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" /> Export
              </Button>
              <Button onClick={clearAll} size="sm" variant="ghost" className="text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="border border-border px-3 py-2 text-left text-sm font-semibold w-12">
                  S.No
                </th>
                <th className="border border-border px-3 py-2 text-left text-sm font-semibold w-24">
                  Time
                </th>
                {columns.map(col => (
                  <th key={col.key} className="border border-border px-3 py-2 text-left text-sm font-semibold">
                    {col.label}
                    {col.unit && <span className="text-muted-foreground font-normal ml-1">({col.unit})</span>}
                  </th>
                ))}
                <th className="border border-border px-3 py-2 text-center text-sm font-semibold w-16">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {readings.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 3}
                    className="border border-border px-3 py-12 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <History className="h-8 w-8 opacity-50" />
                      <p>No readings yet</p>
                      <p className="text-sm">Adjust parameters and click "Add Reading" to record observations</p>
                    </div>
                  </td>
                </tr>
              ) : (
                readings.map((reading, index) => (
                  <tr key={reading.id} className="hover:bg-muted/30 transition-colors">
                    <td className="border border-border px-3 py-2 text-center font-mono text-sm">
                      {index + 1}
                    </td>
                    <td className="border border-border px-3 py-2 font-mono text-xs text-muted-foreground">
                      {reading.timestamp}
                    </td>
                    {columns.map(col => (
                      <td key={col.key} className="border border-border px-3 py-2 text-center font-mono text-sm">
                        {reading.values[col.key]?.toFixed(4) || '-'}
                      </td>
                    ))}
                    <td className="border border-border px-3 py-2 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeReading(reading.id)}
                        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Auto-save indicator */}
        {readings.length > 0 && (
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Save className="h-3 w-3" />
            <span>Observations auto-saved locally</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
