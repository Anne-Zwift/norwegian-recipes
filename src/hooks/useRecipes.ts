import { useQuery } from "@tanstack/react-query";
import {
  recipesService,
  type PaginatedRecipesResponse,
} from "../api/recipesService";

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
