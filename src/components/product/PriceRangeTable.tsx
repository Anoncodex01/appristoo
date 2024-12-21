import React from 'react';
import { PriceRange } from '../../types';
import { formatPrice, formatQuantityRange } from '../../utils/formatting';

interface PriceRangeTableProps {
  priceRanges: PriceRange[];
}

export function PriceRangeTable({ priceRanges }: PriceRangeTableProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h2 className="text-lg font-semibold mb-3">Price Ranges</h2>
      {priceRanges.map((range, index) => (
        <div key={index} className="flex justify-between py-2 border-b last:border-0">
          <span>{formatQuantityRange(range)}</span>
          <span className="font-semibold">{formatPrice(range.price)}</span>
        </div>
      ))}
    </div>
  );
}