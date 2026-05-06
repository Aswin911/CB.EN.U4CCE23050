import React from "react";
import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import CssBaseline from "@mui/material/CssBaseline";

export const metadata: Metadata = {
  title: "Campus Notifications",
  description: "Campus notification platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <CssBaseline />
          <Navbar />
          <main style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
            {children}
          </main>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
