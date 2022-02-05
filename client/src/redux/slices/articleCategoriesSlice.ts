//RTK
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//Utils
import axios from "axios";
//Typesa
import { ArticleCategories } from "../types";

export const getArticleCategories = createAsyncThunk(
  "articleCategories/getArticleCategories",
  async () => {
    const res: any = await axios.get("http://localhost:5000/api/article/categories");
    return res.data;
  }
);
const articleCategoriesInitialState: ArticleCategories = {
  status: true,
  list: [],
};

const articleCategoriesSlice = createSlice({
  name: "articleCategories",
  initialState: articleCategoriesInitialState,
  reducers: {},
  extraReducers: {
    // Get All posts
    [getArticleCategories.pending as any]: (state, _action) => {
      state.status = true;
    },
    [getArticleCategories.fulfilled as any]: (state, { payload }) => {
      state.status = false;
      state.list = payload;
    },
    [getArticleCategories.rejected as any]: (state, _action) => {
      state.status = false;
    },
  },
});
export default articleCategoriesSlice.reducer;
