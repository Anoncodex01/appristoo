import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

interface AdminNavProps {
  menuItems?: MenuItem[];
}

export function AdminNav({ menuItems = [] }: AdminNavProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <>
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm fixed w-full top-0 left-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              <span className="text-xl font-bold text-purple-600">apristo admin</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed top-0 left-0 z-40 w-64 h-screen pt-20 bg-white border-r border-gray-200 
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full px-3 py-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center p-3 rounded-lg hover:bg-gray-100
                    ${location.pathname === item.path ? 'bg-purple-50 text-purple-600' : 'text-gray-600'}
                  `}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}