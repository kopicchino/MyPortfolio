"use client";

/**
 * app/providers.tsx
 * Global context providers wrapped around the entire application.
 * Includes: SessionProvider (NextAuth), ThemeProvider, React Hot Toast.
 */

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange={false}
      >
        {children}
        <Toaster
          position="bottom-right"
          gutter={12}
          containerStyle={{ bottom: 24, right: 24 }}
          toastOptions={{
            duration: 4000,
            style: {
              background: "var(--bg-card)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
              fontSize: "14px",
              fontFamily: "Inter, sans-serif",
              boxShadow: "var(--shadow-lg)",
              padding: "12px 16px",
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "#ffffff" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#ffffff" },
              duration: 5000,
            },
          }}
        />
      </ThemeProvider>
    </SessionProvider>
  );
}
