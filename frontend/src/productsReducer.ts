import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type Product } from './types/product';

interface ProductsState {
  items: Product[];    
  loading: boolean;    
  error?: string | null;
  sortOrder: 'price-asc' | 'price-desc' | 'rating-desc' | null;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
  sortOrder: null,
};

export const loadProducts = createAsyncThunk<
  Product[],     
  void,              
  { rejectValue: string } 
>('products/loadProducts', async (_, { rejectWithValue }) => {
  try {
    const res = await fetch('https://fakestoreapi.com/products');
    if (!res.ok) {
      return rejectWithValue(`Ошибка загрузки: ${res.status} ${res.statusText}`);
    }
    const data: Product[] = await res.json();
    return data;
  } catch (err) {
    return rejectWithValue((err as Error).message || 'Неизвестная ошибка');
  }
});

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
    setProducts(state, action: PayloadAction<Product[]>) {
      state.items = action.payload;
      state.error = null;
    },
    addLocalProduct(state, action: PayloadAction<Product>) {
      state.items.unshift(action.payload); // добавляем в начало списка
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loadProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
      state.loading = false;
      state.items = action.payload;
      state.error = null;
    });
    builder.addCase(loadProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? action.error.message ?? 'Ошибка';
    });
  },
});

export const { setProducts, addLocalProduct, clearError } = productsSlice.actions;

export const selectProducts = (state: { products: ProductsState }) => state.products.items;
export const selectProductsLoading = (state: { products: ProductsState }) => state.products.loading;
export const selectProductsError = (state: { products: ProductsState }) => state.products.error;
export const { setSortOrder } = productsSlice.actions;

export default productsSlice.reducer;
