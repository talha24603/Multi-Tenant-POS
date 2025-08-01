import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  TrendingUp,
  Users,
  Package,
  DollarSign
} from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground">
              From all reports
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              In reporting period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,345</div>
            <p className="text-xs text-muted-foreground">
              Total units
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Content */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales Reports</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Reports</TabsTrigger>
          <TabsTrigger value="customers">Customer Reports</TabsTrigger>
          <TabsTrigger value="financial">Financial Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Daily Sales Report
                </CardTitle>
                <CardDescription>
                  Daily sales summary and trends
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Generated</span>
                  <span className="text-sm text-muted-foreground">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Format</span>
                  <Badge variant="outline">PDF</Badge>
                </div>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Monthly Sales Report
                </CardTitle>
                <CardDescription>
                  Comprehensive monthly sales analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Generated</span>
                  <span className="text-sm text-muted-foreground">1 day ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Format</span>
                  <Badge variant="outline">Excel</Badge>
                </div>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Sales by Employee
                </CardTitle>
                <CardDescription>
                  Individual employee performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Generated</span>
                  <span className="text-sm text-muted-foreground">3 days ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Format</span>
                  <Badge variant="outline">PDF</Badge>
                </div>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Stock Level Report</CardTitle>
                <CardDescription>
                  Current inventory levels and alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Generated</span>
                  <span className="text-sm text-muted-foreground">1 hour ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Format</span>
                  <Badge variant="outline">PDF</Badge>
                </div>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
                <CardDescription>
                  Best and worst selling products
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Generated</span>
                  <span className="text-sm text-muted-foreground">2 days ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Format</span>
                  <Badge variant="outline">Excel</Badge>
                </div>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Valuation</CardTitle>
                <CardDescription>
                  Total inventory value and costs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Generated</span>
                  <span className="text-sm text-muted-foreground">1 week ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Format</span>
                  <Badge variant="outline">PDF</Badge>
                </div>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reports</CardTitle>
              <CardDescription>
                Customer analytics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Customer reports content coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>
                Financial statements and analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Financial reports content coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 