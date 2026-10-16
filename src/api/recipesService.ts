import type { RecipeInput } from "../schemas/recipeSchema";
import { mockRecipes } from "./mockData";

// 1. A helper function that forces the app to wait (simulates network latency)
const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

// 2. Define what the simulated server should return during pagination
export interface PaginatedRecipesResponse {
  data: RecipeInput[];
  meta: {
    currentPage: number;
    pageCount: number;
    totalCount: number;
    hasMore: boolean;
  };
}

// A. SIMULATED ENDPOINT: GET /recipes
export const recipesService = {
  getRecipes: async (
    page = 1,
    limit = 6,
    searchTerm = "",
    category = "",
  ): Promise<PaginatedRecipesResponse> => {
    await delay(600); // Requirement 1: Simulate network latency (the app waits 600ms)

    if (Math.random() < 0.02) {
      // Requirement 2: Simulate intermittent network failures (e.g., 2% chance of failure)
      throw new Error("Could not connect to the server. Please try again.");
    }
    let filtered = [...mockRecipes]; // Create a copy of our "database" that we can manipulate

    // Requirement 3: Implement Search
    if (searchTerm) {
      const term = searchTerm.toLocaleLowerCase();
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLocaleLowerCase().includes(term) ||
          recipe.description.toLocaleLowerCase().includes(term),
      );
    }
    // Requirement 4: Implement Category filtering
    if (category) {
      filtered = filtered.filter(
        (recipe) =>
          recipe.category.toLocaleLowerCase() === category.toLocaleLowerCase(),
      );
    }
    // Requirement 5: Implement Pagination (.slice cuts list)
    const totalCount = filtered.length;
    const pageCount = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const paginatedData = filtered.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      meta: {
        currentPage: page,
        pageCount,
        totalCount,
        hasMore: page < pageCount,
      },
    };
  },

  // B. SIMULATED ENDPOINT: GET /recipes/:id (Retrieve one specific recipe)
  getRecipeById: async (id: string): Promise<RecipeInput> => {
    await delay(400);

    const recipe = mockRecipes.find((r) => r.id === id);

    if (!recipe) {
      throw new Error(`Recipe with ID ${id} was not found.`);
    }
    return recipe;
  },
};
