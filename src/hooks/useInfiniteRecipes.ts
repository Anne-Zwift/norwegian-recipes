import { useInfiniteQuery } from "@tanstack/react-query";
import { recipesService } from "../api/recipesService";

interface UseInfiniteRecipesProps {
  searchTerm?: string;
  category?: string;
  difficulty?: string;
  maxTime?: number | null;
  limit?: number;
}

export function useInfiniteRecipes({
  searchTerm = "",
  category = "",
  difficulty = "",
  maxTime = null,
  limit = 6,
}: UseInfiniteRecipesProps = {}) {
  return useInfiniteQuery({
    // 1. DYNAMIC CACHE KEY: all the filters are located here
    // Just as before, all active filters must be included in the key. If the user changes
    // the category to "Fish", the old infinite list is cleared, and a new one starts on page 1.
    queryKey: [
      "recipes",
      "infinite",
      { searchTerm, category, difficulty, maxTime, limit },
    ],

    // 2. THE QUERY FUNCTION: Receives `pageParam`, which is automatically updated by TanStack Query
    queryFn: ({ pageParam = 1 }) =>
      recipesService.getRecipes(
        pageParam as number,
        limit,
        searchTerm,
        category,
        difficulty,
        maxTime,
      ),

    // 3. START PARAMETER: page 1
    initialPageParam: 1,

    // 4. NEXT PAGE LOGIC: Checks the metadata from the simulator to determine the next page number
    getNextPageParam: (lastPage) => {
      // If the simulator says hasMore is true, we increase the page count by 1
      if (lastPage.meta.hasMore) {
        return lastPage.meta.currentPage + 1;
      }
      // If there are no more pages left, we return undefined (stopping the fetching)
      return undefined;
    },
  });
}
