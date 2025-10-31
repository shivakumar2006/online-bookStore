import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetBookByIdQuery } from "../redux/api/bookApi";
import { useAddToCartMutation } from "../redux/api/cartApi";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetWishlistQuery,
} from "../redux/api/wishlistApi";
import { useDispatch, useSelector } from "react-redux";
import { addToCartLocal } from "../redux/api/cartSlice";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { data: book, isLoading, error } = useGetBookByIdQuery(id);
  const { data: wishlist } = useGetWishlistQuery(); // ✅ get user wishlist
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const dispatch = useDispatch();

  const [popup, setPopup] = useState({ show: false, message: "", type: "" });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading book</p>;

  // ✅ Check if book is already in wishlist
  const isInWishlist = wishlist?.items?.some((b) => b.id === book.id);

  const showPopup = (message, type) => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: "", type: "" }), 2000);
  };

  const handleAddToCart = async (book) => {
    if (!user) {
      showPopup("Please login to add books", "error");
      navigate("/login");
      return;
    }

    dispatch(addToCartLocal(book));

    try {
      await addToCart({ bookId: book.id, quantity: 1 }).unwrap();
      showPopup("Book added to cart successfully!", "success");
    } catch (err) {
      console.error("Add to cart error", err);
      showPopup("Failed to add book to cart", "error");
    }
  };

  // ✅ Handle Wishlist toggle
  const handleWishlist = async () => {
    if (!user) {
      showPopup("Please login to use wishlist", "error");
      navigate("/login");
      return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlist(book.id).unwrap();
        showPopup("Removed from wishlist", "error");
      } else {
        await addToWishlist({ bookId: book.id }).unwrap();

        showPopup("Added to wishlist", "success");
      }
    } catch (err) {
      console.error("Wishlist error:", err);
      showPopup("Already in your wishlist", "error");
    }
  };

  return (
    <>
      {/* ✅ Popup */}
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
        {/* Book Image & Title */}
        <div className="w-1/3 h-auto flex flex-col items-center ml-20 pt-15">
          <img
            src={`http://localhost:8080/books/images/${book.coverImage}`}
            className="rounded-3xl shadow-2xl hover:scale-103 transition-transform duration-500 cursor-pointer"
          />
          <p className="text-4xl font-bold pt-20">{book.title}</p>
          <p className="text-2xl font-light">by {book.author}</p>
        </div>

        {/* Book Details */}
        <div className="w-1/2 flex flex-col">
          <p className="text-4xl font-bold pt-20">{book.title}</p>
          <p className="text-2xl font-light">by {book.author}</p>
          <p className="font-extralight pt-8">{book.description}</p>
          <p className="text-xl pt-8">In stock: {book.stock}</p>
          <p className="text-4xl font-light pt-6">Rs.{book.price}/-</p>
          <p className="text-xl pt-8">
            Category: <span className="font-light text-xl">{book.category}</span>
          </p>
          <p className="text-xl pt-5">
            Language: <span className="font-light text-xl">{book.language}</span>
          </p>

          {/* ✅ Add to Cart */}
          <button
            onClick={() => handleAddToCart(book)}
            disabled={isAdding}
            className="w-full h-15 bg-yellow-500 mt-10 rounded-4xl text-2xl text-white font-bold hover:bg-yellow-600 transition-colors duration-200 cursor-pointer"
          >
            {isAdding ? "Adding..." : "Add to cart"}
          </button>

          {/* ✅ Add / Remove from Wishlist */}
          <button
            onClick={handleWishlist}
            className={`w-full h-15 mt-10 rounded-4xl text-2xl text-white font-bold transition-colors duration-200 cursor-pointer ${
              isInWishlist
                ? "bg-red-500 hover:bg-red-600"
                : "bg-indigo-500 hover:bg-indigo-600"
            }`}
          >
            {isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          </button>
        </div>
      </div>
    </>
  );
};

export default BookDetails;
