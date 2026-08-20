'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Product, WishlistState } from '@/types';

const initialState: WishlistState = {
  items: [],
  isLoading: false,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlist: (state, action: PayloadAction<{ id: string; product: Product }[]>) => {
      state.items = action.payload;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    addItem: (state, action: PayloadAction<{ id: string; product: Product }>) => {
      if (!state.items.find(i => i.product.id === action.payload.product.id)) {
        state.items.push(action.payload);
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.product.id !== action.payload);
    },
  },
});

export const { setWishlist, setLoading, addItem, removeItem } = wishlistSlice.actions;
export default wishlistSlice.reducer;
