import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { ArticleCategory } from "../types";
import { getArticleCategories } from "./articleCategoriesSlice";


export const getArticleCategory = createAsyncThunk(
  "articleCategory/getArticleCategory",
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/article/category/${id}`
      );
      return res.data;
    } catch (error) {
      if (error.response.statusText === "Not Found") {
        return rejectWithValue("not found");
      } else {
        return rejectWithValue("server error");
      }
    }
  }
);

//!Add SUBCOURSE
export const createArticleCategory = createAsyncThunk(
  "articleCategory/createArticleCategory",
  async (
    {
      title,
      description,
    }: {
      title: string;
      description: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    const data = {
      title,
      description,
    };
    try {
      const res = await axios.post(
        `http://localhost:5000/api/article/category`,
        data,
        {
          withCredentials: true,
        }
      );
      toast.success(" category created succefully.");
      dispatch(getArticleCategories());
      return res.data;
    } catch (error) {
      toast.error("A problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);

//!Edit sub
export const updatedArticleCategory = createAsyncThunk(
  "articleCategory/updatedArticleCategory",
  async (
    {
      id,
      title,
      description,
    }: {
      id: string;
      title: string;
      description: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    const data = {
      title,
      description,
    };
    try {
      const res = await axios.put(
        `http://localhost:5000/api/article/category/${id}`,
        data,
        {
          withCredentials: true,
        }
      );

      toast.success("Category updated succefully.");
      dispatch(getArticleCategories());

      return res.data;
    } catch (error) {
      toast.error("A problem has occured");

      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);

export const deleteArticleCategory = createAsyncThunk(
  "articleCategory/deleteArticleCategory",
  async ({ id }: { id: string }, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/article/category/${id}`
      );

      dispatch(getArticleCategories());
      toast.success("category deleted succefully.");
      return res.data;
    } catch (error) {
      toast.error("A problem has occured");

      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);
const articleCategoryInitialState: ArticleCategory = {
  articleCategory: null, 
  loading: true, 
  deleting: false, 
  deletingError: {}, 
  updating: false, 
  updatingError: {}, 
  posting: false, 
  postingError: {}, 
  articleCategoryModel: false, 
  editArticleCategoryModel: false, 
  editArticleCategoryModelId: null,
  notFound: false,
  loadingError: false,
};
//RTK
const articleCategorySlice = createSlice({
  name: "articleCategory",
  initialState: articleCategoryInitialState,
  reducers: {
    openArticleCategoryModel(state) {
      state.articleCategoryModel = true;
    },
    closeArticleCategoryModel(state) {
      state.articleCategoryModel = false;
    },
    openEditArticleCategoryModel(state, { payload }) {
      state.editArticleCategoryModel = true;
      state.editArticleCategoryModelId = payload.id;
    },
    closeEditArticleCategoryModel(state) {
      state.editArticleCategoryModel = false;
      state.editArticleCategoryModelId = null;
    },
  },
  extraReducers: {
    //?------------------------------GET SUBCOURSE------------------
    //*pending------------------------------
    [getArticleCategory.pending as any]: (state, _action) => {
      state.loading = true;
      state.notFound = false;
      state.loadingError = false;
    },
    //*fulfilled------------------------------
    [getArticleCategory.fulfilled as any]: (state, { payload }) => {
      state.loading = false;
      state.articleCategory = payload;
    },
    //*rejected------------------------------
    [getArticleCategory.rejected as any]: (state, { payload }) => {
      state.loading = false;
      if (payload === "not found") {
        state.notFound = true;
      } else {
        state.loadingError = true;
      }
    },
    //?------------------------------CREATE SUBCOURSE ------------------
    //*pending------------------------------
    [createArticleCategory.pending as any]: (state, _action) => {
      state.postingError = {};
      state.posting = true;
    },
    //*fulfilled------------------------------
    [createArticleCategory.fulfilled as any]: (state, _action) => {
      state.posting = false;
      state.articleCategoryModel = false;
    },
    //*rejected------------------------------
    [createArticleCategory.rejected as any]: (state, action) => {
      state.postingError = JSON.parse(action.payload);
      state.posting = false;
    },
    //?------------------------------UPDATE SUBCOURSE------------------
    //*pending------------------------------
    [updatedArticleCategory.pending as any]: (state, _action) => {
      state.updatingError = {};
      state.updating = true;
    },
    //*fulfilled------------------------------
    [updatedArticleCategory.fulfilled as any]: (state, _action) => {
      state.updating = false;
      state.editArticleCategoryModel = false;
    },
    //*rejected------------------------------
    [updatedArticleCategory.rejected as any]: (state, action) => {
      state.updatingError = JSON.parse(action.payload);
      state.updating = false;
    },
    //?------------------------------DELETE SUBCOURSE------------------
    [deleteArticleCategory.pending as any]: (state, _action) => {
      state.deleting = true;
    },
    //*fulfilled------------------------------
    [deleteArticleCategory.fulfilled as any]: (state, _action) => {
      state.deleting = false;
    },
    //*rejected------------------------------
    [deleteArticleCategory.rejected as any]: (state, action) => {
      state.deleting = false;
      state.deletingError = JSON.parse(action.payload);
    },
  },
});
export const {
  closeArticleCategoryModel,
  closeEditArticleCategoryModel,
  openArticleCategoryModel,
  openEditArticleCategoryModel,
} = articleCategorySlice.actions;

export default articleCategorySlice.reducer;
