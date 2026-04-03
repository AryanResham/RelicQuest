import { RouterProvider } from "react-router-dom";
import Router from "./router";
import AuthContextProvider from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ErrorBoundary from "./components/ErrorBoundary";
import { useBidRealtime } from "./hooks/useBidRealtime";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function RealtimeProvider({ children }: { children: React.ReactNode }) {
  useBidRealtime();
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RealtimeProvider>
          <AuthContextProvider>
            <RouterProvider router={Router} />
          </AuthContextProvider>
        </RealtimeProvider>
      </ErrorBoundary>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
