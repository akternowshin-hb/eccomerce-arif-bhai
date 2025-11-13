import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/components/Provider/Authcontext";
import { CartProvider } from "@/components/Provider/CartContext";
import { FavoritesProvider } from "@/components/Provider/FavoritesContext";
import ConditionalLayout from "@/components/ConditionalLayout";


// Load Geist Sans locally
const geistSans = localFont({
  src: "../../public/fonts/GeistVF.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
});

// Load Geist Mono locally
const geistMono = localFont({
  src: "../../public/fonts/GeistMonoVF.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "LungiLok - Traditional Clothing Store",
  description: "Shop for authentic Lungi and Panjabi collections",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <FavoritesProvider>
            <CartProvider>
              <ConditionalLayout>{children}</ConditionalLayout>
            </CartProvider>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}