import { useParams, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { recipesService } from "../api/recipesService";
import { useUpdateRecipe } from "../hooks/useRecipes";
import RecipeForm from "../components/recipes/RecipeForm";
import { type RecipeInput } from "../schemas/recipeSchema";

export default function EditRecipePage() {
  const navigate = useNavigate();
  // Extracts the ID from the URL (e.g /recipes/recipe-1/edit)
  const { recipeId } = useParams({ from: "/recipes/$recipeId/edit" });

  // 1. Fetch current data from the cache/API to populate the form
  const {
    data: recipe,
    isLoading,
    isError: isFetchError,
  } = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => recipesService.getRecipeById(recipeId),
  });

  // 2. Retrieve the mutation-servant for PUT calls!
  const {
    mutate: updateRecipe,
    isPending: isUpdating,
    isError: isUpdateError,
    error,
  } = useUpdateRecipe();

  const handleFormSubmit = (
    formData: Omit<RecipeInput, "id" | "createdAt" | "updatedAt" | "ratings">,
  ) => {
    // Since a PUT requires both an ID and data, you send it as a single, combined object.
    updateRecipe(
      { id: recipeId, data: formData },
      {
        onSuccess: () => {
          // Send the user back to the list upon success
          navigate({ to: "/recipes" });
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-gray-500 animate-pulse font-medium">
        Loading recipes data...
      </div>
    );
  }

  if (isFetchError || !recipe) {
    return (
      <div className="p-12 text-center text-red-500 font-medium">
        Could not find the recipe you are trying to edit.
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto mb-4">
        <button
          onClick={() => navigate({ to: "/recipes" })}
          className="text-xs font-semibold text-gray-500 hover:text-amber-600 transition"
        >
          ← Cancel and go back
        </button>
      </div>

      {isUpdateError && (
        <div className="max-w-2xl mx-auto p-4 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          <p className="font-bold">Could not update the recipe:</p>
          <p>{error instanceof Error ? error.message : "Unknown Error"}</p>
        </div>
      )}

      {/* 3. include the existing data as initialData! */}
      <RecipeForm
        initialData={recipe as RecipeInput}
        onSubmit={handleFormSubmit}
        isSubmitting={isUpdating}
      />
    </div>
  );
}
