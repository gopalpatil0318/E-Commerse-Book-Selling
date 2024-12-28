import React from 'react'
import Link from 'next/link';
import { FiHome } from "react-icons/fi";
import { RiSearchLine } from "react-icons/ri";
import { FiShoppingCart } from "react-icons/fi";
import { FaListUl } from "react-icons/fa";

const BottomNavigation = () => {
    return (
        <div>
            <div className="fixed z-50 w-full h-16 max-w-lg -translate-x-1/2 bg-white border border-gray-200 rounded-full bottom-4 left-1/2 dark:bg-gray-700 dark:border-gray-600">
                <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
                    <Link href="/home" className="text-2xl inline-flex flex-col items-center justify-center px-10 rounded-s-full hover:bg-gray-50 dark:hover:bg-gray-800 group">
                        <FiHome />
                    </Link>
                    
                    <Link href="/search" className="text-2xl inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
                        <RiSearchLine />
                    </Link>
                   
                    <div className="flex items-center justify-center">
                        <Link href="/add-book" className="inline-flex items-center justify-center w-10 h-10 font-medium bg-[#009999] rounded-full hover:bg-[#006666] group focus:outline-none">
                            <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                            </svg>
                        </Link>
                    </div>
                  
                    <Link href="/cart" className="text-2xl inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
                        <FiShoppingCart />
                    </Link>
                    
                    <Link href="/order" className="text-2xl inline-flex flex-col items-center justify-center px-5 rounded-e-full hover:bg-gray-50 dark:hover:bg-gray-800 group">
                        <FaListUl />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default BottomNavigation

