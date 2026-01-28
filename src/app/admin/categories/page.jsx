import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

const AdminCategoriesPage = () => {
  // Mock data for categories
  const categories = [
    {
      id: 1,
      name: "Vegetarian",
      description: "Plant-based recipes",
      recipeCount: 45,
      createdAt: "2023-01-15",
      status: "active",
    },
    {
      id: 2,
      name: "Meat",
      description: "Meat-based recipes",
      recipeCount: 30,
      createdAt: "2023-01-20",
      status: "active",
    },
    {
      id: 3,
      name: "Dessert",
      description: "Sweet treats and desserts",
      recipeCount: 15,
      createdAt: "2023-02-10",
      status: "active",
    },
    {
      id: 4,
      name: "Breakfast",
      description: "Morning meal recipes",
      recipeCount: 25,
      createdAt: "2023-02-25",
      status: "active",
    },
    {
      id: 5,
      name: "Salad",
      description: "Healthy salad recipes",
      recipeCount: 20,
      createdAt: "2023-03-05",
      status: "active",
    },
    {
      id: 6,
      name: "Seafood",
      description: "Fish and seafood recipes",
      recipeCount: 10,
      createdAt: "2023-03-15",
      status: "inactive",
    },
  ];

  const getStatusVariant = (status) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-semibold">Manage Categories</h2>
          <p className="text-lg text-gray-600">View, edit, and manage recipe categories.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search categories..."
              className="pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button>+ Add New Category</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Recipe Count</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{category.recipeCount} recipes</Badge>
                  </TableCell>
                  <TableCell>{category.createdAt}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(category.status)}>{category.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCategoriesPage;
