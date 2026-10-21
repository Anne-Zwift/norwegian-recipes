import { Outlet, Link } from "@tanstack/react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ErrorBoundary from "./components/common/ErrorBoundary";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* 1. Global Navigation Bar that appears on ALL pages */}
      <header className="bg-white border-b py-4 px-6 mb-6 shadow-sm">
        <nav className="max-w-4xl mx-auto flex justify-between items-center">
          <Link
            to="/"
            className="text-xl font-bold text-amber-600 [&.active]:text-amber-800"
          >
            Norwegian Recipes
          </Link>
          <div className="flex gap-4 text-sm font-medium">
            <Link
              to="/recipes"
              className="text-gray-600 hover:text-amber-600 [&.active]:font-bold [&.active]:text-amber-600"
            >
              Recipes
            </Link>
            <Link
              to="/recipes/create"
              className="px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-semibold text-xs shadow-sm [&.active]:bg-amber-800"
            >
              ➕ Add Recipe
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-1">
        {/* Main content secured with ErrorBoundary */}
        {/* The new engine—test it live on screen! */}
        {/* SAFEGUARD 1: If a subpage crashes, the top menu remains visible above the error screen! */}
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      {/* The cache developer tool is safely located at the bottom */}
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  );
}

export default App;
