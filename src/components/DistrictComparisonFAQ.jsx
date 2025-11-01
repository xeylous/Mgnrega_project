"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function DistrictComparisonFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Why is it important to compare two districts?",
      answer:
        "Comparing two districts helps identify disparities in development, governance, and resource allocation. It allows policymakers and researchers to understand which regions are progressing well and which require additional support or intervention.",
    },
    {
      question: "What are the benefits of tracking the progress of districts?",
      answer:
        "Tracking district progress provides valuable insights into the impact of government schemes, economic growth, and infrastructure development. It helps ensure accountability and promotes data-driven decision-making for sustainable and inclusive growth.",
    },
    {
      question: "How does comparison help in better governance?",
      answer:
        "District-level comparisons highlight performance gaps and successful practices. Local administrations can learn from high-performing districts and replicate proven models to enhance governance, service delivery, and citizen welfare.",
    },
    {
      question: "Who can benefit from district comparison data?",
      answer:
        "Policy analysts, government officials, researchers, and citizens all benefit. While policymakers can design more targeted interventions, citizens can track how their district is performing relative to others, promoting transparency and civic engagement.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-5xl mx-auto px-6 md:px-10 py-12 text-gray-800">
      {/* Section Heading */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900">
          Why Compare Districts?
        </h2>
        <div className="w-20 h-[3px] bg-yellow-400 mx-auto mt-2 rounded"></div>
        <p className="text-gray-600 mt-4 max-w-3xl mx-auto leading-relaxed">
          Comparing the progress of districts helps evaluate development efforts, monitor regional balance, and ensure equitable growth. 
          It’s a key step in creating a data-driven framework for local governance and inclusive policy-making.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <button
              className="w-full flex justify-between items-center px-5 py-4 text-left text-gray-800 font-medium"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <ChevronDown
                className={`w-5 h-5 text-blue-600 transform transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="px-5 pb-4 text-gray-600 border-t border-gray-100 leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
