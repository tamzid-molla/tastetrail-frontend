import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Clock, User, Flame, Timer } from "lucide-react";

const RecentRecipes = () => {
  // Mock data for recent recipes
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
    <Card>
      <CardHeader>
        <CardTitle>Recent Recipes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-4">
                <ChefHat className="h-8 w-8 text-primary" />
                <div>
                  <h4 className="font-medium">{recipe.name}</h4>
                  <p className="text-sm text-muted-foreground">{recipe.category}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Timer className="h-4 w-4" />
                  <span>{recipe.cookingTime}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Flame className="h-4 w-4" />
                  <span>{recipe.calories} cal</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{recipe.author}</span>
                </div>
              </div>
              <Badge variant={getStatusVariant(recipe.status)}>{recipe.status}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentRecipes;
