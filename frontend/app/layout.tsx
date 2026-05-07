import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ClimaSense - Monitoramento Climático',
  description: 'Sistema de monitoramento climático em tempo real',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
