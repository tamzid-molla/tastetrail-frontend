"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Star } from "lucide-react";
import { useAllReviewsQuery, useApproveReviewMutation, useRejectReviewMutation } from "@/redux/api/reviewApiSlice";
import { toast } from "react-hot-toast";

const AdminReviewsPage = () => {
  const { data: reviewsData, isLoading, isError, error, refetch } = useAllReviewsQuery();

  // Mutation hooks
  const [approveReview, { isLoading: isApproving }] = useApproveReviewMutation();
  const [rejectReview, { isLoading: isRejecting }] = useRejectReviewMutation();

  // Transform API data to match our table structure
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
          {/* Card layout for screens below lg */}
          <div className="space-y-3 lg:hidden">
            {isLoading
              ? [...Array(5)].map((_, idx) => (
                  <div key={idx} className="border rounded-lg p-3 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-24" />
                    <div className="flex justify-end gap-2 mt-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                ))
              : reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-3 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground font-semibold">Recipe</span>
                      <span className="font-medium max-w-[180px] truncate text-right">{review.recipeName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground font-semibold">Reviewer</span>
                      <span className="max-w-[160px] truncate text-right">{review.reviewer}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground font-semibold">Rating</span>
                      <div className="flex items-center">{renderStars(review.rating)}</div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground font-semibold">Comment</span>
                      <span className="max-w-[200px] truncate text-right">{review.comment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground font-semibold">Date</span>
                      <span>{review.date}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground font-semibold">Status</span>
                      <Badge variant={getStatusVariant(review.status)} className="ml-2">
                        {review.status}
                      </Badge>
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                      {review.status === "pending" ? (
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
                      ) : (
                        <span className="text-sm text-gray-500">Action completed</span>
                      )}
                    </div>
                  </div>
                ))}
          </div>

          {/* Table for lg and above */}
          <div className="w-full overflow-x-auto hidden lg:block">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Recipe</TableHead>
                  <TableHead className="whitespace-nowrap">Reviewer</TableHead>
                  <TableHead className="whitespace-nowrap">Rating</TableHead>
                  <TableHead className="whitespace-nowrap">Comment</TableHead>
                  <TableHead className="whitespace-nowrap">Date</TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
                  <TableHead className="whitespace-nowrap text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? [...Array(5)].map((_, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-40" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-24 inline-block mr-2" />
                          <Skeleton className="h-8 w-24 inline-block" />
                        </TableCell>
                      </TableRow>
                    ))
                  : reviews.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell className="font-medium max-w-[160px] truncate">{review.recipeName}</TableCell>
                        <TableCell className="max-w-[140px] truncate">{review.reviewer}</TableCell>
                        <TableCell>
                          <div className="flex items-center">{renderStars(review.rating)}</div>
                        </TableCell>
                        <TableCell className="max-w-[260px] truncate">{review.comment}</TableCell>
                        <TableCell className="whitespace-nowrap">{review.date}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(review.status)}>{review.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-wrap justify-end gap-2">
                            {review.status === "pending" ? (
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
                            ) : (
                              <span className="text-sm text-gray-500">Action completed</span>
                            )}
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
