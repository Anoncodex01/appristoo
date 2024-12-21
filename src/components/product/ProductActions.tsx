import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';
import { CONTACT_INFO } from '../../config/constants';

interface ProductActionsProps {
  productName: string;
  productId: string;
  productDescription: string;
}

export function ProductActions({ productName, productId, productDescription }: ProductActionsProps) {
  const handleCall = () => {
    window.location.href = `tel:${CONTACT_INFO.phone}`;
  };

  const handleMessage = () => {
    // Format the message with product details
    const message = encodeURIComponent(
      `Hi, I'm interested in purchasing:\n\n` +
      `Product: ${productName}\n` +
      `ID: ${productId}\n\n` +
      `Please provide more information about pricing and availability.`
    );
    
    // Create WhatsApp URL with formatted message
    window.location.href = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${message}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <button
        onClick={handleCall}
        className="w-full bg-purple-600 text-white px-6 py-4 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-3 transition-colors"
      >
        <Phone className="w-5 h-5" />
        Call to Order
      </button>
      <button
        onClick={handleMessage}
        className="w-full border-2 border-black text-black px-6 py-4 rounded-lg hover:bg-black hover:text-white flex items-center justify-center gap-3 transition-colors"
      >
        <MessageSquare className="w-5 h-5" />
        Message on WhatsApp
      </button>
    </div>
  );
}