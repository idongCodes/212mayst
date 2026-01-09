import type { Metadata } from "next";
import "./globals.css"; 
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Header from "./components/Header"; 
import GlobalPlayer from "./components/GlobalPlayer"; // Import the Player

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
        <Header />

        {children}

        {/* The Global Music Player lives here */}
        <GlobalPlayer />

        <Footer />
        <Navigation />
      </body>
    </html>
  );
}