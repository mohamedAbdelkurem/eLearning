//RTK
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//THIRDPARTY
import axios from "axios";
import { toast } from "react-toastify";
//TYPES
import { Product } from "../types";
//ACTIONS
import { getProducts } from "./productsSlice";

//!Get Product
export const getProduct = createAsyncThunk(
  "product/getProduct",
  async ({ slug }: { slug: string }) => {
    const res = await axios.get(`http://localhost:5000/api/products/${slug}`);
    return res.data;
  }
);

//!Create Product
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (
    {
      title,
      description,
      picture,
    }: {
      title: string;
      description: string;
      picture: File | null;
    },
    { rejectWithValue, dispatch }
  ) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (picture) formData.append("picture", picture);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/products/`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Product added succefully");
      dispatch(getProducts());
      return res.data;
    } catch (error) {
      toast.error("A problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);

//!Update Product
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async (
    {
      title,
      description,
      slug,
    }: {
      title: string;
      description: string;
      slug: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    const data = {
      title,
      description,
    };
    try {
      const res = await axios.put(
        `http://localhost:5000/api/products/${slug}`,
        data,
        {
          withCredentials: true,
        }
      );
      toast.success("Product edited succefully.");
      dispatch(getProducts());
      return res.data;
    } catch (error) {
      toast.error("A problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);

//!Delete product
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async ({ slug }: { slug: string }, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/products/${slug}`
      );
      dispatch(getProducts());
      toast.success("Product deleted succefully.");
      return res.data;
    } catch (error) {
      toast.error("A problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);
//!confirmInterestedPerson
export const confirmInterestedPerson = createAsyncThunk(
  "product/confirmInterestedPerson",
  async ({ id }: { id: string }, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/products/interestedPersons/${id}`
      );
      dispatch(getProducts());
      return res.data;
    } catch (error) {
      toast.error("A problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);

export const deleteInterestedPerson = createAsyncThunk(
  "product/deleteInterestedPerson",
  async ({ id }: { id: string }, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/products/interestedPersons/${id}`
      );
      dispatch(getProducts());
      return res.data;
    } catch (error) {
      toast.error("A problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);

export const addInterest = createAsyncThunk(
  "product/addInterest",
  async (
    {
      slug,
      email,
      fullName,
    }: { slug: string; email: string; fullName: string },
    { rejectWithValue }
  ) => {
    const data = { slug, email, fullName };
    try {
      const res = await axios.post(
        `http://localhost:5000/api/products/addInterest/${slug}`,
        data
      );
      toast.success("you will get informations about this product soon");
      return res.data;
    } catch (error) {
      if (error.response.data.errors) {
        return rejectWithValue(JSON.stringify(error.response.data.errors));
      } else {
        return rejectWithValue(JSON.stringify(error.response.data.error));
      }
    }
  }
);
//Initial State
const productInitialState: Product = {
  product: null, // Product
  loading: true, // loading Product
  deleting: false, // loading delete Product
  deletingError: {}, // delete Product errors
  updating: false, // loading update Product
  updatingError: {}, // update Product errors
  posting: false, // adding Product loading
  postingError: {}, // adding Product errors
  productModel: false, // add Product model
  editProductModel: false, // update Product model
  editProductModelId: null, // ProductModelId
  interestErrors: {},
  interestLoading: false,
};

//Reducer
const productSlice = createSlice({
  name: "product",
  initialState: productInitialState,
  reducers: {
    openProductModel(state) {
      state.productModel = true;
    },
    closeProductModel(state) {
      state.productModel = false;
    },
    openEditProductModel(state, { payload }) {
      state.editProductModel = true;
      state.editProductModelId = payload.slug;
    },
    closeEditProductModel(state) {
      state.editProductModel = false;
      state.editProductModelId = null;
    },
  },
  extraReducers: {
    //?------------------------------GET PRODUCT------------------
    //*pending------------------------------
    [getProduct.pending as any]: (state) => {
      state.loading = true;
      state.interestErrors = null;
    },
    //*fulfilled------------------------------
    [getProduct.fulfilled as any]: (state, { payload }) => {
      state.loading = false;
      state.product = payload;
    },
    //*rejected------------------------------
    [getProduct.rejected as any]: (state) => {
      state.loading = false;
    },
    //?------------------------------CREATE PRODUCT------------------
    //*pending------------------------------
    [createProduct.pending as any]: (state) => {
      state.postingError = {};
      state.posting = true;
    },
    //*fulfilled------------------------------
    [createProduct.fulfilled as any]: (state) => {
      state.posting = false;
      state.productModel = false;
    },
    //*rejected------------------------------
    [createProduct.rejected as any]: (state, action) => {
      state.postingError = JSON.parse(action.payload);
      state.posting = false;
    },
    //?------------------------------UPDATE PRODUCT------------------
    //*pending------------------------------
    [updateProduct.pending as any]: (state) => {
      state.updatingError = {};
      state.updating = true;
    },
    //*fulfilled------------------------------
    [updateProduct.fulfilled as any]: (state) => {
      state.updating = false;
      state.editProductModel = false;
    },
    //*rejected------------------------------
    [updateProduct.rejected as any]: (state, action) => {
      state.updatingError = JSON.parse(action.payload);
      state.updating = false;
    },
    //?------------------------------DELETE PRODUCT------------------
    [deleteProduct.pending as any]: (state) => {
      state.deleting = true;
    },
    //*fulfilled------------------------------
    [deleteProduct.fulfilled as any]: (state) => {
      state.deleting = false;
    },
    //*rejected------------------------------
    [deleteProduct.rejected as any]: (state, action) => {
      state.deleting = false;
      state.deletingError = JSON.parse(action.payload);
    },
    //?------------------------------DELETE INTEREST------------------
    [deleteInterestedPerson.pending as any]: (state) => {
      state.updating = true;
    },
    //*fulfilled------------------------------
    [deleteInterestedPerson.fulfilled as any]: (state) => {
      state.updating = false;
    },
    //*rejected------------------------------
    [deleteInterestedPerson.rejected as any]: (state) => {
      state.updating = false;
    },
    //?------------------------------CONFIRM INTEREST------------------
    [confirmInterestedPerson.pending as any]: (state) => {
      state.updating = true;
    },
    //*fulfilled------------------------------
    [confirmInterestedPerson.fulfilled as any]: (state) => {
      state.updating = false;
    },
    //*rejected------------------------------
    [confirmInterestedPerson.rejected as any]: (state) => {
      state.updating = false;
    },
    //?------------------------------ADD INTEREST------------------
    [addInterest.pending as any]: (state) => {
      state.interestLoading = true;
      state.interestErrors = null;
    },
    //*fulfilled------------------------------
    [addInterest.fulfilled as any]: (state) => {
      state.interestLoading = false;
      state.interestErrors = null;
    },
    //*rejected------------------------------
    [addInterest.rejected as any]: (state, action) => {
      state.interestLoading = false;
      state.interestErrors = JSON.parse(action.payload);
    },
  },
});
export const {
  closeProductModel,
  closeEditProductModel,
  openProductModel,
  openEditProductModel,
} = productSlice.actions;
export default productSlice.reducer;
