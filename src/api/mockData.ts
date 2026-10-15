import type { RecipeInput } from "../schemas/recipeSchema";

// mockData
export const mockRecipes: RecipeInput[] = [
  {
    id: "recipe-1",
    title: "Classic Norwegian Meatballs",
    description:
      "Traditional meatballs in brown gravy, served with creamed cabbage and lingonberries.",
    imageUrl: "https://example.com",
    cookingTime: 45,
    servings: 4,
    difficulty: "easy",
    category: "meat",
    tags: ["tradition", "dinner", "autumn"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: {
      id: "author-1",
      name: "Grandmother Astrid",
      avatar: "https://example.com",
    },
    ratings: {
      average: 4.8,
      count: 24,
    },
    ingredients: [
      { name: "Ground meat", amount: "500", unit: "g" },
      { name: "Salt", amount: "1", unit: "ts" },
      { name: "Meat broth", amount: "2", unit: "dl" },
    ],
    instructions: [
      {
        step: 1,
        description:
          "Mix the minced meat well with the salt until it becomes sticky.",
      },
      {
        step: 1,
        description:
          "Shape into patties and brown them in a frying pan with butter.",
      },
    ],
  },
  // More recipes
];
