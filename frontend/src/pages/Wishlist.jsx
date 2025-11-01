import React from 'react'
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '../redux/api/wishlistApi';
import { Link } from 'react-router-dom';
import { useAddToCartMutation } from '../redux/api/cartApi';


const Wishlist = () => {

    const userId = localStorage.getItem("userId"); // or from auth state
    const { data: wishlistApi, isLoading, isError, refetch } = useGetWishlistQuery(userId);
    const [removeFromWishlist] = useRemoveFromWishlistMutation();
    const [addToCart] = useAddToCartMutation();


    if (isLoading) return <p>Loading...</p>
    if (isError) return <p>Error fetching data</p>

    console.log("wihslist data: ", wishlistApi);

    const handleAddToCart = async (bookId) => {
      try {
        await addToCart({ bookId, quantity: 1 }).unwrap();
        alert("Book added to cart");
      } catch (err) {
        console.error("Error adding to cart", err);
        alert("Already in cart");
      }
    };

    const handleRemoveFromWishlist = async (bookId) => {
      try {
        await removeFromWishlist({ bookId }).unwrap();
        alert("Book removed from wishlist");
        refetch();
      } catch (err) {
        console.error("Error removing from wishlist", err);
        alert("Failed to remove from wishlist");
      }
    };


  return (
    <>
   <div className="w-full min-h-screen bg-gray-100 flex flex-row justify-center items-center">
  <div className="w-200 flex flex-col justify-center items-center">
    <div className="w-[800px] shadow-2xl bg-indigo-500 text-white rounded-t-xl flex justify-center items-center py-3">
      <p className="text-xl font-semibold">
        Wishlist ({wishlistApi?.length || 0})
      </p>
    </div>

    <div className="w-[800px] bg-white p-4 flex flex-col justify-center items-center gap-4">
      {wishlistApi?.map((item) => (
        <div
          key={item.id}
          className="w-[800px] h-80 flex flex-col justify-between items-center border-b border-gray-300 pb-2"
        >
          <p className="font-medium">Book ID: {item.id}</p>

          <div className="w-full h-60 flex flex-row justify-center items-center">
            <div className="w-1/3 h-60 flex justify-center items-center cursor-pointer">
              <Link to={`/books/${item.id}`}>
                <img
                  src={`http://localhost:8080/books/images/${item.coverImage}`}
                  alt={item.title}
                  className="w-60 h-60 object-cover rounded-xl"
                />
              </Link>
            </div>

            <div className="w-[500px] h-60 flex flex-col">
              <Link to={`/books/${item.id}`}>
                <p className="font-bold text-xl mt-6 pr-60 hover:underline cursor-pointer">
                  {item.title}
                </p>
              </Link>
              <p className="text-sm mr-78">by {item.author}</p>
              <p className="text-2xl mr-90 pt-5">Rs. {item.price}/-</p>

              <div className="w-full flex flex-row gap-5 mt-8">
                <button onClick={() => handleAddToCart(item.id)} className="w-50 h-10 bg-indigo-500 hover:bg-indigo-600 transition-colors duration-200 cursor-pointer text-white px-3 py-1 rounded">
                  Add to Cart
                </button>
                <button onClick={() => handleRemoveFromWishlist(item.id)} className="w-50 h-10 bg-red-500 hover:bg-red-600 transition-colors duration-200 cursor-pointer text-white px-3 py-1 rounded">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

    </>
  );
}

export default Wishlist