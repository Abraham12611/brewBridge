import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bridge, History, Plus } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/app/bridge">
            <Button className="w-full" variant="outline">
              <Bridge className="mr-2 h-4 w-4" />
              Bridge Now
            </Button>
          </Link>
          <Link href="/app/history">
            <Button className="w-full" variant="outline">
              <History className="mr-2 h-4 w-4" />
              View History
            </Button>
          </Link>
          <Link href="/app/pool">
            <Button className="w-full" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Liquidity
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}