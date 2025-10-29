import React from "react";
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
} from "../redux/api/cartApi";

const Cart = () => {
  const { data: cart, isLoading, isError } = useGetCartQuery();
  const [removeFromCart] = useRemoveFromCartMutation();

  const handleRemove = async (bookId) => {
    try {
      await removeFromCart(bookId).unwrap();
      alert("Removed from cart!");
    } catch (err) {
      console.error("Error removing item:", err);
      alert("Failed to remove item.");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading cart.</p>;

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

                <p className="font-medium">Book ID: {item.bookId}</p>
<p className="text-sm text-gray-500">Quantity: {item.quantity}</p>

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
