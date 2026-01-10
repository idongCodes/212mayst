/**
 * file: app/layout.tsx
 * description: Wrapped children in RouteGuard to enforce access control.
 */

import type { Metadata } from "next";
import "./globals.css"; 
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Header from "./components/Header"; 
import AutoLogout from "./components/AutoLogout"; 
import RouteGuard from "./components/RouteGuard"; // <--- Import the Guard

export const metadata: Metadata = {
  title: "212 May Street",
  description: "A web app for 212 May Street housemates.",
  icons: {
    icon: '/logo+favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Handles 15-min inactivity logout */}
        <AutoLogout />

        {/* Protects routes based on login status */}
        <RouteGuard>
          <Header />
          
          {children}

          <Footer />
          <Navigation />
        </RouteGuard>
      </body>
    </html>
  );
}