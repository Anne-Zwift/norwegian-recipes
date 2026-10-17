import RecipeList from "./components/recipes/RecipeList";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b py-4 px-6 mb-6 shadow-sm">
        <h1 className="text-xl font-bold max-w-4xl mx-auto text-amber-600">
          Norwegian Recipes
        </h1>
      </header>
      <main>
        {/* The new engine—test it live on screen! */}
        <RecipeList />
      </main>
    </div>
  );
}

export default App;
