"use client";

import { useEffect } from "react";
// import { useRouter } from "next/router";

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
    <img src="./non-fiction.png" alt="" className="w-[350px] mx-auto transition-transform transform -translate-y-20 opacity-0 animate-slide-down"/>
    <h3 className="mt-4 text-center text-white font-bold text-[30px] transition-transform transform translate-y-20 opacity-0 animate-slide-down">BookSwap</h3>
    </div>
    </>
  );
}
