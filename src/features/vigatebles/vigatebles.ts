import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Vigatabl } from "../../App";

export interface CounterState {
  value: number;
  vigatablesList: Vigatabl[];
  status: "idle" | "pending" | "succeeded" | "failed" | "loading";
  error: unknown;
  cart: Vigatabl[];
  vigatablesListCount: { [index: string]: number };
}

export const fetchVigatables = createAsyncThunk(
  "json/products.json",
  async () => {
    try {
      const response = await fetch(
        "https://res.cloudinary.com/sivadass/raw/upload/v1535817394/json/products.json"
      );
      return response.json();
    } catch (error) {
      // @ts-expect-error @ts-expect-error
      return error.response.data;
    }
  }
);

const initialState: CounterState = {
  value: 0,
  vigatablesList: [],
  status: "idle",
  error: null,
  cart: [],
  vigatablesListCount: {},
};

export const vigataglesSlice = createSlice({
  name: "vigatebles",
  initialState,
  reducers: {
    increment: (state, id) => {
      state.vigatablesListCount[id.payload] += 1;
    },
    decrement: (state, id) => {
      state.vigatablesListCount[id.payload] -= 1;
    },
    addToCart: (state, product) => {
      state.cart = [...state.cart, product.payload];
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchVigatables.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchVigatables.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.vigatablesList = action.payload;

        state.vigatablesListCount = action.payload?.reduce(
          (
            acc: CounterState["vigatablesListCount"],
            product: CounterState["vigatablesListCount"]
          ) => {
            acc[product.id] = 1;
            return acc;
          },
          {}
        );
      })
      .addCase(fetchVigatables.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { increment, decrement, incrementByAmount, addToCart } =
  vigataglesSlice.actions;

export default vigataglesSlice.reducer;
