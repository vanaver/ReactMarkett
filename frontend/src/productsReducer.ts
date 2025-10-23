import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { type Product } from './types/product';
import type { RootState } from './store';

// thunk для загрузки товаров
export const loadProducts = createAsyncThunk<Product[]>(
  'products/loadProducts',
  async () => {
    const res = await fetch('https://fakestoreapi.com/products');
    const data: Product[] = await res.json();
    return data;
  }
);

// thunk для добавления нового товара
export const addProduct = createAsyncThunk<Product, Omit<Product, 'id'>>(
  'products/addProduct',
  async (newProductData) => {
    const res = await fetch('https://fakestoreapi.com/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProductData),
    });
    const data: Product = await res.json();
    return data;
  }
);

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
  sortOrder: 'price-asc' | 'price-desc' | 'rating-desc' | null;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
  sortOrder: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSortOrder(state, action: PayloadAction<'price-asc' | 'price-desc' | 'rating-desc' | null>) {
      state.sortOrder = action.payload;

      if (state.sortOrder === 'price-asc') {
        state.items.sort((a, b) => a.price - b.price);
      } else if (state.sortOrder === 'price-desc') {
        state.items.sort((a, b) => b.price - a.price);
      } else if (state.sortOrder === 'rating-desc') {
        state.items.sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Ошибка загрузки';
      })
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.items.push(action.payload);
      });
  },
});

export const { setSortOrder } = productsSlice.actions;

export const selectProducts = (state: RootState) => state.products.items;
export const selectProductsLoading = (state: RootState) => state.products.loading;
export const selectProductsError = (state: RootState) => state.products.error;

export default productsSlice.reducer;
