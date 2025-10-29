import React from 'react';
import { supabase } from '../supabase';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/api/authSlice';

const authWithProvider = ({ Icon, Label, Provider}) => {

    const dispatch = useDispatch();

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: Provider,
            options: {
                redirectTo: "http://localhost:5173/"
            }
        })
        if (error) {
            alert("Authentication failed!")
            console.log("errors : ", error)
        }

        supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.access_token) {
                dispatch(setUser({
                    email: session.user.email,
                    name: session.user.user_metadata.name,
                    token: session.access_token,
                }))
            }
        })
    }


  return (
    <div>
        <div onClick={handleLogin} className='w-120 h-10 px-4 py-3 flex items-center justify-center border-indigo-400 hover:border-indigo-600 rounded-md border-1 cursor-pointer group hover:bg-indigo-100 active:scale-95 duration-150 hover:shadow-md gap-2'>
            <Icon className="text-indigo-500 text-md group-hover:text-indigo-500" />
            <p className='text-indigo-500 text-sm group-hover:text-indigo-500'>{Label}</p>
            {/* <FaChevronRight className='text-black text-base group-hover:text-black' /> */}
    </div>
    </div>
  )
}

export default authWithProvider