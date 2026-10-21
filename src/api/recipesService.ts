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
    difficulty = "", // new parameter
    maxTime: number | null = null, // new parameter (number or empty)
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
    // Requirement 4: Implement Category filtering (lesson 3.3)
    if (category) {
      const cleanCategory = category.trim().toLocaleLowerCase();
      filtered = filtered.filter((recipe) => {
        if (!recipe.category) return false;

        return recipe.category.trim().toLocaleLowerCase() === cleanCategory;
      });
    }

    // new filter(step 7 kanban): combination logic for difficulty
    if (difficulty) {
      const cleanDifficulty = difficulty.trim().toLocaleLowerCase();
      filtered = filtered.filter((recipe) => {
        if (!recipe.difficulty) return false;
        return recipe.difficulty.trim().toLocaleLowerCase() === cleanDifficulty;
      });
    }
    // new filter (step 7 kanban): combination logic for cooking time
    if (maxTime !== null && maxTime > 0) {
      filtered = filtered.filter((recipe) => recipe.cookingTime <= maxTime);
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

    const recipe = mockRecipes.find((r) => r.id === String(id));

    if (!recipe) {
      throw new Error(`Recipe with ID ${id} was not found.`);
    }
    return recipe;
  },
  // C. SIMULATED ENDPOINT: POST /recipes/ (Create a new recipe)
  createRecipe: async (
    newRecipeData: Omit<
      RecipeInput,
      "id" | "createdAt" | "updatedAt" | "ratings"
    >,
  ): Promise<RecipeInput> => {
    await delay(500); // Requirement: Simulate network latency (the app waits 500 ms)

    // Create a complete RecipeInput object by automatically generating backend values
    const createRecipe: RecipeInput = {
      ...newRecipeData,
      id: `recipe-${Date.now()}`, // generates a unique ID based on timestamp
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // standard values for new recipes
      ratings: {
        average: 0,
        count: 0,
      },
      author: newRecipeData.author || {
        id: "author-current",
        name: "Anne-Zwift",
        avatar: "https://example.com",
      },
    };

    // "save" in local database
    mockRecipes.push(createRecipe);

    return createRecipe;
  },

  // D. SIMULATED ENDPOINT: PUT /recipes/:id (Update existing recipe)
  updateRecipe: async (
    id: string,
    updatedData: Partial<RecipeInput>,
  ): Promise<RecipeInput> => {
    await delay(500);

    // Find the index of the recipe in the database
    const cleanId = String(id).trim();
    const recipeIndex = mockRecipes.findIndex((r) => String(r.id) === cleanId);

    if (recipeIndex === -1) {
      throw new Error(
        `Could not update recipe. Recipe ID ${id} was not found.`,
      );
    }
    // merge changes
    const updatedRecipe: RecipeInput = {
      ...mockRecipes[recipeIndex],
      ...updatedData,
      updatedAt: new Date().toISOString(), // adds a date for the change
    };
    // rewrites old data
    mockRecipes[recipeIndex] = updatedRecipe;

    return updatedRecipe;
  },
};
