import React from 'react';
import { MainHeader } from '../components/header/MainHeader';
import { Footer } from '../components/footer/FooterSection';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      <main className="flex-grow bg-gray-50">
        {children}
      </main>
      <Footer />
    </div>
  );
}