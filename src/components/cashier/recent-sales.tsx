import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Receipt } from "lucide-react"

const recentSales = [
  { id: "1", customer: "John Doe", total: 199.99, time: "10:30 AM" },
  { id: "2", customer: "Jane Smith", total: 49.99, time: "10:10 AM" },
  { id: "3", customer: "Bob Johnson", total: 299.99, time: "9:55 AM" },
  { id: "4", customer: "Alice Brown", total: 99.99, time: "9:40 AM" },
  { id: "5", customer: "Charlie Wilson", total: 79.99, time: "9:20 AM" },
]

export function RecentSales() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentSales.map((sale) => (
          <div key={sale.id} className="flex items-center justify-between">
            <div>
              <div className="font-medium">{sale.customer}</div>
              <div className="text-xs text-muted-foreground">{sale.time}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">${sale.total.toFixed(2)}</span>
              <Badge variant="outline" className="text-xs">Sale</Badge>
              <button className="text-blue-600 hover:underline flex items-center gap-1 text-xs">
                <Receipt className="h-3 w-3" />
                Receipt
              </button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
} 