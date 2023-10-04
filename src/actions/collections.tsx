/** @format */

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CollectionState {
  collectionOptions: any[];
}

const initialState: CollectionState = {
  collectionOptions: [],
};

export const collectionSlice = createSlice({
  name: "collectionOptions",
  initialState,
  reducers: {
    setCollectionOptions: (state, action: PayloadAction<any>) => {
      state.collectionOptions = action.payload?.collections;
    },
  },
});

export const { setCollectionOptions } = collectionSlice.actions;

export default collectionSlice.reducer;
