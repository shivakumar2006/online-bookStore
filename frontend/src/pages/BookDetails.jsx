import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetBookByIdQuery } from "../redux/api/bookApi";
import { useAddToCartMutation } from "../redux/api/cartApi";
import { useDispatch, useSelector } from "react-redux";
import { addToCartLocal } from "../redux/api/cartSlice";

const BookDetails = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);
  const { data: book, isLoading, error } = useGetBookByIdQuery(id);
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const dispatch = useDispatch();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading book</p>;

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
    <div className="w-full min-h-screen flex flex-row gap-18">
        <div className="w-1/3 h-auto flex flex-col items-center ml-20 pt-15">
            <img 
                src={`http://localhost:8080/books/images/${book.coverImage}`}
                className="rounded-3xl shadow-2xl hover:scale-103 transition-tranform duration-500 cursor-pointer"
            />
            <p className="text-4xl font-bold pt-20">{book.title}</p>
            <p className="text-2xl font-light">by {book.author}</p>
        </div>

        <div className="w-1/2 flex flex-col">
            <p className="text-4xl font-bold pt-20">{book.title}</p>
            <p className="text-2xl font-light">by {book.author}</p>
            <p className="font-extralight pt-8">{book.description}</p>
            <p className="text-xl pt-8">In stock: {book.stock}</p>
            <p className="text-4xl font-light pt-6">Rs.{book.price}/-</p>
            <p className="text-xl pt-8">Category: <span className="font-light text-xl">{book.category}</span></p>
            <p className="text-xl pt-5">Language: <span className="font-light text-xl">{book.language}</span></p>

            <button onClick={() => handleAddToCart(book)} disabled={isAdding} className="w-100% h-15 bg-yellow-500 mt-10 rounded-4xl text-2xl text-white font-bold hover:bg-yellow-600 transition-colors duration-200 cursor-pointer">
                {isAdding ? "Adding..." : "Add to cart"}
            </button>
            <button className="w-100% h-15 bg-indigo-500 mt-10 rounded-4xl text-2xl text-white font-bold hover:bg-indigo-600 transition-colors duration-200 cursor-pointer">
                Buy now
            </button>
        </div>
    </div>
    </>
    // <div className="p-10">
    //   <h1 className="text-3xl font-bold">{book.title}</h1>
    //   <p className="text-lg">{book.author}</p>
    //   <img
    //     src={`http://localhost:8080/books/images/${book.coverImage}`}
    //     alt={book.title}
    //     className="w-96 h-96 object-cover mt-5"
    //   />
    //   <p className="mt-5">{book.description}</p>
    //   <p className="mt-2 font-semibold">Price: ${book.price}</p>
    //   <p>Stock: {book.stock}</p>
    //   <p>Category: {book.category}</p>
    //   <p>Language: {book.language}</p>
    // </div>
  );
};

export default BookDetails;
