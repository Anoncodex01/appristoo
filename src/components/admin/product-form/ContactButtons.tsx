import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';
import { CONTACT_INFO } from '../../../config/constants';

interface ContactButtonsProps {
  productName: string;
  productId: string;
}

export function ContactButtons({ productName, productId }: ContactButtonsProps) {
  const handleCall = () => {
    window.location.href = `tel:${CONTACT_INFO.phone}`;
  };

  const handleMessage = () => {
    const message = encodeURIComponent(
      `Hello, I'm interested in ${productName} (ID: ${productId}). Please provide more information.`
    );
    window.location.href = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${message}`;
  };

  return (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={handleCall}
        className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
      >
        <Phone className="w-4 h-4" />
        Call to Order
      </button>
      <button
        type="button"
        onClick={handleMessage}
        className="flex-1 border-2 border-black text-black px-4 py-2 rounded-lg hover:bg-black hover:text-white flex items-center justify-center gap-2 transition-colors"
      >
        <MessageSquare className="w-4 h-4" />
        Message on WhatsApp
      </button>
    </div>
  );
}