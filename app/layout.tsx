import type { Metadata } from "next";
import "./globals.css"; 
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Header from "./components/Header"; // Import the new component

export const metadata: Metadata = {
  title: "212 May Street",
  description: "A web app for 212 May Street housemates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* New Client Header handles logic for Home vs Pages */}
        <Header />

        {children}

        <Footer />
        <Navigation />
      </body>
    </html>
  );
}