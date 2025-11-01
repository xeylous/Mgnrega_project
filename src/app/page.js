"use client";

import React, { useState } from "react";
import Image from "next/image";
import Footer from "@/components/Footer";
import MainNavbar from "@/components/MainNavbar";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import ResultCard from "@/components/ResultCard";
import VisionSection from "@/components/VisionSection";

export default function Page() {
  const [searchResult, setSearchResult] = useState(null);
  const images = ["1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg", "5.jpeg", "6.jpeg"];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 🔝 Fixed Navbars */}
      <div className="sticky top-0 z-50">
        <Navbar />
        <MainNavbar />
      </div>

      {/* 🖼️ Hero Section with Continuous Infinite Scroll */}
      <section className="relative w-full h-[60vh] overflow-hidden bg-gradient-to-b from-white to-blue-50 flex items-center justify-center">
        <style jsx>{`
          .scroll-wrapper {
            position: relative;
            width: 200%;
            display: flex;
            animation: scroll 40s linear infinite;
          }

          @keyframes scroll {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }

          .image-strip {
            display: flex;
            flex-shrink: 0;
            width: 50%;
            gap: 1.5rem;
          }
        `}</style>

        {/* Continuous Scroll Container */}
        <div className="scroll-wrapper px-10">
          {[0, 1].map((dup) => (
            <div key={dup} className="image-strip">
              {images.map((src, i) => (
                <div
                  key={`${dup}-${i}`}
                  className="relative min-w-[250px] sm:min-w-[280px] md:min-w-[320px] h-[40vh] rounded-xl overflow-hidden shadow-lg transition-transform duration-500 hover:scale-105 hover:shadow-2xl"
                >
                  <Image
                    src={`/${src}`}
                    alt={`Banner ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 ease-in-out hover:scale-110"
                    priority
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Overlay Text */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-white/40 to-transparent">
          <div className="text-center px-4">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-blue-900 drop-shadow-lg">
              Bharat Digital Dashboard
            </h1>
            <p className="mt-3 text-gray-700 text-sm sm:text-base max-w-xl mx-auto">
              Compare, analyze, and visualize the progress of Indian districts — powered by Open Government Data.
            </p>
          </div>
        </div>
      </section>

      {/* 🧭 Main Content Section */}
      <main className="flex-grow flex flex-col items-center p-6 my-10 bg-gray-200 rounded-xl shadow-sm max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-[#1e3a8a] mb-5 flex items-center justify-center gap-2">
          Know How Your District is Doing?
        </h1>

        <SearchBar onResult={setSearchResult} />

        {searchResult && (
          <div className="mt-6 w-full flex justify-center">
            <ResultCard
              state={searchResult.state}
              district={searchResult.district}
              year={searchResult.year}
              result={searchResult.result}
            />
          </div>
        )}
      </main>

      {/* 🌟 Vision Section */}
      <VisionSection />

      {/* 🔻 Footer */}
      <Footer />
    </div>
  );
}
