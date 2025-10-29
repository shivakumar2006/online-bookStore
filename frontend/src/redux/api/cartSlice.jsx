import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  totalQuantity: 0,
  totalPrice: 0,
  uniqueItemsCount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ✅ 1. Set the entire cart (used when fetching from backend)
    setCart: (state, action) => {
      state.cart = action.payload;
      cartSlice.caseReducers.getCartTotal(state);
    },

    // ✅ 2. Add item locally
    addToCartLocal: (state, action) => {
      const index = state.cart.findIndex(
        (item) => item.id === action.payload.id
      );

      if (index >= 0) {
        state.cart[index].quantity += 1;
      } else {
        state.cart.push({ ...action.payload, quantity: 1 });
        state.uniqueItemsCount += 1;
      }

      cartSlice.caseReducers.getCartTotal(state);
    },

    // ✅ 3. Remove item
    removeItemLocal: (state, action) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload);
      state.uniqueItemsCount = Math.max(state.uniqueItemsCount - 1, 0);
      cartSlice.caseReducers.getCartTotal(state);
    },

    // ✅ 4. Increase quantity
    increaseQuantityLocal: (state, action) => {
      state.cart = state.cart.map((item) => {
        if (item.id === action.payload) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      cartSlice.caseReducers.getCartTotal(state);
    },

    // ✅ 5. Decrease quantity
    decreaseQuantityLocal: (state, action) => {
      state.cart = state.cart.map((item) => {
        if (item.id === action.payload && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
      cartSlice.caseReducers.getCartTotal(state);
    },

    // ✅ 6. Recalculate totals
    getCartTotal: (state) => {
      const { totalQuantity, totalPrice } = state.cart.reduce(
        (cartTotal, cartItem) => {
          const { price, quantity } = cartItem;
          const itemTotal = price * quantity;
          cartTotal.totalPrice += itemTotal;
          cartTotal.totalQuantity += quantity;
          return cartTotal;
        },
        { totalPrice: 0, totalQuantity: 0 }
      );

      state.totalPrice = parseFloat(totalPrice.toFixed(2));
      state.totalQuantity = totalQuantity;
    },
  },
});

export const { setCart, addToCartLocal, removeItemLocal, increaseQuantityLocal, decreaseQuantityLocal, getCartTotal } = cartSlice.actions;

export default cartSlice.reducer;
