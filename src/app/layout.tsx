import type { Metadata } from "next";
import { Inter, Source_Code_Pro, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Portfolio",
  description: "Welcome to my personal website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${sourceCodePro.variable} ${playfair.variable} antialiased min-h-screen bg-gray-50`}
      >
        <Providers>
          <Navbar />
          <main className="max-w-full mx-auto px-2 py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
