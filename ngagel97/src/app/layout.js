"use client";
import "./globals.css";
import dynamic from "next/dynamic";

// Import NavbarDynamic
const NavbarDynamic = dynamic(() => import("./components/NavbarDynamic"), {
  ssr: false,
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Gunakan NavbarDynamic */}
        <NavbarDynamic />
        {children}
      </body>
    </html>
  );
}
