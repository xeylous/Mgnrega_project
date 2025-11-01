"use client";
import { useState, useEffect } from "react";
import { Sun, Moon, Facebook, Twitter } from "lucide-react";

export default function Navbar() {
  const [theme, setTheme] = useState("default");
  const [fontSize, setFontSize] = useState(16);

  // Theme toggler
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Font size changer
  useEffect(() => {
    document.body.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  const increaseFont = () => setFontSize((prev) => Math.min(prev + 2, 24));
  const decreaseFont = () => setFontSize((prev) => Math.max(prev - 2, 12));

  return (
    <nav className="w-full bg-[#0066CC]  flex justify-between items-center px-6 py-2 text-white text-sm shadow-md">
      {/* Left Section */}
      <span className="font-semibold tracking-wide flex items-center gap-2 px-16 ">
        🇮🇳 <span className="uppercase">A Digital India Initiative</span>
      </span>

      {/* Right Section */}
      <div className="flex items-center gap-5">
        {/* Theme toggle */}
        <div className="flex items-center gap-2 bg-[#004C99] px-3 py-1.5 rounded-md shadow-inner border border-blue-300/40 hover:shadow-md transition-all duration-300">
          <span className="text-xs tracking-wide">Theme</span>
          <button
            onClick={() => setTheme(theme === "default" ? "dark" : "default")}
            className="p-1.5 rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 border border-white flex items-center justify-center hover:scale-110 transition-transform duration-300"
            title="Toggle theme"
          >
            {theme === "default" ? (
              <Sun className="w-4 h-4 text-white" />
            ) : (
              <Moon className="w-4 h-4 text-white" />
            )}
          </button>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-4 border-l border-white/50 pl-4">
          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            title="Facebook"
            className="hover:scale-125 transition-transform duration-300"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a
            href="https://x.com/"
            target="_blank"
            rel="noopener noreferrer"
            title="X (Twitter)"
            className="hover:scale-125 transition-transform duration-300"
          >
            <Twitter className="w-5 h-5" />
          </a>

          {/* Font size control */}
          <div className="flex items-center gap-1 border border-white rounded-md px-2 py-[2px] bg-[#004C99] hover:bg-[#005BB5] transition-all duration-300">
            <button
              onClick={decreaseFont}
              className="px-1 text-white hover:text-yellow-300"
              title="Decrease font size"
            >
              A-
            </button>
            <div className="h-4 w-[1px] bg-white/50"></div>
            <button
              onClick={increaseFont}
              className="px-1 text-white hover:text-yellow-300"
              title="Increase font size"
            >
              A+
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
