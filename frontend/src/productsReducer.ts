// src/productsReducer.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { type Product } from './types/product';
import type { RootState } from './store';

export const loadProducts = createAsyncThunk<Product[]>(
  'products/loadProducts',
  async () => {
    const res = await fetch('https://fakestoreapi.com/products');
    const data: Product[] = await res.json();
    return data;
  }
);

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

export const updateProduct = createAsyncThunk<Product, Product>(
  'products/updateProduct',
  async (product) => {
    const res = await fetch(`https://fakestoreapi.com/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    const data: Product = await res.json();
    return data;
  }
);

export const deleteProduct = createAsyncThunk<number, number>(
  'products/deleteProduct',
  async (id) => {
    await fetch(`https://fakestoreapi.com/products/${id}`, { method: 'DELETE' });
    return id;
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
      if (state.sortOrder === 'price-asc') state.items.sort((a, b) => a.price - b.price);
      else if (state.sortOrder === 'price-desc') state.items.sort((a, b) => b.price - a.price);
      else if (state.sortOrder === 'rating-desc') state.items.sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Ошибка загрузки';
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export const { setSortOrder } = productsSlice.actions;
export const selectProducts = (state: RootState) => state.products.items;
export const selectProductsLoading = (state: RootState) => state.products.loading;
export const selectProductsError = (state: RootState) => state.products.error;
export default productsSlice.reducer;
