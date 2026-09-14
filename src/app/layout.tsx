import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Overlay4S2 (JhayR)",
  description: "Sellable stream overlay — red/blue folded bar + pool balls",
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
