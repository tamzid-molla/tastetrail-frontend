"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useGetSingleRecipeQuery } from "@/redux/api/recipeApiSlice";
import { useGetReviewsByRecipeQuery, useCreateReviewMutation } from "@/redux/api/reviewApiSlice";
import { useAddMealPlanMutation } from "@/redux/api/mealPlanApiSlice";
import { useGetSavedRecipesQuery, useToggleSavedRecipeMutation } from "@/redux/api/userApiSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Flame, Star, Calendar, CheckCircle2, ChefHat, Utensils, Bookmark } from "lucide-react";
import SafeImage from "@/components/shared/SafeImage";
import toast from "react-hot-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const RecipeDetailPage = () => {
  const params = useParams();
  const recipeId = params.id;
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const { data: recipeData, isLoading: recipeLoading } = useGetSingleRecipeQuery(recipeId);
  const { data: reviewsData, refetch: refetchReviews } = useGetReviewsByRecipeQuery(recipeId);
  const [createReview, { isLoading: isSubmittingReview }] = useCreateReviewMutation();
  const [addMealPlan, { isLoading: isAddingMealPlan }] = useAddMealPlanMutation();
  const { data: savedData } = useGetSavedRecipesQuery();
  const [toggleSaved, { isLoading: isTogglingSaved }] = useToggleSavedRecipeMutation();

  const recipe = recipeData?.recipe;
  const isSaved = savedData?.recipes?.some((r) => r?._id === recipeId);

  const handleSubmitReview = async () => {
    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    try {
      await createReview({
        recipe: recipeId,
        rating,
        comment: comment.trim(),
      }).unwrap();
      toast.success("Review submitted! It will be visible after admin approval.");
      setComment("");
      setRating(5);
      refetchReviews();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to submit review");
    }
  };

  const handleAddToMealPlan = async () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }
    try {
      await addMealPlan({
        recipe: recipeId,
        date: selectedDate,
      }).unwrap();
      toast.success("Recipe added to meal plan!");
      setSelectedDate("");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add to meal plan");
    }
  };

  const handleToggleSaved = async () => {
    try {
      const res = await toggleSaved(recipeId).unwrap();
      toast.success(res?.message || (res?.saved ? "Saved" : "Removed"));
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update cookbook");
    }
  };

  // Get next 7 days for date selection
  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({
        value: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }),
      });
    }
    return days;
  };

  if (recipeLoading) {
    return (
      <div className="p-4 pt-6 md:pt-8 max-w-7xl mx-auto">
        <Skeleton className="w-full h-96 mb-6" />
        <Skeleton className="h-8 w-1/2 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="p-4 pt-6 md:pt-8 max-w-7xl mx-auto">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Recipe not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 pt-6 md:pt-8">
      <div className="max-w-5xl mx-auto">
        {/* Recipe Image */}
        <Card className="mb-6 overflow-hidden">
          <div className="relative w-full h-64 md:h-96 bg-gray-200">
            <SafeImage src={recipe.image} alt={recipe.title} fill className="object-cover" sizes="100vw" />
          </div>
        </Card>

        {/* Recipe Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-2xl sm:text-3xl mb-2">{recipe.title}</CardTitle>
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.category && (
                    <Badge variant="secondary">
                      <Utensils className="h-3 w-3 mr-1" />
                      {recipe.category?.name || recipe.category}
                    </Badge>
                  )}
                  {recipe.cuisine && (
                    <Badge variant="outline">
                      <ChefHat className="h-3 w-3 mr-1" />
                      {recipe.cuisine?.name || recipe.cuisine}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {recipe.cookingTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{recipe.cookingTime} minutes</span>
                    </div>
                  )}
                  {recipe.calories && (
                    <div className="flex items-center gap-1">
                      <Flame className="h-4 w-4" />
                      <span>{recipe.calories} calories</span>
                    </div>
                  )}
                  {recipe.averageRating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>
                        {recipe.averageRating.toFixed(1)} ({recipe.totalReviews} reviews)
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant={isSaved ? "secondary" : "outline"}
                  onClick={handleToggleSaved}
                  disabled={isTogglingSaved}>
                  <Bookmark className="h-4 w-4 mr-2" />
                  {isTogglingSaved ? "Updating..." : isSaved ? "Saved" : "Save"}
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Calendar className="h-4 w-4 mr-2" />
                      Add to Meal Plan
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add to Meal Plan</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Select Date</Label>
                        <Select value={selectedDate} onValueChange={setSelectedDate}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a date" />
                          </SelectTrigger>
                          <SelectContent>
                            {getNext7Days().map((day) => (
                              <SelectItem key={day.value} value={day.value}>
                                {day.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleAddToMealPlan} disabled={isAddingMealPlan} className="w-full">
                        {isAddingMealPlan ? "Adding..." : "Add to Meal Plan"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Ingredients */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {recipe.ingredients?.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap">{recipe.instructions}</div>
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Submit Review Form */}
            <div className="mb-6 p-4 border rounded-lg">
              <h3 className="font-semibold mb-4">Write a Review</h3>
              <div className="space-y-4">
                <div>
                  <Label>Rating</Label>
                  <Select value={rating.toString()} onValueChange={(val) => setRating(parseInt(val))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 4, 3, 2, 1].map((val) => (
                        <SelectItem key={val} value={val.toString()}>
                          {val} {val === 1 ? "Star" : "Stars"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Comment</Label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this recipe..."
                    rows={4}
                  />
                </div>
                <Button onClick={handleSubmitReview} disabled={isSubmittingReview}>
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviewsData?.reviews && reviewsData.reviews.length > 0 ? (
                reviewsData.reviews.map((review) => (
                  <div key={review._id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{review.user?.fullName || "Anonymous"}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Approved
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-2">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
