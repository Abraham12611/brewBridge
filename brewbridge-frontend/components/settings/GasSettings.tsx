'use client';

import { useUserPreferences } from '@/lib/stores/userPreferences';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Fuel, Zap, Timer } from 'lucide-react';

export function GasSettings() {
  const { gasPreference, setGasPreference } = useUserPreferences();

  const gasOptions = [
    {
      value: 'standard',
      label: 'Standard',
      description: 'Regular transaction speed',
      icon: Timer,
    },
    {
      value: 'fast',
      label: 'Fast',
      description: 'Faster than average',
      icon: Fuel,
    },
    {
      value: 'instant',
      label: 'Instant',
      description: 'Highest priority',
      icon: Zap,
    },
  ] as const;

  return (
    <Card className="bg-[#111827] border-[#1F2937]">
      <CardHeader>
        <CardTitle className="text-[#E5E7EB]">Gas Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-[#E5E7EB]">Gas Priority</Label>
          <RadioGroup
            value={gasPreference}
            onValueChange={(value) =>
              setGasPreference(value as 'standard' | 'fast' | 'instant')
            }
            className="grid gap-4"
          >
            {gasOptions.map((option) => (
              <div
                key={option.value}
                className={`flex items-center space-x-4 rounded-lg border p-4 cursor-pointer transition-colors ${
                  gasPreference === option.value
                    ? 'bg-[#1F2937] border-[#374151] text-[#E5E7EB]'
                    : 'bg-[#0A0F1C] border-[#1F2937] text-[#9CA3AF] hover:border-[#374151]'
                }`}
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <Label
                  htmlFor={option.value}
                  className="flex-1 flex items-center gap-4 cursor-pointer"
                >
                  <option.icon className={`h-5 w-5 ${
                    gasPreference === option.value ? 'text-[#E5E7EB]' : 'text-[#9CA3AF]'
                  }`} />
                  <div>
                    <div className={`font-medium ${
                      gasPreference === option.value ? 'text-[#E5E7EB]' : 'text-[#9CA3AF]'
                    }`}>{option.label}</div>
                    <div className="text-sm text-[#6B7280]">
                      {option.description}
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}