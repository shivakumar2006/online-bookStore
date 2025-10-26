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
            <Routes>
                <Route path="/" element={<Content />} />
                <Route path="/books/:id" element={<BookDetails />} />
            </Routes>
            <Footer />
        </>
    )
}

export default App;