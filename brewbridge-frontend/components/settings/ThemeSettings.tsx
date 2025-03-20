'use client';

import { useUserPreferences } from '@/lib/stores/userPreferences';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Sun, Moon } from 'lucide-react';

export function ThemeSettings() {
  const { theme, setTheme } = useUserPreferences();

  return (
    <Card className="bg-[#111827] border-[#1F2937]">
      <CardHeader>
        <CardTitle className="text-[#E5E7EB]">Theme Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-[#E5E7EB]">Theme Mode</Label>
          <RadioGroup
            value={theme.mode}
            onValueChange={(value) =>
              setTheme({ ...theme, mode: value as 'light' | 'dark' })
            }
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light" className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#E5E7EB]">
                <Sun className="h-4 w-4" />
                Light
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark" className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#E5E7EB]">
                <Moon className="h-4 w-4" />
                Dark
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label className="text-[#E5E7EB]">Accent Color</Label>
          <div className="flex items-center gap-4">
            <Input
              type="color"
              value={theme.accent}
              onChange={(e) => setTheme({ ...theme, accent: e.target.value })}
              className="w-20 h-10 p-1 bg-[#0A0F1C] border-[#1F2937] rounded-lg"
            />
            <span className="text-sm text-[#9CA3AF]">
              Choose your preferred accent color
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
