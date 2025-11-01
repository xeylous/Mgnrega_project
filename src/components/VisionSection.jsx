"use client";
import { ArrowRight } from "lucide-react";

export default function VisionSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-12 text-gray-800">
      {/* Heading */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900">
          Vision of Mahatma Gandhi NREGA
        </h2>
        <div className="w-20 h-[3px] bg-yellow-400 mx-auto mt-2 rounded"></div>
      </div>

      {/* Paragraphs */}
      <div className="space-y-5 text-justify leading-relaxed text-gray-700">
        <p>
          The vision of Mahatma Gandhi NREGA is to enhance the livelihood
          security of rural households across the country by providing at least
          100 days of guaranteed wage employment in a financial year to every
          rural household whose adult members volunteer to do unskilled manual
          work. Mahatma Gandhi NREGA recognizes the importance of strengthening
          the livelihood resource base of the poor by reaching the most
          vulnerable sections of rural areas, including Scheduled Castes,
          Scheduled Tribes, women-headed households, and other marginalized
          groups.
        </p>

        <p>
          The scheme encourages a sense of community and collective
          responsibility by strengthening Panchayat Raj institutions. Mahatma
          Gandhi NREGA promotes a bottom-up approach to planning and execution,
          empowering local communities to take charge of their development.
          Through the creation of productive assets of prescribed quality and
          durability, the scheme addresses immediate economic needs while laying
          the foundation for long-term prosperity.
        </p>

        <p>
          Mahatma Gandhi NREGA prioritizes sustainable development and
          environmental stewardship, striving to create a greener, more
          sustainable future for generations to come by prioritizing works that
          contribute to ecological conservation and rural infrastructure
          development. Central to the scheme's vision is a commitment to
          transparency and accountability, ensuring that funds are utilized
          efficiently and beneficiaries' rights are upheld through mechanisms
          such as social audits, grievance redressal, and proactive public
          disclosure.
        </p>
      </div>
    </section>
  );
}
