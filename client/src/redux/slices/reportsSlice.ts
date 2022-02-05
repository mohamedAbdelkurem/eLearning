//RTK
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//THIRD PARTY
import axios from "axios";
import { toast } from "react-toastify";
//TYPES
import { Reports } from "../types";

export const getReports = createAsyncThunk("reports/getReports", async () => {
  try {
    const res: any = await axios.get("http://localhost:5000/api/reports/");
    return res.data;
  } catch (error) {
    console.log(error);
  }
});

export const deleteReport = createAsyncThunk(
  "products/deleteReport",
  async (
    { slug, identifier }: { slug: string; identifier: string },
    { dispatch }
  ) => {
    try {
      const res: any = await axios.delete(
        `http://localhost:5000/api/reports/${identifier}/${slug}`
      );
      dispatch(getReports());
      toast.success("report deleted succefully");
      return res.data;
    } catch (error) {
      console.log(error);
      toast.error("an error has occured");
    }
  }
);
export const createReport = createAsyncThunk(
  "reports/createReport",
  async ({ slug, identifier }: { slug: string; identifier: string }) => {
    try {
      const res: any = await axios.delete(
        `http://localhost:5000/api/reports/${identifier}/${slug}`
      );
      toast.success("report deleted succefully");
      return res.data;
    } catch (error) {
      console.log(error);
      toast.error("an error has occured");
    }
  }
);
//InitialState
const reportsInitialState: Reports = {
  status: true,
  list: [],
  reported: true,
  creatingReport: false,
};
//Reducer
const reportsSlice = createSlice({
  name: "reports",
  initialState: reportsInitialState,
  reducers: {
    reset(state) {
      state.reported = false;
    },
  },
  extraReducers: {
    // Get All REPORTS
    [getReports.pending as any]: (state, _action) => {
      state.status = true;
    },
    [getReports.fulfilled as any]: (state, { payload }) => {
      state.status = false;
      state.list = payload;
    },
    [getReports.rejected as any]: (state) => {
      state.status = false;
    },
    // delete REPORT
    [deleteReport.pending as any]: (state) => {
      state.status = true;
    },
    [deleteReport.fulfilled as any]: (state) => {
      state.status = false;
    },
    [deleteReport.rejected as any]: (state) => {
      state.status = false;
    },
    // Create Report
    [createReport.pending as any]: (state, _action) => {
      state.creatingReport = true;
      state.reported = false;
    },
    [createReport.fulfilled as any]: (state) => {
      state.creatingReport = false;
      state.reported = true;
    },
    [createReport.rejected as any]: (state) => {
      state.creatingReport = false;
      state.reported = false;
    },
  },
});

export default reportsSlice.reducer;
