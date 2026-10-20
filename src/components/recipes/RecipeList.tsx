import { useRef, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useInfiniteRecipes } from "../../hooks/useInfiniteRecipes";
import RecipeCard from "./RecipeCard";

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
      <div className="p-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-5 border rounded-lg bg-white animate-pulse min-h-55 flex flex-col justify-between"
          >
            <div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mt-4"></div>
          </div>
        ))}
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
                style={{ transform: `translateY(${virtualRow.start}px)` }}
              >
                {rowRecipes.map((recipe) => (
                  // maps out optimized RecipeCards!
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            );
          })}
        </div>
        {isFetchingNextPage && (
          <div className="text-center py-4 text-xs font-semibold text-amber-600 animate-pulse">
            🔄 Fetching more recipes...
          </div>
        )}
      </div>
    </div>
  );
}
