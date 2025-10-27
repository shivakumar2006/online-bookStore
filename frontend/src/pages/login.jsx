import React, { useState, useEffect } from 'react';
import {IoIosBookmark} from "react-icons/io";
import Books from "../assets/login.png";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import AuthButtonWithProvider from '../auth/authWithProvider';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { supabase } from '../supabase';
import { setUser } from '../redux/api/authSlice';
import { useLoginMutation } from '../redux/api/jwtAuthSlice';

const Login = () => {
    const [loginMutation, { isLoading, error }] = useLoginMutation();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Check if OAuth user is already logged in
    useEffect(() => {
        const checkOAuthUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) return;
            if (user) {
                dispatch(setUser(user));
                navigate("/"); // redirect OAuth user directly
            }
        };
        checkOAuthUser();
    }, [dispatch, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            alert("Please enter both email and password.");
            return;
        }

        try {
            const res = await loginMutation({ email, password }).unwrap();
            console.log("JWT login response: ", res);

            // Save JWT token and user info
            localStorage.setItem("token", res.token);
            dispatch(setUser(res.user));

            navigate("/"); // redirect to main page
        } catch (error) {
            console.log("Login error: ", error);
            alert(error?.data?.message || "Login failed");
        }
    };

    return (
        <div className='w-full min-h-screen flex flex-row'>
            <div className='w-1/2 h-auto bg-indigo-100 flex flex-col justify-center items-center'>
                <div className='w-80 h-15 rounded-4xl bg-indigo-500 flex flex-row justify-center items-center'>
                    <p className='text-4xl text-white font-bold'>BookStore</p>
                    <IoIosBookmark className='text-4xl mt-1.5 text-white'/>
                </div>
                <p className='text-[16px] px-15 mt-5 font-bold text-center'>
                    Discover and buy your favorite books with ease — your online bookstore built for every reader.
                </p>
                <img src={Books} alt='booksimg' className='w-100 h-100 rounded-3xl shadow-2xl mt-10' />
            </div>

            <div className='w-1/2 h-auto flex flex-col justify-center items-center'>
                <div className='flex flex-row'>
                    <p className='text-2xl text-indigo-500 font-bold'>BookStore</p>
                    <IoIosBookmark className='text-2xl mt-1.5 text-indigo-500'/>
                </div>
                <p className='text-3xl font-bold mt-5'>Welcome back</p>
                <p className='text-gray-500 mt-2 text-[12px]'>Sign in to your account to continue</p>

                {/* OAuth */}
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

                {/* JWT Login Form */}
                <form className='flex flex-col items-center'>
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
                        <p onClick={() => navigate("/forgot-password")} className='text-[13px] mt-8 font-light hover:underline text-indigo-500 cursor-pointer'>
                            Forgot Password?
                        </p>
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

                    <button
                        onClick={handleLogin}
                        className='w-100 h-12 border mt-8 border-gray-500 pl-3 rounded-xl text-lg bg-indigo-500 hover:bg-indigo-600 transition-colors duration-200 text-white cursor-pointer placeholder:text-sm flex justify-center items-center'
                    >
                        Sign in
                    </button>   
                </form>

                <div className='flex flex-row mt-5 gap-2'>
                    <p className='text-sm'>Don't have an account</p>
                    <p 
                        className='text-sm text-indigo-500 hover:underline cursor-pointer'
                        onClick={() => navigate("/signup")}
                    >
                        Sign up
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login;
