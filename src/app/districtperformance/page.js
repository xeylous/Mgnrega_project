"use client";
import CompareDistricts from "@/components/CompareDistricts";
import DistrictComparisonFAQ from "@/components/DistrictComparisonFAQ";
import Footer from "@/components/Footer";
import MainNavbar from "@/components/mainNavbar";
import Navbar from "@/components/Navbar";
import React from "react";


export default function Page() {

  return (
    <>
    <Navbar />
    <MainNavbar />
    <CompareDistricts />
    <DistrictComparisonFAQ />
    <Footer />
    </>
  );
}

