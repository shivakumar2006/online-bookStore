import React from "react";
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useIncreaseQuantityMutation,
  useDecreaseQuantityMutation,
} from "../redux/api/cartApi";
import { Link } from "react-router-dom";


const Cart = () => {
  const { data: cart, isLoading, isError } = useGetCartQuery();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [increaseQuantity] = useIncreaseQuantityMutation();
  const [decreaseQuantity] = useDecreaseQuantityMutation();

  const handleRemove = async (bookId) => {
    try {
      await removeFromCart(bookId).unwrap();
      alert("Removed from cart!");
    } catch (err) {
      console.error("Error removing item:", err);
      alert("Failed to remove item.");
    }
  };

  const handleIncrease = async (bookId) => {
    await increaseQuantity(bookId);
  }

  const handleDecrease = async (bookId) => {
    await decreaseQuantity(bookId);
  }

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading cart.</p>;

  console.log("cart data: ", cart);

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center py-10">
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
                            onClick={handleIncrease} 
                            className="w-12 h-10 text-2xl rounded-l-lg text-white hover:bg-indigo-600 transition-colors duration-200 cursor-pointer bg-indigo-500 flex justify-center items-center"
                        >
                            -
                        </button>
                        <div className="w-20 h-10 shadow-xl pl-2 text-gray-500 flex items-center">{item.quantity}</div>
                        <button 
                            onClick={handleDecrease} 
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
                           onClick={() => handleRemove(item.bookId)}
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
  );
};

export default Cart;
