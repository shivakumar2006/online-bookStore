import { configureStore } from "@reduxjs/toolkit";
import { bookApi } from "./api/bookApi";
import { jwtAuthApi } from "./api/jwtAuthSlice";
import authReducer from "./api/authSlice";

export const store = configureStore({
    reducer: {
        [bookApi.reducerPath]: bookApi.reducer,
        [jwtAuthApi.reducerPath]:jwtAuthApi.reducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware()
            .concat(bookApi.middleware)
            .concat(jwtAuthApi.middleware),
})

export default store;