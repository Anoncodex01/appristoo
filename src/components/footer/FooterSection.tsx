import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

interface FooterSectionProps {
  title: string;
  children: React.ReactNode;
}

function FooterSection({ title, children }: FooterSectionProps) {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-4 text-gray-100">{title}</h3>
      {children}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <img 
              src="https://i.imgur.com/uLxDm9R.png" 
              alt="Apristo" 
              className="h-12 mb-6"
            />
            <p className="mb-4">
              Tanzania's premier marketplace for quality products from oversea at affordable price.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-purple-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/apristoapp" className="hover:text-purple-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <FooterSection title="Contact Us">
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-purple-400" />
                <span>+255 683 836 495</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-purple-400" />
                <a href="mailto:info@apristo.com" className="hover:text-purple-400 transition-colors">
                  info@apristo.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <span>Livingstone Binsulum Plaza Ghorofa ya pili, S01 &
S12</span>
              </li>
            </ul>
          </FooterSection>

          {/* Quick Links */}
          <FooterSection title="Quick Links">
            <ul className="space-y-2">
              <li>
                <a href="/about" className="hover:text-purple-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/faq" className="hover:text-purple-400 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-purple-400 transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-purple-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/shipping" className="hover:text-purple-400 transition-colors">
                  Shipping Information
                </a>
              </li>
            </ul>
          </FooterSection>

          {/* Newsletter */}
          <FooterSection title="Newsletter">
            <p className="mb-4">
              Subscribe to our newsletter for updates, deals, and exclusive offers.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-400"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </FooterSection>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p>© {new Date().getFullYear()} Apristo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}