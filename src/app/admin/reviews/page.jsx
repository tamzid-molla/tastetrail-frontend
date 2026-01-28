import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Star } from "lucide-react";

const AdminReviewsPage = () => {
  // Mock data for reviews
  const reviews = [
    {
      id: 1,
      recipeName: "Spicy Tofu Stir Fry",
      reviewer: "John Smith",
      rating: 5,
      comment: "Absolutely delicious! Will definitely make again.",
      date: "2023-05-15",
      status: "approved"
    },
    {
      id: 2,
      recipeName: "Classic Beef Burger",
      reviewer: "Emily Johnson",
      rating: 4,
      comment: "Great flavor, but a bit too salty for my taste.",
      date: "2023-05-14",
      status: "approved"
    },
    {
      id: 3,
      recipeName: "Vegan Chocolate Cake",
      reviewer: "Michael Brown",
      rating: 3,
      comment: "Good texture but could use more chocolate flavor.",
      date: "2023-05-13",
      status: "pending"
    },
    {
      id: 4,
      recipeName: "Avocado Toast Supreme",
      reviewer: "Sarah Davis",
      rating: 5,
      comment: "Perfect breakfast recipe! Quick and nutritious.",
      date: "2023-05-12",
      status: "approved"
    },
    {
      id: 5,
      recipeName: "Mediterranean Salad Bowl",
      reviewer: "David Wilson",
      rating: 4,
      comment: "Fresh and healthy. Loved the dressing recipe.",
      date: "2023-05-11",
      status: "rejected"
    }
  ];

  const getStatusVariant = (status) => {
    switch(status) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-semibold">Manage Reviews</h2>
          <p className="text-lg text-gray-600">View, approve, and manage user reviews.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search reviews..."
              className="pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button>+ Moderate Reviews</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Review List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recipe</TableHead>
                <TableHead>Reviewer</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">{review.recipeName}</TableCell>
                  <TableCell>{review.reviewer}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{review.comment}</TableCell>
                  <TableCell>{review.date}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(review.status)}>
                      {review.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        {review.status === 'pending' ? 'Approve' : 'Edit'}
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                        {review.status === 'pending' ? 'Reject' : 'Delete'}
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

export default AdminReviewsPage;