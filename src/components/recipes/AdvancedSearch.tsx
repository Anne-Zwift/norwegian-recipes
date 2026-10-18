import { useState, useEffect } from "react";
import { useDebounce } from "../../hooks/useDebounce";

// define what kind of filters this component should control and pass upwards
interface AdvancedSearchProps {
  onSearchChange: (filters: {
    searchTerm: string;
    category: string;
    difficulty: string;
    maxTime: number | null;
  }) => void;
}

export default function AdvancedSearch({
  onSearchChange,
}: AdvancedSearchProps) {
  // 1. Local states for each individual filter element (Requirement: Multiple filter types)
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [maxTime, setMaxTime] = useState<number | null>(null);

  // 2. Local storage for search history (Requirement: Search history)
  const [history, setHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem("recipe_search_history");
    return saved ? JSON.parse(saved) : [];
  });

  // REQUIREMENT: Debounced search input (Waits 400ms after the user has stopped typing)
  const debouncedSearchTerm = useDebounce(searchInput, 400);

  // 3. REQUIREMENT: Filter combination logic (Aggregates and synchronizes all filters upstream)
  useEffect(() => {
    onSearchChange({
      searchTerm: debouncedSearchTerm,
      category,
      difficulty,
      maxTime,
    });

    // add search history if the search is long enough and remember upto 5
    if (debouncedSearchTerm.trim().length >= 3) {
      const currentTerm = debouncedSearchTerm.trim();

      const historyTimer = setTimeout(() => {
        setHistory((prev) => {
          const filtered = prev.filter((item) => item !== currentTerm);
          const updated = [currentTerm, ...filtered].slice(0, 5);
          localStorage.setItem(
            "recipe_search_history",
            JSON.stringify(updated),
          );
          return updated;
        });
      }, 0);

      return () => clearTimeout(historyTimer);
    }
  }, [debouncedSearchTerm, category, difficulty, maxTime, onSearchChange]);

  // helper function to empty the history
  const clearHistory = () => {
    localStorage.removeItem("recipe_search_history");
    setHistory([]);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-4xl mx-auto mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        Advanced Search And Filter
      </h2>
      {/* Grid for the different filter types (Requirement: Multiple filter types) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* A. Text Search and Debounce */}
        <div className="md:col-span-2 flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">
            Search for a dish
          </label>
          <input
            type="text"
            placeholder="ex. Meatballs, Salad..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
          />
        </div>
        {/* B. Dropdown for category */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
          >
            <option value="">All Categories</option>
            <option value="meat">Meat</option>
            <option value="fish">Fish</option>
            <option value="vegan">Vegan</option>
          </select>
        </div>
        {/* B. Dropdown for difficulty */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
          >
            <option value="">All Levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Advanced</option>
          </select>
        </div>
      </div>
      {/* Additional filter line: Sorting/Filtering on preparation time */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <span className="text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
            Max cooking time:
          </span>
          <input
            type="range"
            min="0"
            max="120"
            step="15"
            value={maxTime || 0}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setMaxTime(val === 0 ? null : val);
            }}
            className="w-full md:w-48 accent-amber-500"
          />
          <span className="text-sm font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded">
            {maxTime ? `${maxTime} min` : "unlimited"}
          </span>
        </div>
        {/* Clear button for UX */}
        {(searchInput || category || difficulty || maxTime) && (
          <button
            onClick={() => {
              setSearchInput("");
              setCategory("");
              setDifficulty("");
              setMaxTime(null);
            }}
            className="text-xs font-medium text-gray-500 hover:text-amber-600 transition"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* D. Rendering search history-labels (Demand: Search history) */}
      {history.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-400">Last search:</span>
          {history.map((term, index) => (
            <button
              key={index}
              onClick={() => setSearchInput(term)}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-amber-100 hover:text-amber-800 transition"
            >
              {term}
            </button>
          ))}
          <button
            onClick={clearHistory}
            className="text-[10px] text-red-400 hover:text-red-600 underline ml-auto"
          >
            Clear search history
          </button>
        </div>
      )}
    </div>
  );
}
