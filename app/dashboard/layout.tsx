"use client";

import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl shadow-sm mb-6">
            <h1 className="text-2xl font-bold text-blue-800">
              Health Monitoring Dashboard
            </h1>
            <p className="text-blue-600 mt-1">
              Real-time monitoring of critical health data
            </p>
          </div>
          <main className="bg-white rounded-2xl shadow-sm p-6">
            {children}
          </main>
        </div>
        <footer className="bg-white border-t border-gray-200 mt-8 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-500 text-sm mb-4 md:mb-0">
                &copy; 2025 Chronic Health Monitor. All rights reserved.
              </div>
              <div className="flex space-x-6">
                <a
                  href="#"
                  className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}