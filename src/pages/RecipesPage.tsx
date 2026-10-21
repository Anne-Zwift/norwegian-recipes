import { useState, useCallback } from "react";
import AdvancedSearch from "../components/recipes/AdvancedSearch";
import RecipeList from "../components/recipes/RecipeList";
import ErrorBoundary from "../components/common/ErrorBoundary";

export default function RecipesPage() {
  // 1. Central states that consolidate all filter selections in one place
  const [filters, setFilters] = useState({
    searchTerm: "",
    category: "",
    difficulty: "",
    maxTime: null as number | null,
  });

  // Helper function called every time a filter changes in AdvancedSearch
  const handleFilterChange = useCallback(
    (newFilters: {
      searchTerm: string;
      category: string;
      difficulty: string;
      maxTime: number | null;
    }) => {
      setFilters(newFilters);
    },
    [],
  );

  return (
    <div className="min-h-screen bg-gray-50 py- px-4">
      <div className="max-w-4xl mx-auto mb-6 text-center md:text-left">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Norwegian recipes
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Combine searches, categories, and difficulty levels in real time.
        </p>
      </div>
      {/* 2. THE CONTROL PANEL: Receives the function that listens for changes */}
      <AdvancedSearch onSearchChange={handleFilterChange} />

      {/* 3. THE DISPLAY LIST: Pass all the new filters in as props! */}
      {/* Since the state has been moved up, we need to adjust RecipeList to accept these as props. */}
      {/* SAFEGUARD 2: Isolation at the component level in RecipesPage.tsx */}
      <ErrorBoundary
        fallback={
          <div className="p-6 text-center text-red-500 font-medium border border-dashed rounded-xl bg-red-50">
            Unable to generate the recipe list right now.
          </div>
        }
      >
        <RecipeList
          searchTerm={filters.searchTerm}
          category={filters.category}
          difficulty={filters.difficulty}
          maxTime={filters.maxTime}
        />
      </ErrorBoundary>
    </div>
  );
}
