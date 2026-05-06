import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClimaSense - Sistema de Monitoramento Climatico",
  description: "Sistema de monitoramento climatico em tempo real com sensores IoT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <main className="main-container">
          {children}
        </main>
      </body>
    </html>
  );
}
