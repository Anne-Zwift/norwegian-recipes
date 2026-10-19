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
        step: 2,
        description:
          "Shape into patties and brown them in a frying pan with butter.",
      },
    ],
  },
  // More recipes
  {
    id: "recipe-2",
    title: "Boiled Cod From Lofoten",
    description: "Boiled Cod, served with potatoes and carrots in white sauce.",
    imageUrl: "https://example.com",
    cookingTime: 20,
    servings: 4,
    difficulty: "easy",
    category: "fish",
    tags: ["tradition", "dinner", "autumn"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: {
      id: "author-2",
      name: "Grandfather Tim",
      avatar: "https://example.com",
    },
    ratings: {
      average: 4.8,
      count: 24,
    },
    ingredients: [
      { name: "Cod", amount: "800", unit: "g" },
      { name: "Salt", amount: "1", unit: "ts" },
      { name: "Water", amount: "5", unit: "dl" },
    ],
    instructions: [
      {
        step: 1,
        description: "Boil water with salt.",
      },
      {
        step: 2,
        description: "Steam the cod.",
      },
    ],
  },
  {
    id: "recipe-3",
    title: "Lettuce with melon",
    description: "Summer salad with melon (any kind).",
    imageUrl: "https://example.com",
    cookingTime: 20,
    servings: 4,
    difficulty: "easy",
    category: "vegan",
    tags: ["vegetables", "side-dish", "summer"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: {
      id: "author-3",
      name: "Anne-Zwift",
      avatar: "https://example.com",
    },
    ratings: {
      average: 4.8,
      count: 24,
    },
    ingredients: [
      { name: "Lettuce", amount: "250", unit: "g" },
      { name: "Cottage cheese", amount: "3", unit: "ts" },
      { name: "Water melon", amount: "0,5", unit: "kg" },
    ],
    instructions: [
      {
        step: 1,
        description: "Mix the lettuce with rest of the ingredients.",
      },
      {
        step: 2,
        description:
          "Add virgin olive oil or other, for extra taste on top as suited.",
      },
    ],
  },
];
