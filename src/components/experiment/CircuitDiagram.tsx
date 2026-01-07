import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CircuitDiagramProps {
  experimentId: string;
  voltage?: number;
  current?: number;
  resistance?: number;
  isOverload?: boolean;
}

export function CircuitDiagram({
  experimentId,
  voltage = 5,
  current = 0.05,
  resistance = 100,
  isOverload = false,
}: CircuitDiagramProps) {
  // Simple SVG circuit representation
  const currentFlowOpacity = Math.min(current * 10, 1);

  return (
    <Card>
      <CardHeader className="py-4">
        <CardTitle className="text-lg">Circuit Diagram</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative bg-muted/30 rounded-lg p-4 min-h-[200px]">
          <svg
            viewBox="0 0 400 200"
            className="w-full h-auto"
            style={{ maxHeight: '200px' }}
          >
            {/* Power Source */}
            <g transform="translate(50, 50)">
              <rect
                x="-20"
                y="-20"
                width="40"
                height="40"
                rx="4"
                fill="hsl(var(--card))"
                stroke={isOverload ? 'hsl(var(--destructive))' : 'hsl(var(--accent))'}
                strokeWidth="2"
              />
              <text
                x="0"
                y="5"
                textAnchor="middle"
                fill="hsl(var(--foreground))"
                fontSize="12"
                fontFamily="monospace"
              >
                {voltage}V
              </text>
              <text
                x="0"
                y="45"
                textAnchor="middle"
                fill="hsl(var(--muted-foreground))"
                fontSize="10"
              >
                Source
              </text>
            </g>

            {/* Connecting Wire - Top */}
            <line
              x1="70"
              y1="50"
              x2="150"
              y2="50"
              stroke="hsl(var(--accent))"
              strokeWidth="3"
              opacity={currentFlowOpacity}
            />
            
            {/* Ammeter */}
            <g transform="translate(180, 50)">
              <circle
                r="20"
                fill="hsl(var(--card))"
                stroke="hsl(var(--border))"
                strokeWidth="2"
              />
              <text
                x="0"
                y="4"
                textAnchor="middle"
                fill="hsl(var(--foreground))"
                fontSize="10"
                fontFamily="monospace"
              >
                A
              </text>
              <text
                x="0"
                y="40"
                textAnchor="middle"
                fill="hsl(var(--muted-foreground))"
                fontSize="10"
              >
                {(current * 1000).toFixed(1)}mA
              </text>
            </g>

            {/* Wire to Resistor */}
            <line
              x1="200"
              y1="50"
              x2="280"
              y2="50"
              stroke="hsl(var(--accent))"
              strokeWidth="3"
              opacity={currentFlowOpacity}
            />

            {/* Resistor */}
            <g transform="translate(310, 50)">
              <rect
                x="-30"
                y="-12"
                width="60"
                height="24"
                rx="2"
                fill="hsl(var(--secondary))"
                stroke={isOverload ? 'hsl(var(--destructive))' : 'hsl(var(--border))'}
                strokeWidth="2"
              />
              {/* Resistor zigzag pattern */}
              <path
                d="M-20,0 L-15,-8 L-5,8 L5,-8 L15,8 L20,0"
                fill="none"
                stroke="hsl(var(--foreground))"
                strokeWidth="1.5"
              />
              <text
                x="0"
                y="30"
                textAnchor="middle"
                fill="hsl(var(--muted-foreground))"
                fontSize="10"
              >
                {resistance}Ω
              </text>
            </g>

            {/* Wire down */}
            <line
              x1="340"
              y1="50"
              x2="340"
              y2="150"
              stroke="hsl(var(--accent))"
              strokeWidth="3"
              opacity={currentFlowOpacity}
            />

            {/* Return Wire */}
            <line
              x1="340"
              y1="150"
              x2="50"
              y2="150"
              stroke="hsl(var(--accent))"
              strokeWidth="3"
              opacity={currentFlowOpacity}
            />

            {/* Wire up to source */}
            <line
              x1="50"
              y1="150"
              x2="50"
              y2="70"
              stroke="hsl(var(--accent))"
              strokeWidth="3"
              opacity={currentFlowOpacity}
            />

            {/* Voltmeter */}
            <g transform="translate(180, 150)">
              <circle
                r="20"
                fill="hsl(var(--card))"
                stroke="hsl(var(--border))"
                strokeWidth="2"
              />
              <text
                x="0"
                y="4"
                textAnchor="middle"
                fill="hsl(var(--foreground))"
                fontSize="10"
                fontFamily="monospace"
              >
                V
              </text>
            </g>
            
            {/* Voltmeter connections (dashed) */}
            <line
              x1="180"
              y1="130"
              x2="180"
              y2="100"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth="1"
              strokeDasharray="4 2"
            />

            {/* Current flow arrow */}
            <g transform="translate(130, 35)">
              <path
                d="M0,0 L10,5 L0,10 Z"
                fill="hsl(var(--accent))"
                opacity={currentFlowOpacity}
              />
              <text
                x="15"
                y="8"
                fill="hsl(var(--accent))"
                fontSize="9"
                opacity={currentFlowOpacity}
              >
                I
              </text>
            </g>

            {/* Overload indicator */}
            {isOverload && (
              <g transform="translate(310, 20)">
                <text
                  x="0"
                  y="0"
                  textAnchor="middle"
                  fill="hsl(var(--destructive))"
                  fontSize="10"
                  fontWeight="bold"
                >
                  ⚠ OVERLOAD
                </text>
              </g>
            )}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
