import React from 'react';

interface PriceRangeInputsProps {
  index: number;
  required?: boolean;
  defaultValues?: {
    minQuantity: number;
    maxQuantity: number;
    price: number;
  };
}

export function PriceRangeInputs({ 
  index, 
  required = false, 
  defaultValues 
}: PriceRangeInputsProps) {
  const suffix = index === 1 ? '1' : '2';
  const placeholder = required ? '' : ' (optional)';

  return (
    <div className="grid grid-cols-3 gap-4">
      <input
        type="number"
        name={`minQuantity${suffix}`}
        placeholder={`Min Quantity${placeholder}`}
        required={required}
        defaultValue={defaultValues?.minQuantity}
        className="p-2 border rounded-lg"
      />
      <input
        type="number"
        name={`maxQuantity${suffix}`}
        placeholder={`Max Quantity${placeholder}`}
        required={required}
        defaultValue={defaultValues?.maxQuantity}
        className="p-2 border rounded-lg"
      />
      <input
        type="number"
        name={`price${suffix}`}
        placeholder={`Price${placeholder}`}
        required={required}
        defaultValue={defaultValues?.price}
        className="p-2 border rounded-lg"
      />
    </div>
  );
}