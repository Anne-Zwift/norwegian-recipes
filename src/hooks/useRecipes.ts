import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  recipesService,
  type PaginatedRecipesResponse,
} from "../api/recipesService";
import { type RecipeInput } from "../schemas/recipeSchema";

/*
 * A custom hook for fetching recipes using TanStack Query.
 * Accepts parameters for pagination, search, and filtering from the router/UI.
 */

export function useRecipes(
  page = 1,
  limit = 6,
  searchTerm = "",
  category = "",
  difficulty = "",
  maxTime: number | null = null,
) {
  return useQuery({
    queryKey: [
      "recipes",
      { page, limit, searchTerm, category, difficulty, maxTime },
    ],

    queryFn: () =>
      recipesService.getRecipes(
        page,
        limit,
        searchTerm,
        category,
        difficulty,
        maxTime,
      ),

    placeholderData: (previousData: PaginatedRecipesResponse | undefined) =>
      previousData,
  });
}

/**
 * Custom hook for creating a new recipe (POST)
 */
export function useCreateRecipe() {
  const queryClient = useQueryClient(); // Provides direct access to the restaurant manager (the cache)

  return useMutation({
    // 1. Tells which API function to run
    mutationFn: (
      newRecipe: Omit<
        RecipeInput,
        "id" | "createdAt" | "updatedAt" | "ratings"
      >,
    ) => recipesService.createRecipe(newRecipe),

    // 2. CACHE INVALIDATION: Runs AUTOMATICALLY once storage on the server has been successful!
    onSuccess: () => {
      // We ask the cache to mark ALL queries starting with "recipes" as outdated.
      // This triggers an automatic, silent background update in the UI!
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
  });
}

/**
 * Custom hook for updating an existing recipe (PUT)
 */
export function useUpdateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    // Since a PUT requires both an ID and the new data, mutationFn accepts a combined object.
    mutationFn: ({ id, data }: { id: string; data: Partial<RecipeInput> }) =>
      recipesService.updateRecipe(id, data),

    // success updates both the specific detail page and the main list in the cache
    onSuccess: (_data, variables) => {
      // Invalidates the main list
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      // Invalidates the detail page for this specific recipe (so that the changes appear there immediately)
      queryClient.invalidateQueries({ queryKey: ["recipe", variables.id] });
    },
  });
}
