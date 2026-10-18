import { useState } from "react";
import { useRecipes } from "../../hooks/useRecipes";

export default function RecipeList() {
  // 1. Local state for pagination and search (hook up the URL router later)
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const limit = 1;

  // 2. Call upon the (waiter) hook! It provides live statuses and data.
  const { data, isLoading, isError, error, isFetching } = useRecipes(
    page,
    limit,
    searchTerm,
    category,
  );
  // Handling the initial loading state (Requirement: "Simulate network delays")
  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500 animate-pulse">
        <p className="text-xl font-semibold">Fetching recipes...</p>
        <p className="text-sm">
          Waiting for the simulated server response (600ms)
        </p>
      </div>
    );
  }

  // Robust error handling (Requirement: "Simulate occasional errors")
  if (isError) {
    return (
      <div className="p-6 my-4 bg-red-50 border border-red-200 rounded-md text-red-700">
        <h3 className="font-bold text-lg">Oops! Something went wrong</h3>
        <p className="text-sm">
          {error instanceof Error ? error.message : "Unknown Error"}
        </p>
        <button
          onClick={() => setPage(page)} // force re-fetch
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Explore Recipes</h2>

        <div className="flex gap-2 w-full md:w-auto">
          {/* New DROPDOWN to TEST SETCATEGORY: */}
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1); // Reset to page 1 when a new filter is applied
            }}
            className="px-3 py-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">All categories</option>
            <option value="meat">Meat</option>
            <option value="fish">Fish</option>
            <option value="vegan">Vegan</option>
          </select>

          {/* Simple search field to test the search logic in our API live */}
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset to page 1 for new search
            }}
            className="px-4 py-2 border rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* If no search matches */}
      {data?.data.length === 0 && (
        <p className="text-center text-gray-500 my-8">
          No recipes matched your search.
        </p>
      )}

      {/* Recipe List */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-100 transition-opacity duration-200"
        style={{ opacity: isFetching ? 0.7 : 1 }}
      >
        {data?.data.map((recipe) => (
          <div
            key={recipe.id}
            className="p-5 border rounded-lg shadow-sm hover:shadow-md transition bg-white flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-semibold uppercase px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                {recipe.category}
              </span>
              <h3 className="text-xl font-semibold mt-2 text-gray-800">
                {recipe.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {recipe.description}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t flex justify-between text-xs text-gray-500">
              <span>⏱️ {recipe.cookingTime} min</span>
              <span>📊 {recipe.difficulty}</span>
              <span>👤 {recipe.author.name}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination-Controller (Demand: "Include pagination parameters") */}
      {data?.meta && data.meta.pageCount > 1 && (
        <div className="flex justify-center items-center mt-8 gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 font-medium transition"
          >
            Previous
          </button>
          <span className="text-sm font-medium text-gray-700">
            Side {data.meta.currentPage} of {data.meta.pageCount}
          </span>
          <button
            disabled={!data.meta.hasMore}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 font-medium transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
