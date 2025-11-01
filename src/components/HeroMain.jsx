"use client";
import React from "react";
import Image from "next/image";

export default function HeroMain() {
  const images = ["1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg", "5.jpeg", "6.jpeg"];

  return (
    <section className="relative w-full h-[60vh] overflow-hidden bg-gradient-to-b from-white to-blue-50 flex items-center justify-center">
      {/* Double set of images for seamless looping */}
      <div className="flex animate-scroll gap-6 px-10">
        {[...images, ...images].map((src, i) => (
          <div
            key={i}
            className="relative min-w-[350px] h-[55vh] rounded-2xl overflow-hidden shadow-lg transition-transform duration-500 hover:scale-105 hover:shadow-2xl"
          >
            <Image
              src={`/${src}`}
              alt={`Banner ${i + 1}`}
              fill
              className="object-cover transition-transform duration-700 ease-in-out hover:scale-110"
            />
          </div>
        ))}
      </div>

     
    </section>
  );
}
