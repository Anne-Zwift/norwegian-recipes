import { z } from "zod";

// validation of a ingredient
export const ingredientSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Ingredient name must be at least 2 characters" }),
  amount: z
    .number({ error: "Amount must be a number" })
    .positive({ message: "Amount must be greater than 0" }),
  unit: z
    .string()
    .min(1, { message: "You must choose or write a unit (e.g. g, ml, pcs" }),
});

// validation of a recipe
export const recipeSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title cannot exceed 100 characters" }),

  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" }),

  cookTime: z
    .number({ error: "Cooking time must be a number" })
    .int()
    .min(0, { message: "Cooking time cannot be negative" }),

  ingredients: z
    .array(ingredientSchema)
    .min(1, { message: "You must add at least one ingredient" }),

  instructions: z
    .array(
      z
        .string()
        .min(5, { message: "Instruction step must be at least 5 characters" }),
    )
    .min(1, { message: "You must add at least on instruction step" }),

  difficulty: z.enum(["Easy", "Medium", "Hard"], {
    error: "Please select a valid difficulty level",
  }),
});

export type RecipeInput = z.infer<typeof recipeSchema>;
export type IngredientInput = z.infer<typeof ingredientSchema>;
