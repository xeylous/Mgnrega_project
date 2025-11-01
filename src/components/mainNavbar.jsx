"use client";
import Image from "next/image";
import Link from "next/link";

export default function MainNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
        
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-4">
          <Image
            src="/logo1.png"
            alt="India Logo"
            width={58}
            height={58}
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

        {/* Right: Navigation */}
        <nav className="flex items-center gap-8 font-medium text-gray-700 font-semibold text-sm">
          {["HOME", "DISTRICT PERFORMANCE", "CONTACT US", "ABOUT"].map(
            (item, i) => (
              <Link
                key={i}
                href={
                  item === "HOME"
                    ? "/"
                    : `/${item.toLowerCase().replace(/\s+/g, "")}`
                }
                className="relative group"
              >
                <span className="transition-colors duration-300 group-hover:text-blue-600">
                  {item}
                </span>
                <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
