import React, { useState, useEffect } from 'react'; 
import "./App.css";
import Navbar from './components/Navbar';
import Content from "./pages/content";
import BookDetails from './pages/BookDetails';
import Footer from "./components/Footer";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Signup from "./pages/signup";
import ForgotPassword from './pages/ForgotPassword';
import { Routes, Route, useLocation } from "react-router-dom";
import ResetPassword from './pages/ResetPassword';
import Cart from './pages/Cart';
import { supabase } from './supabase';
import { useDispatch } from 'react-redux';
import { setUser } from './redux/api/authSlice';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Cancel from './pages/Cancel';
import Orders from './pages/Orders';
import { restoreUserFromStorage } from './redux/api/authSlice';
import { useSelector } from "react-redux";
import { useVerifyTokenQuery } from "./redux/api/jwtAuthSlice";
import { logOutUser } from "./redux/api/authSlice";

const App = () => {

    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);

  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    dispatch(restoreUserFromStorage());
  }, [dispatch]);

  const { data: verifyData, error: verifyError, isLoading: verifyLoading } = useVerifyTokenQuery(undefined, {
  skip: !token,
});

useEffect(() => {
  if (verifyData && verifyData.user) {
    dispatch(setUser({ user: verifyData.user, token }));
  }

  if (verifyError) {
    dispatch(logOutUser());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}, [verifyData, verifyError, dispatch, token]);


  const location = useLocation();

  // Paths where you don't want Navbar & Footer
  const hideLayout = ["/login", "/signup", "/forgot-password", "/reset-password", "/success", "/cancel"].includes(location.pathname);

  return (
    <>
    
      {!hideLayout && <Navbar />}
      <div className={`${!hideLayout ? "pt-16" : ""}`}>
        <Routes>
          <Route path="/" element={<Content />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path='/signup' element={<Signup />}/>
          <Route path='/forgot-password' element={<ForgotPassword />}/>
          <Route path='/reset-password' element={<ResetPassword />}/>
          <Route path='/cart' element={<Cart />}/>
          <Route path='/wishlist' element={<Wishlist />}/>
          <Route path='/checkout' element={<Checkout />}/>
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path='/orders' element={<Orders />}/>
        </Routes>
      </div>
      {!hideLayout && <Footer />}
    </>
  );
};

export default App;
