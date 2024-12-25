import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { SearchDropdown } from './SearchDropdown';

export function MainHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="relative">
      {/* Main Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            {/* Spacer div for mobile layout */}
            <div className="w-[40px] md:hidden"></div>

            {/* Logo */}
            <a href="/" className="h-12">
              <img 
                src="https://i.imgur.com/KxwIWrp.png" 
                alt="Apristo" 
                className="h-full w-auto"
              />
            </a>

            {/* Center Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-500 rounded-full w-[400px] hover:bg-gray-100 transition-colors"
            >
              <Search className="w-5 h-5" />
              <span className="text-sm">Search products...</span>
            </button>

            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-700"
            >
              <Search className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/30 z-50">
          <div className="container mx-auto px-4 pt-16">
            <div className="relative bg-white rounded-lg shadow-xl p-4">
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
              <SearchDropdown onClose={() => setIsSearchOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}