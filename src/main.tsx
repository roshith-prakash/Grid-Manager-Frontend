import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DarkModeProvider } from "./context/DarkModeContext.tsx";
import { Toaster } from "react-hot-toast";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.tsx";
import { UserProvider } from "./context/UserContext.tsx";
import { NextRaceProvider } from "./context/NextRaceContext.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Allows for DarkMode usage */}
    <DarkModeProvider>
      {/* Adds tanstack query */}
      <QueryClientProvider client={queryClient}>
        {/* Providing auth context to children */}
        <AuthProvider>
          {/* Providing Db user data to children */}
          <UserProvider>
            {/* Provides next race data to all components */}
            <NextRaceProvider>
              <Toaster />
              <App />
            </NextRaceProvider>
          </UserProvider>
        </AuthProvider>
      </QueryClientProvider>
    </DarkModeProvider>
  </StrictMode>
);
