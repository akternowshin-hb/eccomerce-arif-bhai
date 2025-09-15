'use client'

import React from 'react'
import Link from 'next/link'
import { 
  Truck, 
  Shield, 
  RotateCcw, 
  CreditCard, 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  ArrowRight,
  Star
} from 'lucide-react'

interface FooterLink {
  name: string
  href: string
  color?: string
}

interface FooterSection {
  title: string
  links: FooterLink[]
  titleColor: string
}

const Footer: React.FC = () => {
  const footerSections: FooterSection[] = [
    {
      title: 'Shop by Category',
      titleColor: '#3b82f6',
      links: [
        { name: 'Men', href: '/man', color: '#3b82f6' },
        { name: 'Women', href: '/woman', color: '#8b5cf6' },
        { name: 'Kids', href: '/kids', color: '#06b6d4' },
        { name: 'Others', href: '/others', color: '#f59e0b' },
        { name: 'Sale', href: '/sale', color: '#ef4444' }
      ]
    },
    {
      title: 'Get Support',
      titleColor: '#8b5cf6',
      links: [
        { name: 'Shipping Policy', href: '/shipping-policy' },
        { name: 'Return & Exchange', href: '/return-exchange' },
        { name: 'FAQs', href: '/faqs' },
        { name: 'How to Buy', href: '/how-to-buy' },
        { name: 'Terms & Conditions', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Payment Policy', href: '/payment-policy' }
      ]
    },
    {
      title: 'Company Info',
      titleColor: '#06b6d4',
      links: [
        { name: 'About us', href: '/about' },
        { name: 'Blog', href: '/blog' },
        { name: 'SiteMap', href: '/sitemap' },
        { name: 'Contact us', href: '/contact' },
        { name: 'Careers', href: '/careers' }
      ]
    },
    {
      title: 'Your Account',
      titleColor: '#f59e0b',
      links: [
        { name: 'My Account', href: '/account' },
        { name: 'Order History', href: '/orders' },
        { name: 'My Wishlist', href: '/wishlist' },
        { name: 'Track Order', href: '/track' },
        { name: 'Gift Cards', href: '/gift-cards' }
      ]
    }
  ]

  const features = [
    {
      icon: <Truck className="w-6 h-6" />,
      title: 'Cash On delivery',
      color: '#3b82f6'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Non-contact shipping',
      color: '#8b5cf6'
    },
    {
      icon: <RotateCcw className="w-6 h-6" />,
      title: 'Easy Return Policy',
      color: '#06b6d4'
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: 'Secure payments',
      color: '#f59e0b'
    }
  ]

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: '#', color: '#1877f2', name: 'Facebook' },
    { icon: <Instagram className="w-5 h-5" />, href: '#', color: '#e4405f', name: 'Instagram' },
    { icon: <Twitter className="w-5 h-5" />, href: '#', color: '#1da1f2', name: 'Twitter' },
    { icon: <Youtube className="w-5 h-5" />, href: '#', color: '#ff0000', name: 'YouTube' },
    { icon: <Linkedin className="w-5 h-5" />, href: '#', color: '#0077b5', name: 'LinkedIn' }
  ]

  const paymentMethods = [
    'Visa', 'Mastercard', 'American Express', 'bKash', 'Nagad', 'Rocket'
  ]

  return (
    <footer className="bg-white">
      {/* Features Bar */}
      <div className="bg-gray-50 py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center space-x-3 justify-center lg:justify-start"
              >
                <div 
                  className="p-2 rounded-full"
                  style={{ 
                    backgroundColor: `${feature.color}15`,
                    color: feature.color
                  }}
                >
                  {feature.icon}
                </div>
                <span className="font-medium text-gray-800">{feature.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <Link 
                  href="/" 
                  className="text-4xl font-bold"
                  style={{ color: '#3b82f6' }}
                >
                  MIAH
                </Link>
                <p className="text-gray-300 mt-3">
                  Find your next signature look.
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Need help? Just reach out.
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3 text-gray-300">
                  <Phone className="w-4 h-4" style={{ color: '#3b82f6' }} />
                  <span className="text-sm">+8801313767678</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Mail className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                  <span className="text-sm">info@miah.shop</span>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-200">Follow us on:</h4>
                <div className="flex space-x-3">
                  {socialLinks.map((social, index) => (
                    <Link
                      key={index}
                      href={social.href}
                      className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                      style={{
                        color: '#9ca3af'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = social.color
                        e.currentTarget.style.color = 'white'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#1f2937'
                        e.currentTarget.style.color = '#9ca3af'
                      }}
                      title={social.name}
                    >
                      {social.icon}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <div key={index} className="space-y-4">
                <h3 
                  className="font-semibold"
                  style={{ color: section.titleColor }}
                >
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = link.color || section.titleColor
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#9ca3af'
                        }}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            
            {/* Copyright */}
            <div className="text-gray-400 text-sm text-center md:text-left">
              <p>&copy; 2025 M/S Miah & Miah Enterprise. All rights reserved.</p>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-3">
              <span className="text-gray-400 text-xs">We Accept:</span>
              <div className="flex flex-wrap gap-2">
                {paymentMethods.map((method, index) => (
                  <div
                    key={index}
                    className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300 hover:bg-gray-600 transition-colors duration-300"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer