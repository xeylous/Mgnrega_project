"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function MainNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "HOME", href: "/" },
    { name: "DISTRICT PERFORMANCE", href: "/districtperformance" },
    { name: "CONTACT US", href: "/contactus" },
    { name: "ABOUT", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-4">
          <Image
            src="/logo1.png"
            alt="India Logo"
            width={45}
            height={45}
            className="rounded-full border border-gray-300 shadow-sm hover:scale-110 transition-transform"
          />
          <div>
            <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
              Bharat Digital Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Open Government Data (OGD) Platform India
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-semibold text-gray-700 text-sm">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative group pb-1 transition-all duration-300 ${
                  isActive ? "text-blue-600" : "hover:text-blue-600"
                }`}
              >
                {item.name}
                <span
                  className={`absolute left-0 bottom-[-3px] h-[2px] bg-blue-600 transition-all duration-300 ease-in-out ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 border rounded-md hover:bg-gray-100 transition"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md flex flex-col items-start px-6 py-4 space-y-3">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`relative w-full pb-1 transition-all duration-300 ${
                  isActive
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {item.name}
                <span
                  className={`absolute left-0 bottom-[-3px] h-[2px] bg-blue-600 transition-all duration-300 ease-in-out ${
                    isActive ? "w-full" : "w-0"
                  }`}
                ></span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
