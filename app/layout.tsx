import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hanami Glamour',
  description: 'Cosméticos e acessórios femininos e infantis.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
