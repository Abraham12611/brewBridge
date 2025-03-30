'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
  apy: Array<{ date: string; value: number }>;
  volume: Array<{ date: string; value: number }>;
  earnings: Array<{ date: string; value: number }>;
}

interface PoolAnalyticsProps {
  data: AnalyticsData;
}

export function PoolAnalytics({ data }: PoolAnalyticsProps) {
  const chartTypes = [
    { id: 'apy', label: 'APY History', data: data.apy, color: '#10B981' },
    { id: 'volume', label: 'Volume', data: data.volume, color: '#6366F1' },
    { id: 'earnings', label: 'Fee Earnings', data: data.earnings, color: '#F59E0B' },
  ] as const;

  return (
    <Card className="bg-[#111827] border-[#1F2937]">
      <CardHeader>
        <CardTitle className="text-[#E5E7EB]">Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="apy">
          <TabsList className="grid w-full grid-cols-3 bg-[#0A0F1C] border border-[#1F2937]">
            {chartTypes.map((type) => (
              <TabsTrigger
                key={type.id}
                value={type.id}
                className="data-[state=active]:bg-[#1F2937] data-[state=active]:text-[#E5E7EB] text-[#9CA3AF]"
              >
                {type.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {chartTypes.map((type) => (
            <TabsContent key={type.id} value={type.id}>
              <div className="h-[300px] mt-4 bg-[#0A0F1C] p-4 rounded-lg border border-[#1F2937]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={type.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12, fill: '#9CA3AF' }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      stroke="#1F2937"
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#9CA3AF' }}
                      stroke="#1F2937"
                    />
                    <Tooltip
                      formatter={(value: number) =>
                        type.id === 'apy'
                          ? `${value.toFixed(2)}%`
                          : `$${value.toLocaleString()}`
                      }
                      labelFormatter={(label) =>
                        new Date(label).toLocaleDateString()
                      }
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: 'none',
                        borderRadius: '0.5rem',
                        color: '#E5E7EB'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={type.color}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}