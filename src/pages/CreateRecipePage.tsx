import { useNavigate } from "@tanstack/react-router";
import { useCreateRecipe } from "../hooks/useRecipes";
import RecipeForm from "../components/recipes/RecipeForm";
import { type RecipeInput } from "../schemas/recipeSchema";

export default function CreateRecipePage() {
  const navigate = useNavigate();

  // 1. retrieves the mutation-servicer for POST calls!
  const { mutate, isPending, isError, error } = useCreateRecipe();

  // 2. This function runs when Zod has validated all the form data.
  const handleFormSubmit = (
    formData: Omit<RecipeInput, "id" | "createdAt" | "updatedAt" | "ratings">,
  ) => {
    mutate(formData, {
      onSuccess: () => {
        // REQUIREMENT: Upon success, the cache is automatically cleared,
        // and the user is safely redirected back to the main list to view their new card!
        navigate({ to: "/recipes" });
      },
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto mb-4">
        <button
          onClick={() => navigate({ to: "/recipes" })}
          className="text-xs font-semibold text-gray-500 hover:text-amber-600 transition"
        >
          ← Back to recipes
        </button>
      </div>

      {/* Display an error message if the simulated server throws an error */}
      {isError && (
        <div className="max-w-2xl mx-auto p-4 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          <p className="font-bold">Could not save the recipe:</p>
          <p>{error instanceof Error ? error.message : "Unknown Error"}</p>
        </div>
      )}

      {/* 3. Rolling out the reusable form! */}
      <RecipeForm onSubmit={handleFormSubmit} isSubmitting={isPending} />
    </div>
  );
}
