"use client";
import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MainNavbar from "@/components/mainNavbar";

export default function ContactUs() {
  return (

    <>
    <Navbar />
    <MainNavbar />
    <section className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-3xl w-full text-center mb-10">
        <h1 className="text-3xl font-bold text-[#004C99] mb-4">Contact Us</h1>
        <p className="text-gray-600 text-base">
          Have any questions or feedback about the MGNREGA District Dashboard?
          We'd love to hear from you! Reach out using the details below.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl w-full">
        {/* Email */}
        <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
          <Mail className="w-10 h-10 text-[#0066CC] mb-3" />
          <h2 className="font-semibold text-lg text-[#004C99] mb-2">Email</h2>
          <p className="text-gray-700 text-sm">support@mgnrega-dashboard.gov.in</p>
        </div>

        {/* Phone */}
        <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
          <Phone className="w-10 h-10 text-[#0066CC] mb-3" />
          <h2 className="font-semibold text-lg text-[#004C99] mb-2">Phone</h2>
          <p className="text-gray-700 text-sm">+91 98765 43210</p>
        </div>

        {/* Address */}
        <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
          <MapPin className="w-10 h-10 text-[#0066CC] mb-3" />
          <h2 className="font-semibold text-lg text-[#004C99] mb-2">Office</h2>
          <p className="text-gray-700 text-sm">Ministry of Rural Development, New Delhi, India</p>
        </div>
      </div>

      <div className="mt-12 text-center text-gray-600 text-sm">
        <p>© 2025 MGNREGA District Dashboard | All Rights Reserved</p>
      </div>
    </section>
    <Footer />
    </>
  );
}
