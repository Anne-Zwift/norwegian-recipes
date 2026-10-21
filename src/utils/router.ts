import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { createElement } from "react";
import App from "../App"; // App.tsx acts as a shell/layout (Root Route)
import HomePage from "../pages/HomePage";
import RecipesPage from "../pages/RecipesPage";
import RecipeDetailPage from "../pages/RecipeDetailPage";
import CreateRecipePage from "../pages/CreateRecipePage";
import EditRecipePage from "../pages/EditRecipePage";
import ErrorBoundary from "../components/common/ErrorBoundary";

// Refactor: A functional wrapper that satisfies TanStack Router's 'ErrorRouteComponent' type
function RootErrorComponent({ error }: { error: unknown }) {
  return createElement(
    ErrorBoundary,
    null,
    createElement(function ThrowErrorComponent() {
      throw error;
    }),
  );
}

// 1. Define the root route (our shell, which owns the navigation bar and the <Outlet />)
// attaches the error handling directly to the root route
const rootRoute = createRootRoute({
  component: App,
  // If a catastrophic error occurs during routing or data flow,
  // TanStack Router will automatically roll out your error boundary as a safety net!
  errorComponent: RootErrorComponent,
});

// 2. Define the specific pages from your `pages` folder as routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const recipesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/recipes",
  component: RecipesPage,
});

const recipeDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/recipes/$recipeId", // Dynamic ID parameter (Requirement: GET /recipes/:id)
  component: RecipeDetailPage,
});

const createRecipeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/recipes/create",
  component: CreateRecipePage,
});

const editRecipeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/recipes/$recipeId/edit",
  component: EditRecipePage,
});

// 3. Assemble the route tree exactly as TanStack requires
const routeTree = rootRoute.addChildren([
  indexRoute,
  recipesRoute,
  recipeDetailRoute,
  createRecipeRoute,
  editRecipeRoute,
]);

// 4. Create and export the router instance itself
export const router = createRouter({ routeTree });

// Register the router for full type safety throughout the app (so that Link knows which URLs exist)
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
