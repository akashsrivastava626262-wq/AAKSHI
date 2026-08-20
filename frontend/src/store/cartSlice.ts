'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, CartState } from '@/types';

const initialState: CartState = {
  items: [],
  subtotal: 0,
  itemCount: 0,
  isLoading: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<{ items: CartItem[]; subtotal: number; itemCount: number }>) => {
      state.items = action.payload.items;
      state.subtotal = action.payload.subtotal;
      state.itemCount = action.payload.itemCount;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.itemCount = 0;
    },
  },
});

export const { setCart, setLoading, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
