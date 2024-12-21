import React from 'react';
import { Search, MapPin } from 'lucide-react';

export function SearchHeader() {
  return (
    <div className="bg-black text-white py-4">
      <div className="container mx-auto px-4">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold">apristo</h1>
          <p className="text-sm text-purple-300">Tanzania's lowest prices - we won't be beaten on your weekly shop</p>
        </div>
        <form className="relative flex items-center">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="I'm looking for ..."
              className="w-full pl-12 pr-32 py-3 border border-purple-600 bg-white text-black rounded-lg focus:outline-none focus:border-purple-400"
            />
            <div className="absolute right-0 top-0 h-full flex items-center pr-4 border-l border-gray-200">
              <div className="flex items-center gap-2 text-gray-500 cursor-pointer hover:text-purple-600">
                <MapPin className="w-5 h-5" />
                <span>Location</span>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="ml-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-colors"
          >
            <Search className="w-5 h-5" />
            <span>Search</span>
          </button>
        </form>
      </div>
    </div>
  );
}