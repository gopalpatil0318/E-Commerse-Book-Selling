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
                <button data-tooltip-target="tooltip-home" type="button" className="text-2xl inline-flex flex-col items-center justify-center px-10 rounded-s-full hover:bg-gray-50 dark:hover:bg-gray-800 group">
                <Link href="/home"><FiHome /></Link>
                       
                    </button>
                  
                    
                    <button data-tooltip-target="tooltip-wallet" type="button" className="text-2xl inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
                    <Link href="/search"><RiSearchLine /></Link>
                       
                    </button>
                   
                    <div className="flex items-center justify-center">
                        <button data-tooltip-target="tooltip-new" type="button" className="inline-flex items-center justify-center w-10 h-10 font-medium bg-[#009999] rounded-full hover:bg-[#006666] group focus:outline-none">
                        <Link href="/add-book"><svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                            </svg>
                            </Link>
                            
                        </button>
                    </div>
                  
                    <button data-tooltip-target="tooltip-settings" type="button" className="text-2xl inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
                    <Link href="/cart"><FiShoppingCart /></Link>
                    </button>
                    
                    <button data-tooltip-target="tooltip-profile" type="button" className="text-2xl inline-flex flex-col items-center justify-center px-5 rounded-e-full hover:bg-gray-50 dark:hover:bg-gray-800 group">
                    <Link href="/order"><FaListUl /></Link>
                    </button>
                    
                </div>
            </div>

        </div>
    )
}

export default BottomNavigation