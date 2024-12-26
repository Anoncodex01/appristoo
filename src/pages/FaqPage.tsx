import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "What products do you offer?",
    answer: "We offer a wide range of high-quality international products, including electronics, fashion, beauty products, home goods, health supplements, and more. All items are curated to meet our high standards for quality and value."
  },
  {
    question: "How long does delivery take?",
    answer: "Our standard delivery time is 1-3 hours from order confirmation for most locations. We prioritize fast delivery to ensure you receive your products as quickly as possible."
  },
  {
    question: "What shipping methods do you use?",
    answer: "We use reliable local courier services that specialize in fast, same-day deliveries. This ensures your products arrive quickly and safely."
  },
  {
    question: "Do you deliver to my country?",
    answer: "Yes, we currently deliver to a wide range of African countries. Please check our shipping page for specific locations."
  },
  {
    question: "How do I track my order?",
    answer: "Once your order is dispatched, you'll receive a tracking number via email and SMS. You can use this to track your delivery in real-time."
  },
  {
    question: "What is your return policy?",
    answer: "We offer returns and exchanges within 14 days of receipt, provided the items are in original condition. Please refer to our Returns & Exchanges policy for more details."
  },
  {
    question: "How do I contact customer service?",
    answer: "You can reach our customer service team 24/7 through WhatsApp, phone, or email. We typically respond within minutes to ensure you get the help you need quickly."
  },
  {
    question: "Is my personal information safe with you?",
    answer: "Yes! We take your privacy seriously. Please review our Privacy Policy for more details on how we protect your information."
  }
];

export function FaqPage() {
  return (
    <MainLayout>
      <div className="bg-white">
        {/* Header */}
        <div className="bg-purple-50">
          <div className="container mx-auto px-4 py-16 text-center">
            <HelpCircle className="w-16 h-16 text-purple-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our services, shipping, and policies
            </p>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            {/* Contact Section */}
            <div className="mt-16 text-center p-8 bg-purple-50 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
              <p className="text-gray-600 mb-8">
                Can't find the answer you're looking for? Please contact our customer support team.
              </p>
              <a
                href="mailto:support@apristo.com"
                className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}