import React, { useState } from 'react';
import {IoIosBookmark} from "react-icons/io";
import Books from "../assets/login.png";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import AuthButtonWithProvider from '../auth/authWithProvider';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { supabase } from '../supabase';
import { setUser } from '../redux/api/authSlice';
import { useSignupMutation } from '../redux/api/jwtAuthSlice';

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [signupMutation, { isLoading, error }] = useSignupMutation();

    // OAuth effect (keep it for Google login)
    React.useEffect(() => {
        const checkSupabaseUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (user) {
                dispatch(setUser(user));
                navigate("/");
            }
        }
        checkSupabaseUser();
    }, [dispatch, navigate]);

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !password.trim()) {
            alert("Please enter name, email, and password.");
            return;
        }

        try {
            const result = await signupMutation({ name, email, password }).unwrap();
            if (result.token && result.user) {
                // Optional: store token if needed
                console.log("Signup success: ", result.user);
                alert("Signup successful! Please login now.");
                navigate("/login"); // redirect to login page
            }
        } catch (err) {
            console.log("Signup error:", err);
            alert(err?.data?.message || "Signup failed, User already exist, please try again.");
        }
    };

    return (
        <div className='w-full min-h-screen flex flex-row'>
            <div className='w-1/2 h-auto bg-indigo-100 flex flex-col justify-center items-center'>
                <div className='w-80 h-15 rounded-4xl bg-indigo-500 flex flex-row justify-center items-center'>
                    <p className='text-4xl text-white font-bold'>BookStore</p>
                    <IoIosBookmark className='text-4xl mt-1.5 text-white'/>
                </div>
                <p className='text-[16px] px-15 mt-5 font-bold text-center'>Discover and buy your favorite books with ease — your online bookstore built for every reader.</p>
                <img 
                    src={Books}
                    alt='booksimg'
                    className='w-100 h-100 rounded-3xl shadow-2xl mt-10'
                />
            </div>
            <div className='w-1/2 h-auto flex flex-col justify-center items-center'>
                <div className='flex flex-row'>
                    <p className='text-2xl text-indigo-500 font-bold'>BookStore</p>
                    <IoIosBookmark className='text-2xl mt-1.5 text-indigo-500'/>
                </div>
                <p className='text-3xl font-bold mt-5'>Create an account</p>
                <p className='text-gray-500 mt-2 text-[12px]'>Sign up to get started</p>

                {/* OAuth Button */}
                <div className='w-full h-12 mt-5 flex justify-center items-center'>
                    <div className='w-120 h-10'>
                        <AuthButtonWithProvider
                            Icon={FaGoogle}
                            Label={"Sign in with Google"}
                            Provider="google"
                        />
                    </div>
                </div>

                <div className='w-100 h-10 flex flex-row justify-between items-center mt-4'>
                    <div className='w-35 border-1 border-gray-200'></div>
                    <div className='text-sm text-gray-600'>Or continue with</div>
                    <div className='w-35 border-1 border-gray-200'></div>
                </div>

                <form className='flex flex-col items-center'>
                    <input 
                        type='text'
                        placeholder='your name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='w-100 h-12 border border-gray-300 pl-3 rounded-xl text-sm placeholder:text-sm'
                    />

                    <p className='text-[13px] mt-5 font-bold'>Email</p>
                    <input 
                        type='text'
                        placeholder='youremail123@gmail.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='w-100 h-12 border border-gray-300 pl-3 rounded-xl text-sm placeholder:text-sm'
                    />

                    <div className='w-100 flex flex-row justify-between items-center'>
                        <p className='text-[13px] mt-8 font-bold'>Password</p>
                    </div>

                    <div className='relative w-100 h-12'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder='......'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full h-full pl-5 pr-10 placeholder:text-2xl placeholder:border-gray-400 border border-gray-300 rounded-xl focus:outline-none focus:ring-0 text-sm'
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <button onClick={handleSignUp} className='w-100 h-12 border mt-8 border-gray-500 pl-3 rounded-xl text-lg bg-indigo-500 hover:bg-indigo-600 transition-colors duration-200 text-white cursor-pointer placeholder:text-sm flex justify-center items-center'>
                        Sign up
                    </button>
                </form>

                <div className='flex flex-row mt-5 gap-2'>
                    <p className='text-sm'>Already have an account</p>
                    <p 
                        className='text-sm text-indigo-500 hover:underline cursor-pointer'
                        onClick={() => navigate("/login")}
                    >
                        Sign in
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
