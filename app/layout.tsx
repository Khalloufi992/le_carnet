import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Le Carnet | الدفتر",
  description: "Your personal notebook - دفترك الشخصي",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
