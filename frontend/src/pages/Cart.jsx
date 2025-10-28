import React from 'react';
import { useGetCartQuery, useRemoveFromCartMutation } from '../redux/api/cartApi';

const Cart = () => {

    const { data: cart, isLoading, isError } = useGetCartQuery();
    const [removeFromCart] = useRemoveFromCartMutation();

    if (isLoading) return <p>Loading...</p>
    if (isError) return <p>Error...</p>

    const handleRemove = async(bookId) => {
        await removeFromCart(bookId)
        alert("Removed from cart");
    }

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-[600px] bg-indigo-500 text-white rounded-t-xl flex justify-center items-center py-3">
        <p className="text-xl font-semibold">
          Cart ({cart?.items?.length || 0})
        </p>
      </div>

      <div className="w-[600px] bg-white border p-4 flex flex-col gap-4">
        {cart?.items?.length > 0 ? (
          cart.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-500">{item.author}</p>
              </div>
              <button
                onClick={() => handleRemove(item.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
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