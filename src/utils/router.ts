import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import App from "../App"; // App.tsx acts as a shell/layout (Root Route)
import HomePage from "../pages/HomePage";
import RecipesPage from "../pages/RecipesPage";
import RecipeDetailPage from "../pages/RecipeDetailPage";
import CreateRecipePage from "../pages/CreateRecipePage";
import EditRecipePage from "../pages/EditRecipePage";

// 1. Define the root route (our shell, which owns the navigation bar and the <Outlet />)
const rootRoute = createRootRoute({
  component: App,
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
