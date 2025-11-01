import Footer from "@/components/Footer";
import HouseholdDataDashboardState from "@/components/HouseholdDataDashboardState";
import MainNavbar from "@/components/mainNavbar";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Navbar />
    
  <MainNavbar/>
  <HouseholdDataDashboardState />
   
    <Footer/> 
    </>
  );
}
