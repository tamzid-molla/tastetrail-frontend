"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";

const RecipeAnalytics = () => {
  // Mock data for recipe categories
  const categoryData = [
    { name: "Vegetarian", value: 45 },
    { name: "Meat", value: 30 },
    { name: "Dessert", value: 15 },
    { name: "Breakfast", value: 25 },
    { name: "Salad", value: 20 },
    { name: "Seafood", value: 10 }
  ];

  // Mock data for recipe views over time
  const monthlyData = [
    { month: "Jan", recipes: 120, views: 1200 },
    { month: "Feb", recipes: 180, views: 1800 },
    { month: "Mar", recipes: 210, views: 2100 },
    { month: "Apr", recipes: 150, views: 1500 },
    { month: "May", recipes: 240, views: 2400 },
    { month: "Jun", recipes: 190, views: 1900 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Recipe Distribution by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{
            Vegetarian: { label: "Vegetarian", theme: { light: "hsl(210, 100%, 50%)" } },
            Meat: { label: "Meat", theme: { light: "hsl(0, 100%, 50%)" } },
            Dessert: { label: "Dessert", theme: { light: "hsl(30, 100%, 50%)" } },
            Breakfast: { label: "Breakfast", theme: { light: "hsl(60, 100%, 50%)" } },
            Salad: { label: "Salad", theme: { light: "hsl(120, 100%, 50%)" } },
            Seafood: { label: "Seafood", theme: { light: "hsl(180, 100%, 50%)" } },
          }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Recipe Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{
            recipes: { label: "New Recipes", theme: { light: "hsl(210, 100%, 50%)" } },
            views: { label: "Views", theme: { light: "hsl(120, 100%, 50%)" } },
          }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={monthlyData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="recipes" name="New Recipes" />
                <Bar dataKey="views" name="Views" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecipeAnalytics;