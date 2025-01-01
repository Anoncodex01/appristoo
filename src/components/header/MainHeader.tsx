import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { SearchDropdown } from './SearchDropdown';

export function MainHeader() {
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useProducts();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        if (window.location.pathname === '/search') {
          navigate(-1);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navigate]);

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value) {
      navigate('/search');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
    if (window.location.pathname === '/search') {
      navigate(-1);
    }
  };

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
            <div ref={searchRef} className="relative hidden md:block flex-1 max-w-[400px]">
              {!isSearchOpen ? (
                <button
                  onClick={handleSearchClick}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-500 rounded-full w-full hover:bg-gray-100 transition-colors"
                >
                  <Search className="w-5 h-5" />
                  <span className="text-sm">Search products...</span>
                </button>
              ) : (
                <div className="relative w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search products..."
                    className="w-full px-4 py-2 pl-10 pr-10 bg-gray-50 text-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-[#631D63] focus:bg-white transition-colors"
                    autoFocus
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
            </div>

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