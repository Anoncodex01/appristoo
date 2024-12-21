import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Truck, Shield, DollarSign, Package } from 'lucide-react';

export function AboutPage() {
  const features = [
    {
      icon: <Truck className="w-8 h-8 text-purple-600" />,
      title: "Fast Delivery",
      description: "Get your order delivered within 24 hours"
    },
    {
      icon: <DollarSign className="w-8 h-8 text-purple-600" />,
      title: "Affordable Prices",
      description: "We strive to offer competitive pricing on all our products"
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      title: "Top-Quality Products",
      description: "We carefully select only the best for our customers"
    },
    {
      icon: <Package className="w-8 h-8 text-purple-600" />,
      title: "International Selection",
      description: "Access to premium products from around the world"
    }
  ];

  return (
    <MainLayout>
      <div className="bg-white">
        <div className="bg-purple-50">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Apristo</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your gateway to premium international products, delivered right to your doorstep in Africa
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg">
              <p className="text-gray-600 mb-8">
                Apristo is a dynamic marketplace committed to making high-quality international products 
                accessible to Africans. Our mission is to bridge the gap between overseas markets and 
                African consumers by providing fast, reliable, and affordable shipping of premium products 
                directly to your doorstep.
              </p>

              <p className="text-gray-600 mb-8">
                At Apristo, we carefully curate our product selection to ensure that every item meets 
                the highest standards of quality. Our goal is to offer a seamless shopping experience 
                that empowers you to discover life-changing products without the hassle of international 
                shipping delays.
              </p>

              <p className="text-gray-600 mb-12">
                We are more than just a marketplace—Apristo is a gateway to new opportunities, helping 
                you access goods that improve your lifestyle, health, and happiness.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="p-6 bg-white border border-gray-100 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center mt-16 p-12 bg-purple-50 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4">Join Us Today</h2>
              <p className="text-gray-600 mb-8">
                Be part of our journey as we continue to provide convenience, quality, and speed to your doorstep.
              </p>
              <a
                href="/"
                className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                Start Shopping
              </a>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}