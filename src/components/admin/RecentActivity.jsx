import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, User, Star, Utensils } from "lucide-react";

const RecentActivity = () => {
  // Mock data for recent activities
  const activities = [
    {
      id: 1,
      action: "Added new recipe",
      title: "Spicy Tofu Stir Fry",
      user: "John Doe",
      time: "2 minutes ago",
      type: "recipe",
      status: "success"
    },
    {
      id: 2,
      action: "Approved review",
      title: "Great recipe!",
      user: "Jane Smith",
      time: "15 minutes ago",
      type: "review",
      status: "success"
    },
    {
      id: 3,
      action: "Created category",
      title: "Vegetarian",
      user: "Admin",
      time: "1 hour ago",
      type: "category",
      status: "success"
    },
    {
      id: 4,
      action: "Updated recipe",
      title: "Classic Beef Burger",
      user: "Mike Johnson",
      time: "2 hours ago",
      type: "recipe",
      status: "pending"
    },
    {
      id: 5,
      action: "New user registered",
      title: "Sarah Williams",
      user: "Sarah Williams",
      time: "3 hours ago",
      type: "user",
      status: "info"
    }
  ];

  const getActivityIcon = (type) => {
    switch(type) {
      case 'recipe':
        return <ChefHat className="h-4 w-4 text-blue-500" />;
      case 'user':
        return <User className="h-4 w-4 text-green-500" />;
      case 'review':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'category':
        return <Utensils className="h-4 w-4 text-purple-500" />;
      default:
        return <ChefHat className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusVariant = (status) => {
    switch(status) {
      case 'success':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'info':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <div className="mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">
                  <span className="font-semibold">{activity.action}</span> {activity.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  By {activity.user} • {activity.time}
                </p>
              </div>
              <Badge variant={getStatusVariant(activity.status)}>
                {activity.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;