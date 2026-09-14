import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Overlay4S2",
  description: "Sellable stream overlays — JhayR and Anthony pairs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
