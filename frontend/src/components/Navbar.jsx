import React, { useState } from 'react';
import { IoIosBookmark } from "react-icons/io";
import { FaCartShopping, FaUser } from "react-icons/fa6";
import { IoHeart } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoginPopup from './LoginPopup';

const Navbar = () => {

    const Navigate = useNavigate();
    const dispatch = useDispatch(); 
    const [ showPopup, setShowPopup ] = useState(false);
    const user = useSelector((state) => state.auth.user);
    const profilePicture = user?.user_metadata?.picture || user?.user_metadata?.avatar_url || null;

    console.log("user data: ", user);

    const handleProfileClick = () => {
      if (!user) {
        setShowPopup(true); // show popup if not logged in
      } else {
        Navigate("/profile"); // if logged in, go to profile
      }
    };

    const handleCartClick = () => {
          if (!user) {
              setShowPopup(true);
          } else {
              Navigate("/cart")
          }
    }

    return (
        <div className='fixed z-100 w-full h-16 bg-indigo-100 flex flex-row justify-between items-center shadow-xl border-b border-b-indigo-200'>
            <div 
                className='flex flex-row ml-15 cursor-pointer hover:scale-103 transition-transform duration-300'
                onClick={() => Navigate("/")}    
            >
                <p className='text-2xl text-indigo-600 font-bold'>BookStore</p>
                <IoIosBookmark className='text-2xl mt-1.5 text-indigo-600'/>
            </div>

            <div className='flex flex-row items-center justify-between gap-8 pr-15'>
                <input 
                    type='text'
                    placeholder='search books from here...'
                    className='w-70 h-8 pl-4 bg-white pb-0.5 text-[12px] placeholder:text-[12px] rounded-4xl'
                />

                <div onClick={handleCartClick} className='relative w-10 h-10 rounded-full flex justify-center items-center hover:bg-indigo-200 hover:transition-transform duration-500 cursor-pointer'>
                    <FaCartShopping className='text-2xl'/>
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">2</span>
                </div>
                <div className='relative w-10 h-10 rounded-full flex justify-center items-center hover:bg-indigo-200 hover:transition-transform duration-500 cursor-pointer'>
                    <IoHeart className='text-2xl'/>
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">2</span>
                </div>

                <div 
                    className='w-12 h-12 rounded-full border flex justify-center items-center text-2xl hover:bg-indigo-200 hover:transition-transform duration-500 cursor-pointer'
                    onClick={handleProfileClick}
                >
                    {user?.user_metadata?.picture ? (
                    <img
                      src={user.user_metadata.picture}
                      alt="User"
                      className="w-full h-full object-cover rounded-full"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = image; // fallback image
                      }}
                    />
                  ) : (
                    <FaUser />
                  )}
                </div>
            </div>
            {showPopup && <LoginPopup onClose={() => setShowPopup(false)} />}
        </div>
    )
}

export default Navbar; 