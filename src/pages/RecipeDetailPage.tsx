import { useParams } from "@tanstack/react-router";

export default function RecipeDetailPage() {
  // TanStack Router automatically extracts the ID from the URL in a type-safe way!
  const { recipeId } = useParams({ from: "/recipes/$recipeId" });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900">Recipe Details</h2>
      <p className="text-sm text-gray-500 mt-2">
        Now showing recipe with ID:{" "}
        <code className="bg-gray-100 px-2 py-1 rounded font-mono text-amber-700">
          {recipeId}
        </code>
      </p>
    </div>
  );
}
