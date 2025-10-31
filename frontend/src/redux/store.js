import { configureStore } from "@reduxjs/toolkit";
import { bookApi } from "./api/bookApi";
import { jwtAuthApi } from "./api/jwtAuthSlice";
import authReducer from "./api/authSlice";
import { cartApi } from "./api/cartApi";
import cartReducer from "./api/cartSlice";
import { wishlistApi } from "./api/wishlistApi";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        [bookApi.reducerPath]: bookApi.reducer,
        [jwtAuthApi.reducerPath]:jwtAuthApi.reducer,
        [cartApi.reducerPath]: cartApi.reducer,
        [wishlistApi.reducerPath]: wishlistApi.reducer,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware()
            .concat(bookApi.middleware)
            .concat(jwtAuthApi.middleware)
            .concat(cartApi.middleware)
            .concat(wishlistApi.middleware),
})

export default store;