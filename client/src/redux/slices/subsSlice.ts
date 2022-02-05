//RTK
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//Utils
import axios from "axios";
//Types
import { Subs } from "../types";

export const getSubsAction = createAsyncThunk(
  "courses/getSubsAction",
  async () => {
    const res: any = await axios.get("http://localhost:5000/api/subs/");
    return res.data;
  }
);
const subsInitialState: Subs = {
  status: true,
  list: [],
  filters: [],
  subsFilters:[]
};

const subsSlice = createSlice({
  name: "subs",
  initialState: subsInitialState,
  reducers: {},
  extraReducers: {
    // Get All posts
    [getSubsAction.pending as any]: (state, _action) => {
      state.status = true;
    },
    [getSubsAction.fulfilled as any]: (state, { payload }) => {
      state.status = false;
      state.list = payload;
      const arr: any = [];
      const checked: any = [];
      payload.forEach((sub) => {
        if (!checked.includes(sub.courseName)) {
          arr.push({ text: sub.courseName, value: sub.courseName });
          checked.push(sub.courseName);
        }
      });
      const arr2: any = [];
      const checked2: any = [];
      payload.forEach((sub) => {
        if (!checked2.includes(sub.SubTitle)) {
          arr.push({ text: sub.SubTitle, value: sub.SubTitle });
          checked2.push(sub.SubTitle);
        }
      });
      state.subsFilters = arr2
      state.filters = arr;
    },
    [getSubsAction.rejected as any]: (state, _action) => {
      state.status = false;
    },
  },
});
export default subsSlice.reducer;
