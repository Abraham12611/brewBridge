import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Clock, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"

interface Transaction {
  id: string
  fromChain: string
  toChain: string
  amount: number
  token: string
  status: 'pending' | 'completed' | 'failed'
  timestamp: string
}

interface RecentActivityProps {
  transactions: Transaction[]
}

export function RecentActivity({ transactions }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="flex items-center space-x-4">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{tx.fromChain}</span>
                    <ArrowRight className="h-4 w-4" />
                    <span className="font-medium">{tx.toChain}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {tx.amount} {tx.token}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-muted-foreground">
                  {new Date(tx.timestamp).toLocaleString()}
                </div>
                <div className="flex items-center space-x-1">
                  {tx.status === 'pending' && (
                    <Clock className="h-4 w-4 text-yellow-500" />
                  )}
                  {tx.status === 'completed' && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                  {tx.status === 'failed' && (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm ${
                    tx.status === 'pending' ? 'text-yellow-500' :
                    tx.status === 'completed' ? 'text-green-500' :
                    'text-red-500'
                  }`}>
                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                  </span>
                </div>
                <Link
                  href={`/app/history?tx=${tx.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}