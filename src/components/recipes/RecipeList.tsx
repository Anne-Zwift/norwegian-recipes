import { useRef, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Link } from "@tanstack/react-router";
import { useInfiniteRecipes } from "../../hooks/useInfiniteRecipes";

interface RecipeListProps {
  searchTerm: string;
  category: string;
  difficulty: string;
  maxTime: number | null;
}

export default function RecipeList({
  searchTerm,
  category,
  difficulty,
  maxTime,
}: RecipeListProps) {
  // 1. connecting to the infinite data engine!
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteRecipes({
    searchTerm,
    category,
    difficulty,
    maxTime,
    limit: 6,
  });

  // 2. FLATTEN THE DATA:
  // Since useInfiniteQuery returns pages containing arrays, merge them into one long, combined array!
  const allRecipes = data ? data.pages.flatMap((page) => page.data) : [];

  // 3. This is the scroll window (the viewport container)
  const parentRef = useRef<HTMLDivElement>(null);

  // 4. THE VIRTUALIZATION ENGINE:
  // Calculates rows based on 2 columns in a grid (number of elements divided by 2)
  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(allRecipes.length / 2),
    getScrollElement: () => parentRef.current,
    estimateSize: () => 240, // The height of a card in pixels
    overscan: 2, // Renders 2 extra rows in the buffer for silky-smooth scrolling
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  // 5. AUTOMATIC PRE-FETCHING (Infinite scrolling):
  // Monitors the rows being rendered. If the very last virtual row appears on the screen,
  // TanStack Query automatically requests the next page from the simulated server!
  useEffect(() => {
    if (virtualItems.length === 0) return;

    const lastItem = virtualItems[virtualItems.length - 1];
    const totalRows = Math.ceil(allRecipes.length / 2);

    // If the user approaches the bottom, there is more data, and we are not already fetching:
    if (lastItem.index >= totalRows - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [
    virtualItems,
    allRecipes.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  if (isLoading) {
    return (
      <div className="p-12 text-center text-gray-500 animate-pulse font-medium">
        Loading recipes...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-12 text-center text-red-500 font-medium">
        Could not fetch:{" "}
        {error instanceof Error ? error.message : "Unknown Error"}
      </div>
    );
  }

  if (allRecipes.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-dashed my-8 max-w-4xl mx-auto">
        <p className="text-gray-500 font-medium">
          No recipes matched this filter combination.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-4 flex justify-between items-center pb-2 border-b">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Infinite Scrolling & DOM Virtualization Active
        </span>
        <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
          Show {allRecipes.length} dishes
        </span>
      </div>

      {/* THE SCROLLING WINDOW (Viewport): Must have a fixed height and overflow-y-auto */}
      <div
        ref={parentRef}
        className="border rounded-xl bg-gray-50 p-4 shadow-inner overflow-y-auto"
        style={{ height: "600px" }}
      >
        {/* TOTAL-HEIGHT CONTAINER: Simulates the actual length of the scrollbar */}
        <div
          className="w-full relative"
          style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        >
          {/* MAPPING OF THE VIRTUAL ROWS: Only the visible elements are present in the HTML code */}
          {virtualItems.map((virtualRow) => {
            const firstIndex = virtualRow.index * 2;
            const rowRecipes = allRecipes.slice(firstIndex, firstIndex + 2);

            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                className="absolute top-0 left-0 w-full grid grid-cols-1 md:grid-cols-2 gap-4 pb-4"
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {rowRecipes.map((recipe) => (
                  <Link
                    to="/recipes/$recipeId"
                    params={{ recipeId: recipe.id }}
                    key={recipe.id}
                    className="p-5 border rounded-lg shadow-sm hover:shadow-md transition bg-white flex flex-col justify-between text-left cursor-pointer hover:border-amber-500 min-h-55"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                        {recipe.category}
                      </span>
                      <h3 className="text-lg font-bold mt-2 text-gray-800 line-clamp-1">
                        {recipe.title}
                      </h3>
                      <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                        {recipe.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t flex justify-between items-center text-[11px] text-gray-500">
                      <div className="flex gap-2">
                        <span>⏱️ {recipe.cookingTime} min</span>
                        <span>📊 {recipe.difficulty}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px]">
                        ✏️ Edit card
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            );
          })}
        </div>

        {/* Loading indicator at the bottom of the scroll container when new pages are fetched silently */}
        {isFetchingNextPage && (
          <div className="text-center py-4 text-xs font-semibold text-amber-600 animate-pulse">
            🔄 Retrieving more recipes from the server...
          </div>
        )}
      </div>
    </div>
  );
}
