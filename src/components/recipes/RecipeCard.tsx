import React from "react";
import { Link } from "@tanstack/react-router";
import { type RecipeInput } from "../../schemas/recipeSchema";

interface RecipeCardProps {
  recipe: RecipeInput;
}

// OPTIMIZATION 1: React.memo prevents re-rendering during infinite scrolling!
const RecipeCard = React.memo(function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link
      to="/recipes/$recipeId"
      params={{ recipeId: recipe.id }}
      className="p-5 border rounded-lg shadow-sm hover:shadow-md transition bg-white flex flex-col justify-between text-left cursor-pointer hover:border-amber-500 min-h-55"
    >
      <div>
        <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
          {recipe.category}
        </span>
        <h3 className="text-lg font-bold mt-2 text-gray-800 line-clamp-1">
          {recipe.title}
        </h3>
        <p className="text-gray-600 text-xs mt-1 line-clamp-2">
          {recipe.description}
        </p>
      </div>

      <div className="flex gap-2">
        <span>⏱️ {recipe.cookingTime} min</span>
        <span>📊 {recipe.difficulty}</span>
      </div>

      {/* The Edit button */}
      <div className="flex items-center gap-3">
        <Link
          to="/recipes/$recipeId/edit"
          params={{ recipeId: recipe.id }}
          onClick={(e) => e.stopPropagation()} // Important: Prevents the details page from opening!
          className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded hover:bg-amber-100 hover:text-amber-800 transition font-medium text-[10px]"
        >
          ✏️ Edit
        </Link>

        {/* OPTIMIZATION 2: Lazy loading of images enabled! */}
        <img
          src={
            recipe.imageUrl && recipe.imageUrl.includes("photo-")
              ? recipe.imageUrl
              : "https://images.unsplash.com/photo-1594910015880-83c22b9722c4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" // standard-fallback
          }
          alt={recipe.title}
          loading="lazy"
          className="w-8 h-8 rounded-full object-cover border"
        />
      </div>
    </Link>
  );
});

export default RecipeCard;
