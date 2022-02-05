//RTK
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//THIRD PARTY
import axios from "axios";
//TYPES
import { Products } from "../types";

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (_,{rejectWithValue}) => {
    try {
      const res: any = await axios.get("http://localhost:5000/api/products/");
      return res.data;
    } catch (error) {
      rejectWithValue(500)
    }
  }
);
export const getProductsPaginated = createAsyncThunk(
  "products/getProductsPaginated",
  async () => {
    const res: any = await axios.get(
      `http://localhost:5000/api/products/paginated/`
    );
    return res.data;
  }
);

//InitialState
const productsInitialState: Products = {
  status: true,
  list: [],
  error: false,
  listPaginated: [],
  infos: {},
  interested:[]
};
//Reducer
const productsSlice = createSlice({
  name: "products",
  initialState: productsInitialState,
  reducers: {},
  extraReducers: {
    // Get All posts
    [getProducts.pending as any]: (state, _action) => {
      state.status = true;
      state.error = false;
    },
    [getProducts.fulfilled as any]: (state, { payload }) => {
      state.status = false;
      state.list = payload;
      state.interested =  payload.map(interest => interest.interestedPerson)
      state.error = false;
    },
    [getProducts.rejected as any]: (state, _action) => {
      state.status = false;
      state.error = true;
    },
    // Get All posts
    [getProductsPaginated.pending as any]: (state, _action) => {
      state.status = true;
      state.error = false;
    },
    [getProductsPaginated.fulfilled as any]: (state, { payload }) => {
      state.status = false;
      state.listPaginated = payload.products;
      state.error = false;
      state.infos = payload.infos;
    },
    [getProductsPaginated.rejected as any]: (state, _action) => {
      state.status = false;
      state.error = true;
    },
  },
});
export default productsSlice.reducer;
