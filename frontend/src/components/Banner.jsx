import React, { useState, useEffect } from 'react';
import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";

const Banner = () => {

   const banners = [
    { src: img1, alt: "Banner 1" },
    { src: img2, alt: "Banner 2" },
    { src: img3, alt: "Banner 3" },
   ];

   const [ current, setCurrent ] = useState(0); 

   useEffect(() => {
    const interval = setInterval(() => {
        setCurrent(prev => (prev+1) % banners.length);
    }, 3000);

    return () => clearInterval(interval)
   }, [banners.length])

  return (
    <div className="w-full h-130 overflow-hidden object-contain relative">
      {banners.map((banner, index) => (
        <img
          key={index}
          src={banner.src}
          alt={banner.alt}
          className={`w-full h-full object-cover transition-all duration-1000 absolute top-0 left-0 ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        />
      ))}
    </div>
  )
}

export default Banner;