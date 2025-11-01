import React from "react";
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useIncreaseQuantityMutation,
  useDecreaseQuantityMutation,
} from "../redux/api/cartApi";
import { useAddToWishlistMutation } from "../redux/api/wishlistApi";
import { useGetBookByIdQuery } from "../redux/api/bookApi";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";


const Cart = () => {
const { id } = useParams();
  const { data: cart, isLoading, isError } = useGetCartQuery();
  const { data: book} = useGetBookByIdQuery(id);
  const [removeFromCart] = useRemoveFromCartMutation();
  const [increaseQuantity] = useIncreaseQuantityMutation();
  const [decreaseQuantity] = useDecreaseQuantityMutation();
  const [addToWishlist] = useAddToWishlistMutation();

  const handleRemove = async (bookId) => {
    try {
      await removeFromCart(bookId).unwrap();
      alert("Removed from cart!");
    } catch (err) {
      console.error("Error removing item:", err);
      alert("Failed to remove item.");
    }
  };

 const handleAddToWishlist = async (bookId) => {
  try {
    await addToWishlist({ bookId }).unwrap();
    alert("Added to wishlist!");
  } catch (err) {
    console.error("Error adding to wishlist:", err);
    alert("already added in wishlist.");
  }
};


  const handleIncrease = async (bookId) => {
    try {
        await increaseQuantity(bookId).unwrap();
    } catch (err) {
        console.error("error increasing quantity : ", err);
    }
  }

  const handleDecrease = async (bookId) => {
    try {
        await decreaseQuantity(bookId).unwrap();
    } catch (err) {
        console.error("error decreasing quantity : ", err);
    }
  }

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading cart.</p>;

  console.log("cart data: ", cart);

  return (
    <>
    <div className="w-full min-h-screen bg-gray-100 flex flex-row items-center py-10 gap-5">
        <div className="w-200 ml-30 flex flex-col justify-center items-center">
            <div className="w-[800px] shadow-2xl bg-indigo-500 text-white rounded-t-xl flex justify-center items-center py-3">
              <p className="text-xl font-semibold">
                Cart ({cart?.items?.length || 0})
              </p>
            </div>

      <div className="w-[800px] bg-white p-4 flex flex-col justify-center items-center gap-4">
        {cart?.items?.length > 0 ? (
          cart.items.map((item) => (
            <div
              key={item.id}
              className="w-[800px] h-80 flex flex-col justify-between items-center border-b border-gray-300 pb-2"
            >
                
                    <p className="font-medium">Book ID: {item.bookId}</p>
                
                <div className="w-full flex flex-row justify-between item-center">
                    <div className="h-full flex justify-center pl-8 items-center">
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="flex flex-row gap-1">
                        <button 
                            onClick={() => handleDecrease(item.bookId)} 
                            className="w-12 h-10 text-2xl rounded-l-lg text-white hover:bg-indigo-600 transition-colors duration-200 cursor-pointer bg-indigo-500 flex justify-center items-center"
                        >
                            -
                        </button>
                        <div className="w-20 h-10 shadow-xl pl-2 text-gray-500 flex items-center">{item.quantity}</div>
                        <button 
                            onClick={() => handleIncrease(item.bookId)} 
                            className="w-12 mr-10 h-10 text-2xl rounded-r-lg text-white hover:bg-indigo-600 transition-colors duration-200 cursor-pointer bg-indigo-500 flex justify-center items-center"
                        >
                            +
                        </button>
                    </div>
                </div> 

              <div className="w-full h-60 flex flex-row justify-center items-center">
                <div className="w-1/3 h-60 flex justify-center items-center cursor-pointer"> 
                <Link to={`/books/${item.book.id}`}>
                    <img 
                        src={`http://localhost:8080/books/images/${item.book.coverImage}`}
                        className="w-60 h-60 object-cover rounded-xl"
                        onClick={() => navigate("/books/:id")}
                    />
                </Link>
                </div>
                <div className="w-[500px] h-60 flex flex-col">
                    <Link to={`/books/${item.book.id}`}>
                        <p className="font-bold text-xl mt-6 pr-60 hover:underline cursor-pointer">{item?.book?.title}</p>
                    </Link>
                    <p className="text-sm mr-78">by {item?.book?.author}</p>
                    <p className="text-2xl mr-90 pt-5">Rs.{item?.book?.price}/-</p>
                    <div className="w-full flex flex-row gap-5 mt-8">
                        <button
                           onClick={() => handleAddToWishlist(item.bookId)}
                           className="w-50 h-10 bg-indigo-500 hover:bg-indigo-600 transition-colors duration-200 cursor-pointer text-white px-3 py-1 rounded"
                        >
                          Add to wishlist
                        </button>
                        <button
                           onClick={() => handleRemove(item.bookId)}
                           className="w-50 h-10 bg-red-500 hover:bg-red-600 transition-colors duration-200 cursor-pointer text-white px-3 py-1 rounded"
                        >
                          Remove
                        </button>
                    </div>
                </div>
                
              </div>
            </div>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>

      
      </div>
      <div className="w-1/3 flex justify-center items-start fixed top-26 right-10 z-50">

            <div className=" w-80 bg-white h-70 shadow-2xl rounded-t-2xl flex flex-col items-center">
                <div className="w-full h-12 bg-indigo-500 text-white font-bold text-xl rounded-t-2xl flex justify-center items-center">
                    Summary
                </div>
                <div className="w-full px-5 font-bold mt-5 flex flex-row justify-between items-center">
                    <p>Total items</p>
                    <p>{cart?.items?.length}</p>
                </div>
                <div className="w-full px-5 font-bold mt-8 flex flex-row justify-between items-center">
                    <p>Total quantity</p>
                    <p>{cart?.totalQuantity}</p>
                </div>
                <div className="w-full px-5 font-bold mt-8 flex flex-row justify-between items-center">
                    <p>Total price</p>
                    <p>Rs.{cart?.cartTotal}/-</p>
                </div>
                <button className="w-70 h-10 text-white cursor-pointer bg-indigo-500 mt-6 hover:bg-indigo-600 transition-colors duration-200">
                    Go to Checkout
                </button>
            </div>
      </div>
    </div>
    </>
  );
};

export default Cart;
