import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type PropsWithChildren, useEffect, useMemo, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export function AppProviders({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 20,
            retry: 1
          }
        }
      }),
    []
  );

  useEffect(() => {
    useAuthStore
      .getState()
      .initialize()
      .finally(() => setReady(true));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {ready ? children : <div className="grid min-h-screen place-items-center text-slate-600 dark:text-slate-300">Starting Retail Pocket...</div>}
      </BrowserRouter>
    </QueryClientProvider>
  );
}
