import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Truck, Clock, MapPin, AlertCircle, Package } from 'lucide-react';

interface ShippingSection {
  title: string;
  content: string;
  icon: React.ReactNode;
}

const shippingSections: ShippingSection[] = [
  {
    title: "1. Shipping Speed",
    content: "We offer fast, 24-hour delivery to most locations. Depending on your location, delivery may take longer, but we will always provide you with an estimated delivery time at checkout.",
    icon: <Clock className="w-8 h-8 text-purple-600" />
  },
  {
    title: "2. Shipping Costs",
    content: "Shipping fees are calculated based on your order size, weight, and delivery location. You'll be able to view the exact shipping cost at checkout before you complete your purchase.",
    icon: <Package className="w-8 h-8 text-purple-600" />
  },
  {
    title: "3. Tracking Your Order",
    content: "Once your order is shipped, we will send you a tracking number so you can follow your package's journey from our warehouse to your doorstep.",
    icon: <Truck className="w-8 h-8 text-purple-600" />
  },
  {
    title: "4. Delivery Areas",
    content: "We currently offer shipping to most African countries. If you are unsure if we deliver to your location, please contact us for confirmation.",
    icon: <MapPin className="w-8 h-8 text-purple-600" />
  },
  {
    title: "5. Shipping Issues",
    content: "In case of any delays or issues with your shipment, we will promptly inform you and work to resolve the matter as quickly as possible.",
    icon: <AlertCircle className="w-8 h-8 text-purple-600" />
  }
];

export function ShippingPage() {
  return (
    <MainLayout>
      <div className="bg-white">
        {/* Header */}
        <div className="bg-purple-50">
          <div className="container mx-auto px-4 py-16 text-center">
            <Truck className="w-16 h-16 text-purple-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Information</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fast and Reliable Shipping with Apristo
            </p>
          </div>
        </div>

        {/* Shipping Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg">
              <p className="text-gray-600 mb-12">
                At Apristo, we strive to get your orders to you as quickly as possible. 
                Here's everything you need to know about our shipping process.
              </p>

              <div className="space-y-12">
                {shippingSections.map((section, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-purple-50 rounded-lg">
                        {section.icon}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                          {section.title}
                        </h2>
                        <p className="text-gray-600">
                          {section.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Section */}
              <div className="mt-16 p-8 bg-purple-50 rounded-2xl text-center">
                <h2 className="text-2xl font-bold mb-4">Need Help with Shipping?</h2>
                <p className="text-gray-600 mb-8">
                  Our customer service team is here to help with any shipping-related questions.
                </p>
                <a
                  href="mailto:shipping@apristo.com"
                  className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  Contact Shipping Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}