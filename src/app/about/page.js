"use client";
import Footer from "@/components/Footer";
import MainNavbar from "@/components/mainNavbar";
import Navbar from "@/components/Navbar";
import React from "react";

export default function AboutUs() {
  return (
    <>
    <Navbar/>
    <MainNavbar/>
    <section className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-4xl text-center">
        <h1 className="text-3xl font-bold text-[#004C99] mb-4">About MGNREGA Dashboard</h1>
        <p className="text-gray-700 text-base leading-relaxed mb-6">
          The <span className="font-semibold text-[#0066CC]">MGNREGA District Dashboard</span> is an open-data platform designed 
          to simplify access to key information about the Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA). 
          It helps citizens — especially from rural India — easily view their district’s monthly performance, 
          understand employment trends, fund utilization, and overall progress under the scheme.
        </p>

        <p className="text-gray-700 text-base leading-relaxed mb-6">
          The project uses real-time data from the Government of India’s Open Data API and transforms it into 
          easy-to-understand visuals and summaries. It aims to bridge the gap between public data and common citizens 
          who may not be tech-savvy but deserve transparency and clarity about government initiatives in their district.
        </p>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl shadow-md p-6 my-8">
          <h2 className="text-xl font-semibold text-[#004C99] mb-3">Our Mission</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            To promote <span className="font-semibold">transparency, accessibility, and accountability</span> 
            by converting complex MGNREGA data into meaningful insights for the people it serves — 
            rural citizens of India. This initiative aligns with the vision of 
            <span className="font-semibold text-[#0066CC]"> Digital India</span> and Open Government Data movement.
          </p>
        </div>

        <p className="text-gray-600 text-sm">
          Designed and developed as part of the <span className="font-medium text-[#0066CC]">Bharat Digital Fellowship 2025</span>.
        </p>
      </div>
    </section>
    <Footer/>
    </>
  );
}
