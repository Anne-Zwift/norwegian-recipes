import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { recipeSchema, type RecipeInput } from "../../schemas/recipeSchema";

// defines what kind of properties (props) this reusable form needs
interface RecipeFormProps {
  initialData?: RecipeInput; // If you edit, you get old data here
  onSubmit: (
    data: Omit<RecipeInput, "id" | "createdAt" | "updatedAt" | "ratings">,
  ) => void;
  isSubmitting: boolean;
}

export default function RecipeForm({
  initialData,
  onSubmit,
  isSubmitting,
}: RecipeFormProps) {
  // 1. THE FINAL TOUCH (useForm + Zod Resolver):
  // Connect the Zod schema directly to React Hook Form. Everything is validated automatically!
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Omit<RecipeInput, "id" | "createdAt" | "updatedAt" | "ratings">>({
    resolver: zodResolver(
      recipeSchema.omit({
        id: true,
        createdAt: true,
        updatedAt: true,
        ratings: true,
      }),
    ),
    defaultValues: initialData || {
      title: "",
      description: "",
      category: "meat",
      difficulty: "easy",
      cookingTime: 30,
      servings: 4,
      imageUrl: "https://unsplash.com", // Default image
      tags: ["dinner"],
      ingredients: [{ name: "", amount: "", unit: "g" }],
      instructions: [{ step: 1, description: "" }],
      author: {
        id: "author-current",
        name: "Anne-Zwift",
        avatar: "https://example.com",
      },
    },
  });

  // 2. DYNAMIC ARRAY FOR INGREDIENTS (useFieldArray)
  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: "ingredients",
  });

  // 3. DYNAMIC ARRAY FOR INSTRUCTIONS (useFieldArray)
  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({
    control,
    name: "instructions",
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (validationErrors) => {
        console.log(
          "❌ Zod Submission stopped! Validation error:",
          validationErrors,
        );
      })}
      className="space-y-6 max-w-2xl mx-auto bg-white p-6 rounded-xl border shadow-sm"
    >
      <h2 className="text-xl font-bold text-gray-900 border-b pb-2">
        {initialData ? "Edit Recipe" : "Create New Recipe"}
      </h2>

      {/* A. Basis-information */}
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase text-gray-500">
            Title *
          </label>
          <input
            type="text"
            {...register("title")}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            placeholder="e.g GrandMothers Meatballs... "
          />
          {errors.title && (
            <p className="text-xs text-red-500 font-medium">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase text-gray-500">
            Description *
          </label>
          <textarea
            {...register("description")}
            rows={3}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            placeholder="Short description of the dish..."
          />
          {errors.description && (
            <p className="text-xs text-red-500 font-medium">
              {errors.description.message}
            </p>
          )}
        </div>
      </div>

      {/* B. Dropdowns og metadata */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase text-gray-500">
            Category
          </label>
          <select
            {...register("category")}
            className="px-3 py-2 border rounded-lg bg-white"
          >
            <option value="meat">Meat</option>
            <option value="fish">Fish</option>
            <option value="vegan">Vegan</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase text-gray-500">
            Difficulty
          </label>
          <select
            {...register("difficulty")}
            className="px-3 py-2 border rounded-lg bg-white"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase text-gray-500">
            Time (min) *
          </label>
          <input
            type="number"
            {...register("cookingTime", { valueAsNumber: true })}
            className="px-3 py-2 border rounded-lg"
          />
          {errors.cookingTime && (
            <p className="text-xs text-red-500 font-medium">
              {errors.cookingTime.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase text-gray-500">
            Portions*
          </label>
          <input
            type="number"
            {...register("servings", { valueAsNumber: true })}
            className="px-3 py-2 border rounded-lg"
          />
          {errors.servings && (
            <p className="text-xs text-red-500 font-medium">
              {errors.servings.message}
            </p>
          )}
        </div>
      </div>

      {/* C. DYNAMIC INGREDIENT LIST (Requirement: Complex forms / Dynamic fields) */}
      <div className="border-t pt-4">
        <h3 className="text-sm font-bold uppercase text-gray-700 mb-3">
          Ingredients *
        </h3>
        <div className="space-y-2">
          {ingredientFields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-center">
              <input
                type="text"
                {...register(`ingredients.${index}.name` as const)}
                placeholder="Name (e.g. wheat flour)"
                className="flex-1 px-3 py-1.5 border rounded-lg text-sm"
              />
              <input
                type="text"
                {...register(`ingredients.${index}.amount` as const)}
                placeholder="Amount"
                className="w-20 px-3 py-1.5 border rounded-lg text-sm"
              />
              <input
                type="text"
                {...register(`ingredients.${index}.unit` as const)}
                placeholder="Unit (g, dl)"
                className="w-20 px-3 py-1.5 border rounded-lg text-sm"
              />
              {ingredientFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="text-red-500 hover:text-red-700 font-bold px-2"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => appendIngredient({ name: "", amount: "", unit: "g" })}
          className="mt-2 text-xs font-semibold text-amber-600 hover:text-amber-700"
        >
          ➕ Add ingredient
        </button>
      </div>

      {/* D. DYNAMIC INSTRUCTION LIST */}
      <div className="border-t pt-4">
        <h3 className="text-sm font-bold uppercase text-gray-700 mb-3">
          Procedure *
        </h3>
        <div className="space-y-3">
          {instructionFields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start">
              <span className="bg-gray-100 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-2">
                {index + 1}
              </span>
              <textarea
                {...register(`instructions.${index}.description` as const)}
                placeholder="Describe this step..."
                rows={1}
                className="flex-1 px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              {instructionFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  className="text-red-500 hover:text-red-700 font-bold px-2 mt-1"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            appendInstruction({
              step: instructionFields.length + 1,
              description: "",
            })
          }
          className="mt-2 text-xs font-semibold text-amber-600 hover:text-amber-700"
        >
          ➕ Add step
        </button>
      </div>

      {/* E. Buttons */}
      <div className="border-t pt-4 flex justify-end gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 bg-amber-600 text-white font-medium rounded-lg text-sm shadow hover:bg-amber-700 disabled:opacity-50 transition"
        >
          {isSubmitting
            ? "Saving..."
            : initialData
              ? "Update recipe"
              : "Save recipe"}
        </button>
      </div>
    </form>
  );
}
