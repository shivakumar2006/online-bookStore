import React from 'react'
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/api/authSlice';

const profile = () => {

    const navigate = useNavigate();
  const dispatch = useDispatch();

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
    <div className='w-full min-h-screen flex justify-center items-center'>
        <button 
            className='w-50 h-10 flex justify-center items-center text-white bg-indigo-500 cursor-pointer'
            onClick={handleLogOut}
        >
            Log out
        </button>
    </div>
  )
}

export default profile