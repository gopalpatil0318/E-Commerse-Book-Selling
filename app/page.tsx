"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function Home() {

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/home'; // Replace with your target route
    }, 1500); // 2 seconds

    return () => clearTimeout(timer);
  }, []);


  return (
    <>
      <div className="bg-[#009999] h-[100vh] w-[100%] pt-[200px] text-center">
        <div className="relative w-[350px] h-[350px] mx-auto transition-transform transform -translate-y-20 opacity-0 animate-slide-down">
          <Image
            src="/non-fiction.png"
            alt="BookSwap Logo"
            fill
            className="object-contain"
            sizes="350px"
          />
        </div>
        <h3 className="mt-4 text-center text-white font-bold text-[30px] transition-transform transform translate-y-20 opacity-0 animate-slide-down">BookSwap</h3>
      </div>
    </>
  );
}
