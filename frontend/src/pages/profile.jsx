import React from 'react'
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/api/authSlice';
import { useSelector } from 'react-redux';

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

           localStorage.removeItem("jwt_token");
           localStorage.removeItem("token"); // just in case another key was used

            console.log("logout successful");
            navigate("/login"); // Auth page par redirect

        } catch (error) {
            console.log("logout err : ", error);
        }
    }

  return (
    <div className='w-full min-h-screen flex flex-col justify-center items-center'>
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
            Log out
        </button>
        </div>
    </div>
  )
}

export default profile