import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: [],
    totalQuantity: 0,
    totalPrice: 0, 
    uniqueItemsCount: 0, 
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCart: (state, action) => {
            state.cart = action.payload;
            cartSlice.caseReducers.getCartTotal(state);
        },

        addToCartLocal: (state, action) => {
            let find = state.cart.findIndex((item) => item.id === action.payload.id); 
            if (find >= 0) {
                state.cart[find].quantity += 1; 
            } else {
                state.cart.push({ ...action.payload, quantity: 1 }),
                state.uniqueItemsCount += 1 ; 
            }
            cartSlice.caseReducers.getCartTotal(state);
        },

        removeItemTotal: (state, action) => {
            state.cart = state.cart.filter((item) => item.id !== action.payload); 
            state.uniqueItemsCount -= 1;
            cartSlice.caseReducers.getCartTotal(state);
        },

        increaseQuantityLocal: (state, action) => {
            state.cart = state.cart.map((item) => {
                if (item.id === action.payload) {
                    return { ...item, quantity: item.quantity + 1}; 
                }
                return item; 
            }),
            cartSlice.caseReducers.getCartTotal(state);
        },

        decreaseQuantityLocal: (state, action) => {
            state.cart = state.cart.map((item) => {
                if (item.id === action.payload && item.id > 1) {
                    return { ...item, quantity: item.quantity - 1};
                }
                return item; 
            }),
            cartSlice.caseReducers.getCartTotal(state);
        },

        getCartTotal: (state) => {
            let { totalQuantity, totalPrice } = state.cart.reduce(
                (cartTotal, cartItem) => {
                    const { price, quantity } = cartItem; 
                    const itemTotal = price * quantity;
                    cartTotal.totalPrice += itemTotal;
                    cartTotal.totalQuantity += quantity; 
                    return cartTotal;
                },
                {
                    totalPrice: 0,
                    totalQuantity: 0, 
                }
            );
            state.totalPrice = parseInt(totalPrice.toFixed(2));
            state.totalQuantity = totalQuantity;
        }
    }
});

export const { setCart, addToCartLocal, removeItemLocal, increaseQuantityLocal, decreaseQuantityLocal, getCartTotal} = cartSlice.actions;
export default cartSlice.reducer;