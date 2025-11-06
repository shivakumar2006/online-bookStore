import React, { useState, useEffect } from 'react';
import Banner from '../components/Banner';
import { useGetBooksQuery } from '../redux/api/bookApi';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAddToCartMutation } from '../redux/api/cartApi';
import { addToCartLocal } from '../redux/api/cartSlice';
import { supabase } from '../supabase';

const Content = () => {
  const { data: books, isLoading, error } = useGetBooksQuery();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

  // ✅ State for popup
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const token = useSelector((state) => state.auth.token);
    console.log("Access Token:", token);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching books</p>;

  console.log("User Data:", user);
// useEffect(() => {
//   const check = async () => {
//     const { data, error } = await supabase.auth.getSession();
//     console.log("✅ Full Supabase session response:", data);
//     console.log("❌ Any error:", error);
//   };
//   check();
// }, []);


  const handleAddToCart = async (book) => {
    if (!user) {
      setPopup({ show: true, message: "Please login to add books", type: "error" });
      navigate("/login");
      return;
    }

    // update frontend
    dispatch(addToCartLocal(book));

    try {
      await addToCart({
      bookId: book.id,
      quantity: 1,
    }).unwrap();


      // ✅ success popup
      setPopup({ show: true, message: "Book added to cart successfully!", type: "success" });
    } catch (err) {
      console.error("Add to cart error", err);
      setPopup({ show: true, message: "Failed to add book to cart", type: "error" });
    }

    // auto close after 2 sec
    setTimeout(() => setPopup({ show: false, message: "", type: "" }), 2000);
  };

  return (
    <>
      {/* ✅ Custom popup */}
      {popup.show && (
        <div
          className={`fixed top-20 left-1/2 transform -translate-x-1/2 px-5 py-3 rounded-2xl text-white shadow-lg z-50 transition-all duration-300 ${
            popup.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {popup.message}
        </div>
      )}

      {!user && (
        <div className="w-full h-10 bg-indigo-100 flex justify-center items-center flex-row gap-2">
          <p className="text-[12px] font-extralight">
            If you don't have an account
          </p>
          <button
            className="text-[14px] font-extralight hover:underline text-indigo-600 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            login / signup
          </button>
        </div>
      )}

      <div className="shadow-xl">
        <Banner />
      </div>

      <div className="w-full bg-indigo-100 flex flex-col pt-18 justify-center items-center">
        <p className="text-5xl font-bold">Check your favourite books here</p>

        <div className="w-full flex flex-wrap justify-center items-center gap-10 mt-5">
          {books?.map((book, index) => (
            <div
              key={index}
              className="w-100 h-165 bg-white rounded-3xl shadow-xl hover:scale-102 transition-transform duration-300 flex flex-col items-center"
            >
              <Link key={book.id} to={`/books/${book.id}`}>
                <img
                  src={`http://localhost:8080/books/images/${books.coverImage}`}
                  // src={`/books/images/${book.coverImage}`}
                  className="w-90 h-90 object-cover rounded-t-2xl mt-5"
                  alt={book.title}
                />
              </Link>

              <div className="w-100 px-5 mt-5 flex flex-col">
                <p className="font-bold text-3xl">{book.title}</p>
                <p className="font-bold text-md">{book.author}</p>
                <p className="font-extralight text-2xl mt-5">
                  ₹{book.price}/-
                </p>
                <p className="font-extralight text-xl mt-5">
                  <span className="font-light">In stock:</span> {book.stock}{" "}
                  <span className="text-sm">units</span>
                </p>
              </div>

              <button
                className="w-90 h-10 mt-3 bg-yellow-500 text-white rounded-3xl cursor-pointer hover:bg-yellow-600 transition-colors duration-500"
                onClick={() => handleAddToCart(book)}
                disabled={isAdding}
              >
                {isAdding ? "Adding..." : "Add to cart"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Content;
