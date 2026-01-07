import { Parameter } from '@/types';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

interface ParameterSliderProps {
  parameter: Parameter;
  value: number;
  onChange: (value: number) => void;
}

export function ParameterSlider({ parameter, value, onChange }: ParameterSliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          {parameter.name}
          {parameter.unit && (
            <span className="text-muted-foreground ml-1">({parameter.unit})</span>
          )}
        </Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={value}
            onChange={(e) => {
              const newValue = parseFloat(e.target.value);
              if (!isNaN(newValue) && newValue >= parameter.min && newValue <= parameter.max) {
                onChange(newValue);
              }
            }}
            min={parameter.min}
            max={parameter.max}
            step={parameter.step}
            className="w-20 h-8 text-center font-mono text-sm"
          />
        </div>
      </div>
      
      <Slider
        value={[value]}
        onValueChange={([newValue]) => onChange(newValue)}
        min={parameter.min}
        max={parameter.max}
        step={parameter.step}
        className="cursor-pointer"
      />
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{parameter.min}{parameter.unit}</span>
        <span>{parameter.max}{parameter.unit}</span>
      </div>
    </div>
  );
}
