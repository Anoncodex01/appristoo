import React, { useState } from 'react';
import { Heart, Search, X } from 'lucide-react';
import { SearchDropdown } from './SearchDropdown';
import { useWishlist } from '../../hooks/useWishlist';

export function MainHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { wishlistCount } = useWishlist();

  return (
    <header className="relative">
      {/* Main Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
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

            {/* Wishlist */}
            <a
              href="/wishlist"
              className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <Heart className="w-6 h-6" />
              {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {wishlistCount}
              </span>
              )}
            </a>
          </div>
        </div>
      </div>

      {/* Search Dropdown */}
      {isSearchOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsSearchOpen(false)} />
          <div className="absolute top-0 inset-x-0 bg-white shadow-lg z-50 transform transition-transform duration-200">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
                <SearchDropdown onClose={() => setIsSearchOpen(false)} />
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}