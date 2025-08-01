import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Barcode } from "lucide-react"

export function ProductSearch() {
  return (
    <div className="flex gap-2 w-full max-w-md">
      <Input placeholder="Search or scan product..." className="flex-1" />
      <Button variant="outline" size="icon" title="Scan Barcode">
        <Barcode className="h-5 w-5" />
      </Button>
      <Button variant="default" size="icon" title="Search">
        <Search className="h-5 w-5" />
      </Button>
    </div>
  )
} 