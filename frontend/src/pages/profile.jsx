import React from 'react'
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/api/authSlice';
import { useSelector } from 'react-redux';
import { cartApi } from "../redux/api/cartApi";
import { wishlistApi } from '../redux/api/wishlistApi';
import { FaShoppingCart } from "react-icons/fa";
import { IoMdHeart } from "react-icons/io";
import { BsStack } from "react-icons/bs";


const profile = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const handleLogOut = async () => {
        try{
            const { error } = await supabase.auth.signOut();
        if (error) {
            alert("Error message : ", error.message);
        } 
            dispatch(setUser(null));

            dispatch(cartApi.util.resetApiState());
            dispatch(wishlistApi.util.resetApiState());

           localStorage.removeItem("jwt_token");
           localStorage.removeItem("token"); // just in case another key was used
           localStorage.removeItem("userId");

            console.log("logout successful");
            navigate("/login"); // Auth page par redirect

        } catch (error) {
            console.log("logout err : ", error);
        }
    }

  return (
    <div className='w-full min-h-screen flex flex-row justify-center items-center gap-20'>
        <div className='w-100 h-120 flex flex-col justify-center items-center shadow-2xl'>
            <div className='w-50 h-50 rounded-full bg-black text-white flex justify-center items-center overflow-hidden'>
              {user?.user_metadata?.avatar_url ? (
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt="Profile"
                  className='w-full h-full object-cover rounded-full'
                />
              ) : (
                <span className='text-lg font-semibold'>No Profile Photo</span>
              )}
            </div>


            <p className='text-3xl font-bold mt-5'>{user?.user_metadata?.name || user?.name}</p>
            <p className='text-sm font-bold mt-5'>{user?.user_metadata?.email || user?.email}</p>

            <button 
            className='w-50 h-10 mt-10 flex justify-center items-center text-white bg-indigo-500 hover:bg-indigo-600 transition-colours duration-200 rounded-3xl cursor-pointer'
            onClick={handleLogOut}
        >
            {!user ? "login first" : "Log out"}
        </button>
        </div>

        <div className='w-80 h-80 flex flex-col justify-around items-center'>
            <button onClick={() => navigate("/cart")} className='w-full h-20 rounded-xl hover:border-2 border hover:bg-blue-50 border-blue-300 flex flex-row gap-15 justify-center items-center transition-colors duration-200 cursor-pointer'>
                <FaShoppingCart className='w-20 h-13 mr-15'/>
                <p className='text-4xl font-bold mr-10'>Cart</p>
            </button>

            <button onClick={() => navigate("/wishlist")} className='w-full h-20 rounded-xl hover:border-2 border hover:bg-green-50 border-green-300 flex flex-row gap-15 justify-center items-center transition-colors duration-200 cursor-pointer'>
                <IoMdHeart className='w-30 h-13'/>
                <p className='text-4xl font-bold mr-10'>Wishlist</p>
            </button>

            <button onClick={() => navigate("/orders")} className='w-full h-20 rounded-xl hover:border-2 border hover:bg-indigo-50 border-indigo-300 flex flex-row gap-15 justify-center items-center transition-colors duration-200 cursor-pointer'>
                <BsStack className='w-30 h-13'/>
                <p className='text-4xl font-bold mr-10'>Orders</p>
            </button>
        </div>
    </div>
  )
}

export default profile