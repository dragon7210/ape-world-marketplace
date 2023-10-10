/** @format */

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CollectionState {
  collectionOptions: any[];
  connectedCollections: any[];
}

const initialState: CollectionState = {
  collectionOptions: [],
  connectedCollections: [],
};

export const collectionSlice = createSlice({
  name: "collections",
  initialState,
  reducers: {
    setCollectionOptions: (state, action: PayloadAction<any>) => {
      return { ...state, collectionOptions: action.payload };
    },
    setconnectedCollections: (state, action: PayloadAction<any>) => {
      return { ...state, connectedCollections: action.payload };
    },
  },
});

export const { setCollectionOptions, setconnectedCollections } =
  collectionSlice.actions;

export default collectionSlice.reducer;
