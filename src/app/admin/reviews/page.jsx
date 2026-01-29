"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Star } from "lucide-react";
import { useAllReviewsQuery, useApproveReviewMutation, useRejectReviewMutation } from "@/redux/api/reviewApiSlice";
import { toast } from "react-hot-toast";

const AdminReviewsPage = () => {
  const { data: reviewsData, isLoading, isError, error, refetch } = useAllReviewsQuery();

  // Mutation hooks
  const [approveReview, { isLoading: isApproving }] = useApproveReviewMutation();
  const [rejectReview, { isLoading: isRejecting }] = useRejectReviewMutation();

  // Transform API data to match our table structure
  console.log(reviewsData);
  const reviews =
    reviewsData?.reviews?.map((review) => ({
      id: review._id,
      recipeName: review.recipe?.title || "Unknown Recipe",
      reviewer: review.user?.fullName || "Anonymous",
      rating: review.rating,
      comment: review.comment,
      date: new Date(review.createdAt).toLocaleDateString(),
      status: review.status || "pending",
    })) || [];

  const handleApproveReview = async (reviewId) => {
    try {
      await approveReview(reviewId).unwrap();
      toast.success("Review approved successfully!");
      // No need to refetch, we'll update the status optimistically
      // Or refetch to ensure data consistency
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to approve review");
      console.error("Error approving review:", error);
    }
  };

  const handleRejectReview = async (reviewId) => {
    try {
      await rejectReview(reviewId).unwrap();
      toast.success("Review rejected successfully!");
      // No need to refetch, we'll update the status optimistically
      // Or refetch to ensure data consistency
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to reject review");
      console.error("Error rejecting review:", error);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "default";
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 pt-20 md:pt-20">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading reviews...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 pt-20 md:pt-20">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">
            Error loading reviews: {error?.data?.message || "Something went wrong"}
          </div>
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ));
  };

  return (
    <div className="p-4 pt-20 md:pt-20">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-semibold">Manage Reviews</h2>
          <p className="text-base sm:text-lg text-gray-600">View, approve, and manage user reviews.</p>
        </div>
        <div className="relative flex-grow sm:flex-grow-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search reviews..."
            className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Review List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Recipe</TableHead>
                  <TableHead className="whitespace-nowrap">Reviewer</TableHead>
                  <TableHead className="whitespace-nowrap">Rating</TableHead>
                  <TableHead className="whitespace-nowrap">Comment</TableHead>
                  <TableHead className="whitespace-nowrap">Date</TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
                  <TableHead className="whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="font-medium max-w-[120px] truncate">{review.recipeName}</TableCell>
                    <TableCell className="max-w-[100px] truncate">{review.reviewer}</TableCell>
                    <TableCell>
                      <div className="flex items-center">{renderStars(review.rating)}</div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{review.comment}</TableCell>
                    <TableCell className="whitespace-nowrap">{review.date}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(review.status)}>{review.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {review.status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApproveReview(review.id)}
                              disabled={isApproving}>
                              {isApproving ? "Approving..." : "Approve"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleRejectReview(review.id)}
                              disabled={isRejecting}>
                              {isRejecting ? "Rejecting..." : "Reject"}
                            </Button>
                          </>
                        )}
                        {review.status !== "pending" && <span className="text-sm text-gray-500">Action completed</span>}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReviewsPage;
