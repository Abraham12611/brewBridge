'use client';

import { ThemeSettings } from '@/components/settings/ThemeSettings';
import { GasSettings } from '@/components/settings/GasSettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-gray-400 mt-2">
          Customize your BrewBridge experience
        </p>
      </div>

      <div className="space-y-8">
        <ThemeSettings />
        <GasSettings />
        <NotificationSettings />
      </div>
    </div>
  );
}