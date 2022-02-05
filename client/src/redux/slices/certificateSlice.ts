//RTK
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//THIRD PARTY
import axios from "axios";
import { Certification } from "../types";
import { getCourse } from "./courseSlice";
//TYPES
export const checkCertificate = createAsyncThunk(
  "course/checkCertificate",
  async ({ slug }: { slug: string }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/quizes/checkCertificate/${slug}`
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);
export const getCertificate = createAsyncThunk(
  "course/getCertificate",
  async ({ identifier }: { identifier: string }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/quizes/getCertificate/${identifier}`
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);
export const viewCertificate = createAsyncThunk(
  "course/viewCertificate",
  async ({ slug }: { slug: string }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/quizes/viewCertificate/${slug}`
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);
export const createCertificate = createAsyncThunk(
  "course/createCertificate",
  async ({ slug }: { slug: string }, { rejectWithValue,dispatch }) => {
    const data = { slug };
    try {
      const res = await axios.post(
        `http://localhost:5000/api/quizes/createCertificate/${slug}`,
        data
      );
      dispatch(checkCertificate({slug}))
      return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);
export const GetMyCertifications = createAsyncThunk(
  "course/createCertificate",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/quizes/mycertifications/`
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);
//INITIAL STATE
const certificateInitialState: Certification = {
  certificate: null,
  list: [],
  loading: false,
  loadingAll: false,
  creating: false,
};
//REDUCER
const certificateSlice = createSlice({
  name: "certificate",
  initialState: certificateInitialState,
  reducers: {},
  extraReducers: {
    // Get All posts
    [checkCertificate.pending as any]: (state, _action) => {
      state.loading = true;
    },
    [checkCertificate.fulfilled as any]: (state, { payload }) => {
      state.loading = false;
      state.certificate = payload;
    },
    [checkCertificate.rejected as any]: (state, _action) => {
      state.loading = false;
    },
    //create certificate
    [createCertificate.pending as any]: (state, _action) => {
      state.creating = true;
    },
    [createCertificate.fulfilled as any]: (state) => {
      state.creating = false;
    },
    [createCertificate.rejected as any]: (state, _action) => {
      state.creating = false;
    },
    //view certificate
    [viewCertificate.pending as any]: (state, _action) => {
      state.loading = true;
    },
    [viewCertificate.fulfilled as any]: (state, { payload }) => {
      state.loading = false;
      state.certificate = payload;
    },
    [viewCertificate.rejected as any]: (state, _action) => {
      state.loading = false;
    },
    //get certificate
    [getCertificate.pending as any]: (state, _action) => {
      state.loading = true;
    },
    [getCertificate.fulfilled as any]: (state, { payload }) => {
      state.loading = false;
      state.certificate = payload;
    },
    [getCertificate.rejected as any]: (state, _action) => {
      state.loading = false;
    },
    //get certificate
    [GetMyCertifications.pending as any]: (state, _action) => {
      state.loading = true;
    },
    [GetMyCertifications.fulfilled as any]: (state, { payload }) => {
      state.loading = false;
      state.list = payload;
    },
    [GetMyCertifications.rejected as any]: (state, _action) => {
      state.loading = false;
    },
  },
});
export default certificateSlice.reducer;
