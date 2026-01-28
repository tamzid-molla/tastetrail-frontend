import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

const AdminRecipesPage = () => {
  // Mock data for recipes
  const recipes = [
    {
      id: 1,
      name: "Spicy Tofu Stir Fry",
      category: "Vegetarian",
      author: "John Doe",
      addedDate: "2023-05-15",
      cookingTime: "25 mins",
      difficulty: "Easy",
      calories: 320,
      status: "published",
      views: 1240,
    },
    {
      id: 2,
      name: "Classic Beef Burger",
      category: "Meat",
      author: "Mike Johnson",
      addedDate: "2023-05-14",
      cookingTime: "30 mins",
      difficulty: "Medium",
      calories: 580,
      status: "published",
      views: 2100,
    },
    {
      id: 3,
      name: "Vegan Chocolate Cake",
      category: "Dessert",
      author: "Emma Wilson",
      addedDate: "2023-05-13",
      cookingTime: "45 mins",
      difficulty: "Hard",
      calories: 420,
      status: "draft",
      views: 0,
    },
    {
      id: 4,
      name: "Avocado Toast Supreme",
      category: "Breakfast",
      author: "Alex Turner",
      addedDate: "2023-05-12",
      cookingTime: "10 mins",
      difficulty: "Easy",
      calories: 280,
      status: "published",
      views: 850,
    },
    {
      id: 5,
      name: "Mediterranean Salad Bowl",
      category: "Salad",
      author: "Sophia Martinez",
      addedDate: "2023-05-11",
      cookingTime: "15 mins",
      difficulty: "Easy",
      calories: 210,
      status: "published",
      views: 1560,
    },
  ];

  const getStatusVariant = (status) => {
    switch (status) {
      case "published":
        return "default";
      case "draft":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-semibold">Manage Recipes</h2>
          <p className="text-lg text-gray-600">View, edit, and manage all recipes in the system.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search recipes..."
              className="pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Link href="/admin/recipes/new">
            <Button>+ Add New Recipe</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recipe List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Calories</TableHead>
                <TableHead>Cook Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipes.map((recipe) => (
                <TableRow key={recipe.id}>
                  <TableCell className="font-medium">{recipe.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{recipe.category}</Badge>
                  </TableCell>
                  <TableCell>{recipe.author}</TableCell>
                  <TableCell>{recipe.calories} cal</TableCell>
                  <TableCell>{recipe.cookingTime}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(recipe.status)}>{recipe.status}</Badge>
                  </TableCell>
                  <TableCell>{recipe.views}</TableCell>
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

export default AdminRecipesPage;
