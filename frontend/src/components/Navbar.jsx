import React from 'react';
import { IoIosBookmark } from "react-icons/io";
import { FaCartShopping, FaUser } from "react-icons/fa6";
import { IoHeart } from "react-icons/io5";

const Navbar = () => {
    return (
        <div className='w-full h-16 bg-indigo-100 flex flex-row justify-between items-center shadow-xl border-b border-b-indigo-200'>
            <div className='flex flex-row ml-15 cursor-pointer hover:scale-103 transition-transform duration-300'>
                <p className='text-2xl text-indigo-600 font-bold'>BookStore</p>
                <IoIosBookmark className='text-2xl mt-1.5 text-indigo-600'/>
            </div>

            <div className='flex flex-row items-center justify-between gap-8 pr-15'>
                <input 
                    type='text'
                    placeholder='search books from here...'
                    className='w-70 h-8 pl-4 bg-white pb-0.5 text-[12px] placeholder:text-[12px] rounded-4xl'
                />

                <div className='relative w-10 h-10 rounded-full flex justify-center items-center hover:bg-indigo-200 hover:transition-transform duration-500 cursor-pointer'>
                    <FaCartShopping className='text-2xl'/>
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">2</span>
                </div>
                <div className='relative w-10 h-10 rounded-full flex justify-center items-center hover:bg-indigo-200 hover:transition-transform duration-500 cursor-pointer'>
                    <IoHeart className='text-2xl'/>
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">2</span>
                </div>

                <div className='w-12 h-12 rounded-full border flex justify-center items-center text-2xl hover:bg-indigo-200 hover:transition-transform duration-500 cursor-pointer'>
                    <FaUser />
                </div>
            </div>
        </div>
    )
}

export default Navbar; 