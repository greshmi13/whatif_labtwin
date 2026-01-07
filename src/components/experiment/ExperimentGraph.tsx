import { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
  ReferenceDot,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Maximize2 } from 'lucide-react';

interface DataPoint {
  x: number;
  y: number;
  label?: string;
}

interface ExperimentGraphProps {
  title: string;
  xLabel: string;
  yLabel: string;
  xUnit: string;
  yUnit: string;
  data: DataPoint[];
  currentPoint?: { x: number; y: number };
  showArea?: boolean;
  gradientColor?: string;
}

export function ExperimentGraph({
  title,
  xLabel,
  yLabel,
  xUnit,
  yUnit,
  data,
  currentPoint,
  showArea = false,
  gradientColor = 'hsl(185, 70%, 40%)',
}: ExperimentGraphProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const chartData = useMemo(() => {
    return data.map(point => ({
      x: Number(point.x.toFixed(4)),
      y: Number(point.y.toFixed(4)),
      name: point.label || `${xLabel}: ${point.x.toFixed(2)}${xUnit}`,
    }));
  }, [data, xLabel, xUnit]);

  const ChartComponent = showArea ? AreaChart : LineChart;
  const DataComponent = showArea ? Area : Line;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">
            {xLabel}: {Number(label).toFixed(3)} {xUnit}
          </p>
          <p className="text-sm text-primary font-semibold">
            {yLabel}: {Number(payload[0].value).toFixed(4)} {yUnit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={isExpanded ? 'fixed inset-4 z-50' : ''}>
      <CardHeader className="py-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className={isExpanded ? 'h-[calc(100vh-200px)]' : 'h-[300px]'}>
          <ResponsiveContainer width="100%" height="100%">
            <ChartComponent
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
            >
              <defs>
                <linearGradient id="graphGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={gradientColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={gradientColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis
                dataKey="x"
                label={{
                  value: `${xLabel} (${xUnit})`,
                  position: 'bottom',
                  offset: 10,
                  style: { fill: 'hsl(var(--muted-foreground))', fontSize: 12 },
                }}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                stroke="hsl(var(--border))"
                tickFormatter={(value) => Number(value).toFixed(1)}
              />
              <YAxis
                label={{
                  value: `${yLabel} (${yUnit})`,
                  angle: -90,
                  position: 'insideLeft',
                  offset: 10,
                  style: { fill: 'hsl(var(--muted-foreground))', fontSize: 12 },
                }}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                stroke="hsl(var(--border))"
                tickFormatter={(value) => Number(value).toFixed(2)}
              />
              <Tooltip content={<CustomTooltip />} />
              {showArea ? (
                <Area
                  type="monotone"
                  dataKey="y"
                  stroke={gradientColor}
                  strokeWidth={2}
                  fill="url(#graphGradient)"
                  dot={{ fill: gradientColor, strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 6, stroke: gradientColor, strokeWidth: 2, fill: 'white' }}
                />
              ) : (
                <Line
                  type="monotone"
                  dataKey="y"
                  stroke={gradientColor}
                  strokeWidth={2}
                  dot={{ fill: gradientColor, strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 6, stroke: gradientColor, strokeWidth: 2, fill: 'white' }}
                />
              )}
              {currentPoint && (
                <>
                  <ReferenceLine
                    x={currentPoint.x}
                    stroke="hsl(var(--destructive))"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                  />
                  <ReferenceDot
                    x={currentPoint.x}
                    y={currentPoint.y}
                    r={8}
                    fill="hsl(var(--destructive))"
                    stroke="white"
                    strokeWidth={2}
                  />
                </>
              )}
            </ChartComponent>
          </ResponsiveContainer>
        </div>
        
        {/* Current point indicator */}
        {currentPoint && (
          <div className="mt-4 flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span className="text-muted-foreground">Current Point:</span>
              <span className="font-mono font-medium">
                ({currentPoint.x.toFixed(2)} {xUnit}, {currentPoint.y.toFixed(4)} {yUnit})
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
