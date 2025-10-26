import React from 'react';
import { IoIosBookmark } from "react-icons/io";
import { FaInstagram } from "react-icons/fa";
import { GrYoutube } from "react-icons/gr";
import { FaLinkedin, FaGithub } from "react-icons/fa6";
import { CgMail } from "react-icons/cg";

const Footer = () => {

  return (
    <>
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
                <a 
                  href="https://www.instagram.com/shivaa.kumar_/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                    <button className='w-12 h-12 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors duration-200 flex justify-center items-center text-2xl cursor-pointer'>
                        <FaInstagram />
                    </button>
                </a>

                <a 
                    href='https://www.youtube.com/@shivakumar2006-j'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                <button className='w-12 h-12 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors duration-200 flex justify-center items-center text-2xl cursor-pointer'>
                    <GrYoutube />
                </button>
                </a>

                <a href='https://www.linkedin.com/in/shiva-shiva-8a48002a7/'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                <button className='w-12 h-12 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors duration-200 flex justify-center items-center text-2xl cursor-pointer'>
                    <FaLinkedin />
                </button>
                </a>

                <a href='https://github.com/shivakumar2006'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                <button className='w-12 h-12 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors duration-200 flex justify-center items-center text-2xl cursor-pointer'>
                    <FaGithub />
                </button>
                </a>
                </div>
            </div>
            <div className='flex flex-col justify-center items-center'>
                <div className='w-90 h-20 bg-white rounded-4xl shadow-2xl font-extrabold text-3xl flex justify-center items-center'>
                Hi Hello World !
                </div>
                <div className='border-1 w-100 mt-10'></div>
                <p className='text-[10px] text-gray-600 mt-5'>Copyright © 2025 Shiva Kumar | Shiva Web Studio. All Rights Reserved.</p>
                <p className='text-[10px] text-gray-600'>Privacy Policy | Terms of use</p>
            </div>
            <div className='w-80 h-70 flex flex-col justify-center items-center'>
                <p className='text-3xl font-bold'>Contact me</p>
                <div className='flex flex-row gap-2 mt-5'>
                    <CgMail className='mt-1.5 '/>
                    <p className='text[10px] font-extralight'>official.shivakumar06@gmail.com</p>
                </div>
            </div>
    </div>
    </>
  )
}

export default Footer