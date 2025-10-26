import React from 'react';
import { IoIosBookmark } from "react-icons/io";
import { FaInstagram } from "react-icons/fa";
import { GrYoutube } from "react-icons/gr";
import { FaLinkedin, FaGithub } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className='w-full h-100 bg-indigo-100 flex flex-row justify-center items-center gap-38'>
        <div className='w-80 h-70 flex flex-col justify-center items-center gap-5'>
            <div className='flex flex-row'>
                <p className='text-2xl font-bold text-indigo-600'>BookStore</p>
                <IoIosBookmark className='text-2xl mt-1.5 text-indigo-600'/>
            </div>
            
            <p className='px-2 py-2 text-center font-light'>Discover a world of stories, knowledge, and imagination — all in one place.
                BookStore brings your favorite books closer to you, one page at a time.
            </p>
            <div className='flex flex-row gap-5'>
            <button className='w-12 h-12 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors duration-200 flex justify-center items-center text-2xl cursor-pointer'>
                <FaInstagram />
            </button>
            <button className='w-12 h-12 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors duration-200 flex justify-center items-center text-2xl cursor-pointer'>
                <GrYoutube />
            </button>
            <button className='w-12 h-12 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors duration-200 flex justify-center items-center text-2xl cursor-pointer'>
                <FaLinkedin />
            </button>
            <button className='w-12 h-12 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors duration-200 flex justify-center items-center text-2xl cursor-pointer'>
                <FaGithub />
            </button>
            </div>
        </div>
        <div className='w-90 h-20 bg-white rounded-4xl shadow-2xl font-extrabold text-3xl flex justify-center items-center'>
            Hi Hello World !
        </div>
        <div className='w-80 h-70 border'>
            
        </div>
    </div>
  )
}

export default Footer