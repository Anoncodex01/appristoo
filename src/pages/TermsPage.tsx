import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { ScrollText } from 'lucide-react';

interface TermsSection {
  title: string;
  content: string;
}

const termsSections: TermsSection[] = [
  {
    title: "1. General Information",
    content: "Apristo is a marketplace that connects customers with high-quality international products. We are committed to offering you a seamless and efficient shopping experience. By using our platform, you agree to our terms outlined in this document."
  },
  {
    title: "2. Account and Registration",
    content: "To place an order with Apristo, you must register an account. You are responsible for maintaining the confidentiality of your account and password."
  },
  {
    title: "3. Orders and Payment",
    content: "All orders placed on Apristo are subject to availability. We accept multiple payment methods, including credit cards and mobile payments. Orders will not be processed until payment is confirmed."
  },
  {
    title: "4. Shipping and Delivery",
    content: "We aim to deliver all products within 24 hours. However, delivery times may vary depending on your location. Any delays or issues will be communicated promptly."
  },
  {
    title: "5. Returns and Cancellations",
    content: "We offer a 14-day return and exchange policy for products in their original condition. Cancellations can be made within 24 hours of placing an order."
  },
  {
    title: "6. Limitation of Liability",
    content: "Apristo is not liable for any damages or losses arising from the use of our products or services, except as required by law."
  },
  {
    title: "7. Modifications to Terms",
    content: "We reserve the right to update or modify these terms and conditions at any time. Please check this page periodically for updates."
  }
];

export function TermsPage() {
  return (
    <MainLayout>
      <div className="bg-white">
        {/* Header */}
        <div className="bg-purple-50">
          <div className="container mx-auto px-4 py-16 text-center">
            <ScrollText className="w-16 h-16 text-purple-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Please read these terms carefully before using our services
            </p>
          </div>
        </div>

        {/* Terms Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg">
              <p className="text-gray-600 mb-8">
                Welcome to Apristo. These terms and conditions outline the rules and regulations
                for the use of Apristo's website and services. By accessing or using our services,
                you agree to comply with these terms.
              </p>

              <div className="space-y-8">
                {termsSections.map((section, index) => (
                  <div key={index} className="bg-white rounded-xl">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                      {section.title}
                    </h2>
                    <p className="text-gray-600">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* Last Updated */}
              <div className="mt-16 pt-8 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}