import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: '#about', label: 'Sobre' },
    { href: '#project', label: 'Projeto' },
    { href: '#crystals', label: 'Cristais Quânticos' },
    { href: '#materials', label: 'Materiais' },
    { href: '#engine', label: 'Motor Quântico' },
    { href: '#mission', label: 'Missão' },
    { href: '/hexagonal-grid', label: 'Malha Hexagonal' },
    { href: '#contact', label: 'Contato' },
  ];

  return (
    <nav className="fixed w-full bg-[#020617]/80 backdrop-blur-md z-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="text-xl font-bold text-violet-400">
            Quantum Project
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-violet-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile Navigation Button */}
          <button
            className="md:hidden text-gray-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-gray-300 hover:text-violet-400 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;