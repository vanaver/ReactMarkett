import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsReducer'; // импорт нашего reducer

export const store = configureStore({
  reducer: {
    products: productsReducer, // указываем, что store будет содержать “products”
  },
});

// Типы для TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
