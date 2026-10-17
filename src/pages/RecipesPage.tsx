import RecipeList from "../components/recipes/RecipeList";

export default function RecipesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      {/* Now our recipe list lives safely on its own dedicated URL page! */}
      <RecipeList />
    </div>
  );
}
