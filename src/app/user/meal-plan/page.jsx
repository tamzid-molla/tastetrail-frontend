"use client";
import React, { useState } from "react";
import {
  useGetMyMealPlansQuery,
  useUpdateMealPlanStatusMutation,
  useDeleteMealPlanMutation,
} from "@/redux/api/mealPlanApiSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, ChefHat, CheckCircle2, Utensils, X, Flame } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import SafeImage from "@/components/shared/SafeImage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

const MealPlanPage = () => {
  const { data, isLoading } = useGetMyMealPlansQuery();
  const [updateStatus] = useUpdateMealPlanStatusMutation();
  const [deleteMealPlan] = useDeleteMealPlanMutation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [mealPlanToDelete, setMealPlanToDelete] = useState(null);

  const mealPlans = data?.mealPlans || [];

  // Group meal plans by date
  const groupedByDate = mealPlans.reduce((acc, plan) => {
    const date = new Date(plan.date).toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(plan);
    return acc;
  }, {});

  // Get next 7 days
  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({
        date: date.toISOString().split("T")[0],
        dayName: date.toLocaleDateString("en-US", { weekday: "long" }),
        dayNumber: date.getDate(),
        month: date.toLocaleDateString("en-US", { month: "short" }),
      });
    }
    return days;
  };

  const handleStatusUpdate = async (planId, newStatus) => {
    try {
      await updateStatus({ id: planId, status: newStatus }).unwrap();
      toast.success("Status updated!");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (planId) => {
    // Open the confirmation dialog
    setMealPlanToDelete(planId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!mealPlanToDelete) return;
    try {
      await deleteMealPlan(mealPlanToDelete).unwrap();
      toast.success("Removed from meal plan");
      setMealPlanToDelete(null);
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to remove");
      setMealPlanToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  const cancelDelete = () => {
    setMealPlanToDelete(null);
    setShowDeleteDialog(false);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      planned: { label: "Planned", variant: "secondary", icon: Calendar },
      cooking: { label: "Cooking", variant: "default", icon: ChefHat },
      cooked: { label: "Cooked", variant: "outline", icon: CheckCircle2 },
    };
    const config = statusConfig[status] || statusConfig.planned;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const weekDays = getNext7Days();

  // Calculate stats
  const stats = {
    total: mealPlans.length,
    planned: mealPlans.filter((p) => p.status === "planned").length,
    cooking: mealPlans.filter((p) => p.status === "cooking").length,
    cooked: mealPlans.filter((p) => p.status === "cooked").length,
  };

  return (
    <>
      <div className="p-4 pt-6 md:pt-8">
        <div className="max-w-7xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                Weekly Meal Planning
              </CardTitle>
              <p className="text-base sm:text-lg text-gray-600 mt-2">
                Plan your meals for the week and track your cooking progress.
              </p>
            </CardHeader>
            <CardContent>
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Planned</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{stats.planned}</p>
                  <p className="text-sm text-muted-foreground">Planned</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">{stats.cooking}</p>
                  <p className="text-sm text-muted-foreground">Cooking</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{stats.cooked}</p>
                  <p className="text-sm text-muted-foreground">Cooked</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Calendar View */}
          {isLoading ? (
            <div className="space-y-4">
              {weekDays.map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-32 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {weekDays.map((day) => {
                const dayPlans = groupedByDate[day.date] || [];
                return (
                  <Card key={day.date}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{day.dayName}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {day.month} {day.dayNumber}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {dayPlans.length} meal{dayPlans.length !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {dayPlans.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {dayPlans.map((plan) => {
                            const recipe = plan.recipe;
                            return (
                              <Card key={plan._id} className="overflow-hidden">
                                <div className="relative w-full h-32 bg-gray-200">
                                  <SafeImage
                                    src={recipe?.image}
                                    alt={recipe?.title || "Recipe"}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    fallback={
                                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <Utensils className="h-8 w-8 text-gray-400" />
                                      </div>
                                    }
                                  />
                                </div>
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between mb-2">
                                    <Link href={`/user/recipes/${recipe?._id}`}>
                                      <h4 className="font-semibold hover:text-primary line-clamp-2">
                                        {recipe?.title || "Recipe"}
                                      </h4>
                                    </Link>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                      onClick={() => handleDelete(plan._id)}>
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                                    {recipe?.cookingTime && (
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{recipe.cookingTime} min</span>
                                      </div>
                                    )}
                                    {recipe?.calories && (
                                      <div className="flex items-center gap-1">
                                        <Flame className="h-3 w-3" />
                                        <span>{recipe.calories} cal</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="space-y-2">
                                    {getStatusBadge(plan.status)}
                                    <Select
                                      value={plan.status}
                                      onValueChange={(newStatus) => handleStatusUpdate(plan._id, newStatus)}>
                                      <SelectTrigger className="h-8 text-xs">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="planned">Planned</SelectItem>
                                        <SelectItem value="cooking">Cooking</SelectItem>
                                        <SelectItem value="cooked">Cooked</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No meals planned for this day</p>
                          <Link href="/user/recipes">
                            <Button variant="outline" className="mt-4">
                              Browse Recipes
                            </Button>
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {mealPlans.length === 0 && !isLoading && (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg font-semibold mb-2">No meals planned yet</p>
                <p className="text-muted-foreground mb-4">
                  Start planning your week by adding recipes to your meal plan!
                </p>
                <Link href="/user/recipes">
                  <Button>Discover Recipes</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Removal</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to remove this recipe from your meal plan?</p>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Remove
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MealPlanPage;
