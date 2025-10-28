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
        setCard: (state, action) => {
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
        }
    }
})