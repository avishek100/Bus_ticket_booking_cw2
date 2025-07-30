import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      {/* Title */}
      <h1 className="text-4xl font-bold text-purple-700 mb-8">Privacy Policy</h1>

      {/* Content */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
        <p className="text-gray-700 mb-4">
          At <strong>BusSewa</strong>, we value your privacy and are committed to protecting your personal data. This
          Privacy Policy explains how we collect, use, and safeguard your information when you visit our website and use
          our services.
        </p>

        <h2 className="text-2xl font-semibold text-purple-700 mt-6 mb-3">1. Information We Collect</h2>
        <p className="text-gray-700">
          - **Personal Information**: Name, email address, phone number, and payment information when you book tickets.
          <br />
          - **Usage Data**: Details about your interactions with our website, including IP address, browser type, and
          device information.
        </p>

        <h2 className="text-2xl font-semibold text-purple-700 mt-6 mb-3">2. How We Use Your Information</h2>
        <p className="text-gray-700">
          - To process your bookings and manage your account.
          <br />
          - To improve our services and enhance your experience.
          <br />
          - To communicate important updates or offers.
        </p>

        <h2 className="text-2xl font-semibold text-purple-700 mt-6 mb-3">3. How We Protect Your Data</h2>
        <p className="text-gray-700">
          - We use industry-standard encryption to secure your information.
          <br />
          - We limit access to your data to authorized personnel only.
        </p>

        <h2 className="text-2xl font-semibold text-purple-700 mt-6 mb-3">4. Your Rights</h2>
        <p className="text-gray-700">
          - You have the right to access, update, or delete your personal information.
          <br />
          - You can opt out of promotional communications at any time.
        </p>

        <h2 className="text-2xl font-semibold text-purple-700 mt-6 mb-3">5. Contact Us</h2>
        <p className="text-gray-700">
          If you have any questions or concerns about our Privacy Policy, please contact us:
        </p>
        <ul className="list-disc list-inside text-gray-700 mt-2">
          <li>Email: info@bussewa.com</li>
          <li>Phone: +1 234 567 890</li>
          <li>Address: 123 Bus Street, Travel City, Country</li>
        </ul>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
