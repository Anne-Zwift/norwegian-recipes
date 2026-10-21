import { z } from "zod";

// validation of a ingredient
export const ingredientSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Ingredient name must be at least 2 characters" }),
  amount: z
    .string()
    .min(1, { message: "Amount is required (e.g., '2', '500', '1/2')" }),
  unit: z.string().min(1, { message: "Unit is required (e.g. g, ml, pcs" }),
});

export const instructionSchema = z.object({
  step: z.number().int().positive(),
  description: z
    .string()
    .min(5, { message: "Step description must be at least 5 characters" }),
});

// validation of a recipe
export const recipeSchema = z.object({
  id: z.string(),

  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title cannot exceed 100 characters" }),

  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" }),

  imageUrl: z.url({ message: "Must be a valid image URL" }),

  ingredients: z
    .array(ingredientSchema)
    .min(1, { message: "You must add at least one ingredient" }),

  instructions: z.array(
    z.object({ step: z.number(), description: z.string() }),
  ),

  cookingTime: z
    .number({ error: "Cooking time must be a number" })
    .int()
    .positive({ message: "Time must be greater than 0" }),

  servings: z
    .number()
    .int()
    .positive({ message: "Servings must be greater than 0" }),

  difficulty: z.enum(["easy", "medium", "hard"], {
    error: "Please select a valid difficulty level",
  }),
  category: z.string().min(2, { message: "Category is required" }),
  tags: z.array(z.string()),
  author: z.object({
    id: z.string(),
    name: z.string(),
    avatar: z.string(),
  }),
  ratings: z.object({
    average: z.number(),
    count: z.number(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type RecipeInput = z.infer<typeof recipeSchema>;
export type IngredientInput = z.infer<typeof ingredientSchema>;
export type InstructionInput = z.infer<typeof instructionSchema>;
