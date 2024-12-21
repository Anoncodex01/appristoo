import React from 'react';

interface ProductSpecificationsProps {
  specifications: string[];
}

export function ProductSpecifications({ specifications }: ProductSpecificationsProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Specifications</h2>
      <ul className="list-disc list-inside text-gray-600">
        {specifications.map((spec, index) => (
          <li key={index}>{spec}</li>
        ))}
      </ul>
    </div>
  );
}