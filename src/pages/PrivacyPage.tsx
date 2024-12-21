import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Shield } from 'lucide-react';

interface PrivacySection {
  title: string;
  content: string;
}

const privacySections: PrivacySection[] = [
  {
    title: "1. Information We Collect",
    content: "When you use our website or services, we may collect personal information such as your name, email address, shipping address, and payment information. This data is used to process your orders and improve your shopping experience."
  },
  {
    title: "2. How We Use Your Information",
    content: "We use your personal information to process and fulfill your orders, communicate with you about your orders, improve our services and website functionality, and send promotional materials (with your consent)."
  },
  {
    title: "3. Data Security",
    content: "We use encryption and secure payment systems to ensure that your information is safe. We will never sell or rent your personal data to third parties without your consent."
  },
  {
    title: "4. Cookies",
    content: "We use cookies to enhance your browsing experience on our website. Cookies help us personalize content and track website traffic."
  },
  {
    title: "5. Your Rights",
    content: "You have the right to access, correct, or delete your personal data. You can contact us at any time to request these changes."
  },
  {
    title: "6. Changes to This Policy",
    content: "We may update this Privacy Policy from time to time. Any changes will be posted on this page, so please check back periodically."
  }
];

export function PrivacyPage() {
  return (
    <MainLayout>
      <div className="bg-white">
        {/* Header */}
        <div className="bg-purple-50">
          <div className="container mx-auto px-4 py-16 text-center">
            <Shield className="w-16 h-16 text-purple-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your Privacy Matters to Us
            </p>
          </div>
        </div>

        {/* Privacy Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg">
              <p className="text-gray-600 mb-8">
                At Apristo, we value your privacy and are committed to protecting your personal 
                information. This Privacy Policy outlines how we collect, use, and safeguard your data.
              </p>

              <div className="space-y-8">
                {privacySections.map((section, index) => (
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

              {/* Contact Section */}
              <div className="mt-16 p-8 bg-purple-50 rounded-2xl">
                <h2 className="text-2xl font-bold mb-4">Questions About Privacy?</h2>
                <p className="text-gray-600 mb-8">
                  If you have any questions about our privacy practices, please don't hesitate to contact us.
                </p>
                <a
                  href="mailto:privacy@apristo.com"
                  className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  Contact Privacy Team
                </a>
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