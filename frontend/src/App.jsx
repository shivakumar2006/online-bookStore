import React from 'react'; 
import "./App.css";
import Navbar from './components/Navbar';
import Content from "./pages/content";
import BookDetails from './pages/BookDetails';
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";

const App = () => {
    return (
        <>
            <Navbar />
           <div className="pt-16"> 
                <Routes>
                    <Route path="/" element={<Content />} />
                    <Route path="/books/:id" element={<BookDetails />} />
                </Routes>
            </div>
            <Footer />
        </>
    )
}

export default App;