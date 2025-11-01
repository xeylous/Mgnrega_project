"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MainNavbar() {
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
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative pb-1 transition-all duration-300 group ${
                  isActive ? "text-blue-600" : "hover:text-blue-600"
                }`}
              >
                {item.name}
                {/* Animated underline */}
                <span
                  className={`absolute left-0 bottom-[-3px] h-[2px] bg-blue-600 transition-all duration-300 ease-in-out ${
                    isActive
                      ? "w-full" // Active link: underline stays full width
                      : "w-0 group-hover:w-full" // Hover: expands smoothly
                  }`}
                ></span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
