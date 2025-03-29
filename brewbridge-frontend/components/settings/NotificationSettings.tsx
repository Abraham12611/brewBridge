'use client';

import { useUserPreferences } from '@/lib/stores/userPreferences';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell, Wallet, Signal } from 'lucide-react';

export function NotificationSettings() {
  const { notifications, updateNotificationSettings } = useUserPreferences();

  const notificationOptions = [
    {
      id: 'transactions',
      label: 'Transaction Updates',
      description: 'Get notified about transaction status changes',
      icon: Wallet,
      value: notifications.transactions,
    },
    {
      id: 'priceAlerts',
      label: 'Price Alerts',
      description: 'Receive alerts for significant price changes',
      icon: Bell,
      value: notifications.priceAlerts,
    },
    {
      id: 'networkStatus',
      label: 'Network Status',
      description: 'Stay informed about network conditions',
      icon: Signal,
      value: notifications.networkStatus,
    },
  ] as const;

  return (
    <Card className="bg-[#111827] border-[#1F2937]">
      <CardHeader>
        <CardTitle className="text-[#E5E7EB]">Notification Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {notificationOptions.map((option) => (
            <div
              key={option.id}
              className="flex items-center justify-between space-x-4 rounded-lg bg-[#0A0F1C] border border-[#1F2937] p-4 hover:border-[#374151]"
            >
              <div className="flex items-center gap-4">
                <option.icon className="h-5 w-5 text-[#9CA3AF]" />
                <div>
                  <Label htmlFor={option.id} className="font-medium text-[#E5E7EB]">
                    {option.label}
                  </Label>
                  <p className="text-sm text-[#9CA3AF]">{option.description}</p>
                </div>
              </div>
              <Switch
                id={option.id}
                checked={option.value}
                onCheckedChange={(checked) =>
                  updateNotificationSettings({ [option.id]: checked })
                }
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}