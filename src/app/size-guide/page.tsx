'use client'

import React from 'react'
import { Ruler, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const SizeGuidePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Ruler className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Size Guide</h1>
          </div>
          <p className="text-gray-600">
            Find the perfect fit with our comprehensive sizing charts
          </p>
        </div>

        {/* Lungi Size Guide */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lungi Size Guide</h2>
          <p className="text-gray-600 mb-6">
            Traditional lungis come in standard sizes. Measure your waist circumference to find the perfect fit.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Size</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Waist (inches)</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Waist (cm)</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Length (inches)</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Length (cm)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 font-medium">Free Size</td>
                  <td className="border border-gray-300 px-4 py-3">28-38</td>
                  <td className="border border-gray-300 px-4 py-3">71-96</td>
                  <td className="border border-gray-300 px-4 py-3">45-48</td>
                  <td className="border border-gray-300 px-4 py-3">114-122</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-medium">Standard</td>
                  <td className="border border-gray-300 px-4 py-3">30-40</td>
                  <td className="border border-gray-300 px-4 py-3">76-102</td>
                  <td className="border border-gray-300 px-4 py-3">48</td>
                  <td className="border border-gray-300 px-4 py-3">122</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 font-medium">XL</td>
                  <td className="border border-gray-300 px-4 py-3">40-46</td>
                  <td className="border border-gray-300 px-4 py-3">102-117</td>
                  <td className="border border-gray-300 px-4 py-3">48-50</td>
                  <td className="border border-gray-300 px-4 py-3">122-127</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">How to Measure</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Measure around your natural waistline</li>
              <li>• Keep the tape measure snug but not tight</li>
              <li>• For length, measure from waist to desired length (usually mid-calf)</li>
            </ul>
          </div>
        </div>

        {/* Panjabi Size Guide */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Panjabi Size Guide</h2>
          <p className="text-gray-600 mb-6">
            Our Panjabis are designed for a comfortable, traditional fit. Refer to the chart below for accurate sizing.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Size</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Chest (inches)</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Chest (cm)</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Length (inches)</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Length (cm)</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Shoulder (inches)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 font-medium">S</td>
                  <td className="border border-gray-300 px-4 py-3">36-38</td>
                  <td className="border border-gray-300 px-4 py-3">91-96</td>
                  <td className="border border-gray-300 px-4 py-3">38-40</td>
                  <td className="border border-gray-300 px-4 py-3">96-102</td>
                  <td className="border border-gray-300 px-4 py-3">16-17</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-medium">M</td>
                  <td className="border border-gray-300 px-4 py-3">38-40</td>
                  <td className="border border-gray-300 px-4 py-3">96-102</td>
                  <td className="border border-gray-300 px-4 py-3">40-42</td>
                  <td className="border border-gray-300 px-4 py-3">102-107</td>
                  <td className="border border-gray-300 px-4 py-3">17-18</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 font-medium">L</td>
                  <td className="border border-gray-300 px-4 py-3">40-42</td>
                  <td className="border border-gray-300 px-4 py-3">102-107</td>
                  <td className="border border-gray-300 px-4 py-3">42-44</td>
                  <td className="border border-gray-300 px-4 py-3">107-112</td>
                  <td className="border border-gray-300 px-4 py-3">18-19</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-medium">XL</td>
                  <td className="border border-gray-300 px-4 py-3">42-44</td>
                  <td className="border border-gray-300 px-4 py-3">107-112</td>
                  <td className="border border-gray-300 px-4 py-3">44-46</td>
                  <td className="border border-gray-300 px-4 py-3">112-117</td>
                  <td className="border border-gray-300 px-4 py-3">19-20</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 font-medium">XXL</td>
                  <td className="border border-gray-300 px-4 py-3">44-46</td>
                  <td className="border border-gray-300 px-4 py-3">112-117</td>
                  <td className="border border-gray-300 px-4 py-3">46-48</td>
                  <td className="border border-gray-300 px-4 py-3">117-122</td>
                  <td className="border border-gray-300 px-4 py-3">20-21</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">How to Measure</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• <strong>Chest:</strong> Measure around the fullest part of your chest, keeping tape under arms</li>
              <li>• <strong>Length:</strong> Measure from the highest point of shoulder to the desired length</li>
              <li>• <strong>Shoulder:</strong> Measure from shoulder seam to shoulder seam across the back</li>
            </ul>
          </div>
        </div>

        {/* General Tips */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sizing Tips</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">General Guidelines</h3>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>If you're between sizes, we recommend sizing up for a more comfortable fit</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>All measurements are approximate and may vary slightly by product</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Check individual product pages for specific sizing information</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Consider fabric shrinkage when washing - follow care instructions</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
              <p className="text-gray-700 mb-4">
                Still unsure about sizing? Our customer support team is here to help!
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> support@lungilok.com
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Phone:</strong> +880 1234-567890
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Hours:</strong> 9 AM - 6 PM (Sat - Thu)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Shopping */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SizeGuidePage
