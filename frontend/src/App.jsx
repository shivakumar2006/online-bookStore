import React from 'react'; 
import "./App.css";
import Navbar from './components/Navbar';
import Content from "./pages/content";

const App = () => {
    return (
        <>
            <Navbar />
            <Content />
        </>
    )
}

export default App;