import { useState } from "react";
import { FaBook, FaChevronDown, FaChevronUp } from "react-icons/fa";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What Is BusSewa?",
      answer: "BusSewa is an online platform that helps users book bus tickets conveniently from anywhere.",
    },
    {
      question: "Do I Need To Register To Use BusSewa?",
      answer: "No, you can book tickets without registration. However, creating an account provides additional features like booking history and notifications.",
    },
    {
      question: "Does BusSewa Own The Buses?",
      answer: "No, BusSewa partners with bus operators to provide ticket booking services. It does not own or operate buses.",
    },
    {
      question: "How Can I Make Payments?",
      answer: "You can make payments using debit/credit cards, mobile wallets, or other online payment methods supported by BusSewa.",
    },
    {
      question: "How Will I Get Confirmation That My Ticket Purchased?",
      answer: "You will receive a confirmation email or SMS with your ticket details immediately after the payment is successful.",
    },
    {
      question: "What Details Do I Need To Give At The Time Of Booking/Buying?",
      answer: "You need to provide your name, mobile number, email address, and travel details like departure and destination points.",
    },
    {
      question: "I entered the wrong mobile number while booking. Can I get my mTicket on a different number?",
      answer: "Yes, you can contact our customer service team to update your mobile number and resend the mTicket.",
    },
    {
      question: "What is an mTicket?",
      answer: "An mTicket is a mobile ticket that is sent to your phone via SMS or email. It can be used to board the bus without needing a printed ticket.",
    },
    {
      question: "How do I contact customer service?",
      answer: "You can contact our customer service team via email at support@bussewa.com or call us at +123-456-7890.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-10 px-4 dark:bg-gray-900 dark:text-foreground">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 sm:p-10 dark:bg-gray-800 dark:text-foreground">
        {/* Title Section */}
        <div className="flex flex-col items-center mb-8">
          <FaBook className="text-purple-600 text-4xl mb-2" />
          <h2 className="text-3xl font-bold text-gray-800 mb-1">Frequently Asked Questions</h2>
          <p className="text-gray-500 text-base text-center max-w-xl">Find answers to common questions about booking, payments, tickets, and using our platform.</p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border rounded-lg transition-all duration-300 shadow-sm p-0 overflow-hidden ${activeIndex === index ? 'border-purple-400 bg-purple-50' : 'border-gray-200 bg-white'
                }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center px-4 py-4 focus:outline-none text-left group"
                aria-expanded={activeIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className={`text-gray-800 font-medium text-base group-hover:text-purple-700 transition-colors`}>{faq.question}</span>
                <span className="ml-4 text-purple-600">
                  {activeIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </button>
              <div
                id={`faq-answer-${index}`}
                className={`px-4 pb-4 text-gray-600 text-sm transition-all duration-300 ${activeIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
                style={{
                  transitionProperty: 'max-height, opacity',
                }}
                aria-hidden={activeIndex !== index}
              >
                {activeIndex === index && (
                  <div>{faq.answer}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
