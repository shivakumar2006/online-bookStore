import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

import authReducer from "./api/authSlice";
import cartReducer from "./api/cartSlice";
import { bookApi } from "./api/bookApi";
import { jwtAuthApi } from "./api/jwtAuthSlice";
import { cartApi } from "./api/cartApi";
import { wishlistApi } from "./api/wishlistApi";
import { ordersApi } from "./api/ordersApi";
import { paymentApi } from "./api/paymentApi";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // only persist auth state
};

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  [bookApi.reducerPath]: bookApi.reducer,
  [jwtAuthApi.reducerPath]: jwtAuthApi.reducer,
  [cartApi.reducerPath]: cartApi.reducer,
  [wishlistApi.reducerPath]: wishlistApi.reducer,
  [ordersApi.reducerPath]: ordersApi.reducer,
  [paymentApi.reducerPath]: paymentApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(bookApi.middleware)
      .concat(jwtAuthApi.middleware)
      .concat(cartApi.middleware)
      .concat(wishlistApi.middleware)
      .concat(ordersApi.middleware)
      .concat(paymentApi.middleware),
});

export const persistor = persistStore(store);
