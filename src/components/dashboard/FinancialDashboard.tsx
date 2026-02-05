
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Building, Calendar } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Property {
  id: string;
  title: string;
  rent: number;
  status: string;
  tenant_id?: string;
  profiles?: {
    name: string;
  };
}

interface FinancialDashboardProps {
  properties: Property[];
}

const FinancialDashboard = ({ properties }: FinancialDashboardProps) => {
  // Calculate financial metrics
  const occupiedProperties = properties.filter(p => p.status === 'occupied' && p.tenant_id);
  const totalMonthlyIncome = occupiedProperties.reduce((sum, property) => sum + (property.rent || 0), 0);
  const totalAnnualIncome = totalMonthlyIncome * 12;
  const averageRent = occupiedProperties.length > 0 ? totalMonthlyIncome / occupiedProperties.length : 0;
  const occupancyRate = properties.length > 0 ? (occupiedProperties.length / properties.length) * 100 : 0;

  // Prepare chart data for monthly income breakdown
  const incomeBreakdown = occupiedProperties.map(property => ({
    name: property.title,
    income: property.rent || 0,
    tenant: property.profiles?.name || 'Tenant'
  }));

  // Prepare data for property status distribution
  const statusData = [
    {
      name: 'Occupied',
      value: occupiedProperties.length,
      color: '#10b981'
    },
    {
      name: 'Available',
      value: properties.filter(p => p.status === 'available').length,
      color: '#f59e0b'
    },
    {
      name: 'Other',
      value: properties.filter(p => p.status !== 'occupied' && p.status !== 'available').length,
      color: '#6b7280'
    }
  ].filter(item => item.value > 0);

  const chartConfig = {
    income: {
      label: "Monthly Rent",
      color: "#2563eb",
    },
  };

  return (
    <div className="space-y-6">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalMonthlyIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From {occupiedProperties.length} occupied properties
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Projection</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAnnualIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Based on current occupancy
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rent</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageRent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Per occupied property
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {occupiedProperties.length} of {properties.length} properties
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Breakdown Chart */}
        {incomeBreakdown.length > 0 && (
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Monthly Income by Property</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incomeBreakdown}>
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="income" fill="var(--color-income)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {/* Property Status Distribution */}
        {statusData.length > 0 && (
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Property Portfolio Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Income Sources Table */}
      {occupiedProperties.length > 0 && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Current Income Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {occupiedProperties.map((property) => (
                <div key={property.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{property.title}</h4>
                    <p className="text-sm text-gray-600">
                      Tenant: {property.profiles?.name || 'Unknown Tenant'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      ${property.rent?.toLocaleString()}/month
                    </p>
                    <p className="text-sm text-gray-500">
                      ${((property.rent || 0) * 12).toLocaleString()}/year
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Income Message */}
      {occupiedProperties.length === 0 && (
        <Card className="border-0 shadow-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <DollarSign className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Income Sources</h3>
            <p className="text-gray-600 text-center">
              You don't have any occupied properties generating rental income yet. 
              Add tenants to your properties to start tracking income.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FinancialDashboard;
