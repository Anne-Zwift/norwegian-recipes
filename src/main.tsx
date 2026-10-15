import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./utils/queryClient.ts";

//import { RouterProvider, createRouter } from '@tanstack/react-router';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {
      <QueryClientProvider client={queryClient}>
        {/*<RouterProvider router={router} />*/}
        <div>
          <h1>Norwegian Recipes</h1>
          <p>Routing and TanStack Query in main.tsx</p>
        </div>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    }
    <App />
  </StrictMode>,
);
