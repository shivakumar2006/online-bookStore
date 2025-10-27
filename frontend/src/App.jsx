import React from 'react'; 
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

const App = () => {
  const location = useLocation();

  // Paths where you don't want Navbar & Footer
  const hideLayout = ["/login", "/signup", "/forgot-password", "/reset-password"].includes(location.pathname);

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
        </Routes>
      </div>
      {!hideLayout && <Footer />}
    </>
  );
};

export default App;
