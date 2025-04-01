import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface SlippageSettingsProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const PRESET_VALUES = [0.1, 0.5, 1, 2, 5];

export function SlippageSettings({
  value,
  onChange,
  disabled = false,
}: SlippageSettingsProps) {
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState(value.toString());

  const handlePresetClick = (presetValue: number) => {
    setIsCustom(false);
    onChange(presetValue);
  };

  const handleCustomChange = (newValue: string) => {
    setCustomValue(newValue);
    const numValue = parseFloat(newValue);
    if (!isNaN(numValue) && numValue > 0 && numValue <= 100) {
      onChange(numValue);
    }
  };

  return (
    <div className="space-y-4 bg-[#1F2937] p-4 rounded-lg border border-[#374151]">
      <div className="flex items-center justify-between">
        <Label className="text-[#E5E7EB]">Slippage Tolerance</Label>
        <div className="flex items-center space-x-2">
          {isCustom ? (
            <Input
              type="number"
              value={customValue}
              onChange={(e) => handleCustomChange(e.target.value)}
              className="w-20 bg-[#111827] text-[#E5E7EB] border-[#374151] focus:border-[#4B5563]"
              min="0.1"
              max="100"
              step="0.1"
              disabled={disabled}
            />
          ) : (
            <span className="text-sm font-medium text-[#E5E7EB]">{value}%</span>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Slider
          value={[value]}
          onValueChange={([newValue]) => onChange(newValue)}
          min={0.1}
          max={100}
          step={0.1}
          className="flex-1 [&_.slider-track]:bg-[#374151] [&_.slider-range]:bg-gradient-to-r [&_.slider-range]:from-[#00C2FF] [&_.slider-range]:to-[#7B00FF] [&_.slider-thumb]:bg-white [&_.slider-thumb]:border-[#4B5563] [&_.slider-thumb]:hover:bg-[#E5E7EB] [&_.slider-thumb]:focus:ring-[#4B5563]"
          disabled={disabled}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsCustom(!isCustom)}
          disabled={disabled}
          className="bg-[#111827] text-[#E5E7EB] border-[#374151] hover:bg-[#1F2937] hover:text-[#E5E7EB]"
        >
          {isCustom ? 'Presets' : 'Custom'}
        </Button>
      </div>

      {!isCustom && (
        <div className="flex flex-wrap gap-2">
          {PRESET_VALUES.map((preset) => (
            <Button
              key={preset}
              variant={value === preset ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePresetClick(preset)}
              disabled={disabled}
              className={`
                ${value === preset
                  ? 'bg-gradient-to-r from-[#00C2FF] to-[#7B00FF] text-white hover:opacity-90'
                  : 'bg-[#111827] text-[#E5E7EB] border-[#374151] hover:bg-[#1F2937] hover:text-[#E5E7EB]'
                }
              `}
            >
              {preset}%
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}