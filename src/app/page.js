"use client";
import React, { useState } from "react";
import Footer from "@/components/Footer";
import MainNavbar from "@/components/mainNavbar";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import ResultCard from "@/components/ResultCard";
import HeroMain from "@/components/HeroMain";

export default function Page() {
  const [searchResult, setSearchResult] = useState(null);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 🔝 Top Navbars */}
      <div className="sticky top-0 z-50">
        <Navbar />
        <MainNavbar />
        <HeroMain />
      </div>

      {/* 🧭 Main Content */}
      <main className="flex-grow flex flex-col items-center p-6 my-10">
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

      {/* 🔻 Footer stays pinned to bottom */}
      <Footer />
    </div>
  );
}
