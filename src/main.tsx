import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./utils/queryClient.ts";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./utils/router.ts";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    }
  </StrictMode>,
);
