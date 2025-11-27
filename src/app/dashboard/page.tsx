import { Header } from '@/components/dashboard/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Package, ShoppingCart, Users } from 'lucide-react'

const stats = [
  { name: 'Total Orders', value: '2,345', icon: ShoppingCart },
  { name: 'Total Products', value: '1,234', icon: Package },
  { name: 'Total Customers', value: '5,678', icon: Users },
  { name: 'Total Revenue', value: '$34,567', icon: BarChart },
]

export default function DashboardPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.name}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.name}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Add your recent orders list here */}
                <p className="text-sm text-muted-foreground">
                  Recent orders will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}