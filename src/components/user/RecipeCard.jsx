"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Flame, Star } from "lucide-react";
import Link from "next/link";
import SafeImage from "@/components/shared/SafeImage";

const RecipeCard = ({ recipe }) => {
  return (
    <Link href={`/user/recipes/${recipe._id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="relative w-full h-48 bg-gray-200">
          <SafeImage
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardHeader>
          <h3 className="font-semibold text-lg line-clamp-2">{recipe.title}</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {recipe.category && <Badge variant="secondary">{recipe.category?.name || recipe.category}</Badge>}
            {recipe.cuisine && <Badge variant="outline">{recipe.cuisine?.name || recipe.cuisine}</Badge>}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {recipe.cookingTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{recipe.cookingTime} min</span>
              </div>
            )}
            {recipe.calories && (
              <div className="flex items-center gap-1">
                <Flame className="h-4 w-4" />
                <span>{recipe.calories} cal</span>
              </div>
            )}
            {recipe.averageRating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{recipe.averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default RecipeCard;
