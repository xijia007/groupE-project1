import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAllProducts = createAsyncThunk(
  "products/fetchAll",
  async () => {
    const response = await fetch("/api/products");
    const data = await response.json();
    if (data.success) {
      return data.data;
    } else {
      throw new Error("Failed to fetch products");
    }
  },
);
export const searchProducts = createAsyncThunk(
  "products/search",
  async (query) => {
    const response = await fetch(
      `/api/products/search?name=${encodeURIComponent(query)}`,
    );
    const data = await response.json();
    if (data.success) {
      return data.data;
    } else {
      throw new Error("Failed to search products");
    }
  },
);
const productsSlice = createSlice({
  name: "products",
  initialState: {
    allItems: [],
    searchItems: [],
    mode: "all", // 'all' or 'search'
    query: "",
  },
  reducers: {
    setQuery(state, action) {
      state.query = action.payload;
      const trimmed = state.query.trim();
      if (trimmed.length >= 1) {
        state.mode = "search";
      } else {
        state.mode = "all";
      }
    },
    clearSearch(state) {
      state.query = "";
      state.mode = "all";
      state.searchItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.allItems = action.payload;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchItems = action.payload;
      });
  },
});

export const { setQuery, clearSearch } = productsSlice.actions;
export default productsSlice.reducer;
