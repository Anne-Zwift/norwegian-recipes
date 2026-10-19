import { useRecipes } from "../../hooks/useRecipes";

// 1. Define a type-safe interface for the props coming from above
interface RecipeListProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  limit: number;
  searchTerm: string;
  category: string;
  difficulty: string;
  maxTime: number | null;
}

export default function RecipeList({
  page,
  setPage,
  limit,
  searchTerm,
  category,
  difficulty,
  maxTime,
}: RecipeListProps) {
  // 2. Call upon the (waiter) hook! It provides live statuses and data.
  const { data, isLoading, isError, error, isFetching } = useRecipes(
    page,
    limit,
    searchTerm,
    category,
    difficulty,
    maxTime,
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
      <div className="mb-6 flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {isFetching ? "Update results..." : "Search results"}
        </h2>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
          Showing {data?.data.length || 0} of {data?.meta.totalCount || 0}{" "}
          recipes.
        </span>
      </div>
      {/* If no recipes match the combination search */}
      {data?.data.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed my-8">
          <p className="text-gray-500 font-medium">
            No match found for this combination
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Try resetting some of the filters
          </p>
        </div>
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
