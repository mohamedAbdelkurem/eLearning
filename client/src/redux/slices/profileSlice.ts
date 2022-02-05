//RTK
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//Utils
import axios from "axios";
import { toast } from "react-toastify";
//Types
import { Profile } from "../types";
import { getUserOnLoadThunk } from "./authSlice";

const profileInitialState: Profile = {
  emailModal: false,
  passwordModal: false,
  updating: false,
  oldEmail: "",
  newEmail: "",
  errors: {},
  oldPassword: "",
  newPassword: "",
  bioModal: false,
};

export const updateEmail = createAsyncThunk(
  "profile/updateEmail",
  async (_, { rejectWithValue, getState, dispatch }) => {
    const { profile } = getState() as { profile: Profile };
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/updateEmail`,
        { oldEmail: profile.oldEmail, newEmail: profile.newEmail },
        { withCredentials: true }
      );
      toast.success("Your email has been updated");
      dispatch(getUserOnLoadThunk());
      return res.data;
    } catch (error) {
      toast.warn("A problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);
export const updatePassword = createAsyncThunk(
  "profile/updatePassword",
  async (_, { rejectWithValue, getState }) => {
    const { profile } = getState() as { profile: Profile };
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/updatePassword`,
        { oldPassword: profile.oldPassword, newPassword: profile.newPassword },
        { withCredentials: true }
      );

      toast.success("Your password has been updated");
      return res.data;
    } catch (error) {
      toast.warn("A problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);
export const updateUserDetails = createAsyncThunk(
  "profile/updateUserDetails",
  async (
    {
      bio,
      facebookAccount,
      instagramAccount,
      whatsappAccount,
      twitterAccount,
      linkedinAccount,
    }: {
      bio: string;
      facebookAccount: string;
      instagramAccount: string;
      whatsappAccount: string;
      twitterAccount: string;
      linkedinAccount: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/updateUserDetails`,
        {
          bio,
          facebookAccount,
          instagramAccount,
          whatsappAccount,
          twitterAccount,
          linkedinAccount,
        },
        { withCredentials: true }
      );

      toast.success("Your infos has been updated");
      dispatch(getUserOnLoadThunk());
      return res.data;
    } catch (error) {
      toast.warn("A problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);
const profileSlice = createSlice({
  name: "profile",
  initialState: profileInitialState,
  reducers: {
    // email modal
    handleOldEmailChange: (state, action) => {
      state.oldEmail = action.payload;
    },
    handleNewEmailChange: (state, action) => {
      state.newEmail = action.payload;
    },
    handleUpdateEmailModalOpen: (state) => {
      state.emailModal = true;
    },
    handleUpdateEmailModalClose: (state) => {
      state.oldEmail = "";
      state.newEmail = "";
      state.emailModal = false;
      state.errors = {};
    },
    // password modal
    handleOldPasswordChange: (state, { payload }) => {
      state.oldPassword = payload;
    },
    handleNewPasswordChange: (state, { payload }) => {
      state.newPassword = payload;
    },
    handleUpdatePasswordModalOpen: (state) => {
      state.passwordModal = true;
    },
    handleUpdatePasswordModalClose: (state) => {
      state.oldPassword = "";
      state.newPassword = "";
      state.passwordModal = false;
      state.errors = {};
    },
    // Bio modal
    handleBioModalOpen: (state) => {
      state.bioModal = true;
    },
    handleBioModalClose: (state) => {
      state.bioModal = false;
    },
  },
  extraReducers: {
    [updateEmail.pending as any]: (state, _action) => {
      state.updating = true;
      state.errors = {};
    },
    [updateEmail.fulfilled as any]: (state) => {
      state.updating = false;
      state.oldEmail = "";
      state.newEmail = "";
      state.emailModal = false;
    },
    [updateEmail.rejected as any]: (state, action) => {
      state.updating = false;
      state.errors = JSON.parse(action.payload);
    },
    ////////////////////////////////////////////////////
    [updatePassword.pending as any]: (state, _action) => {
      state.updating = true;
      state.errors = {};
    },
    [updatePassword.fulfilled as any]: (state) => {
      state.updating = false;
      state.oldPassword = "";
      state.newPassword = "";
      state.passwordModal = false;
    },
    [updatePassword.rejected as any]: (state, action) => {
      state.updating = false;
      state.errors = JSON.parse(action.payload);
    },
    ////////////////////////////////////////////////////
    [updateUserDetails.pending as any]: (state) => {
      state.updating = true;
      state.errors = {};
    },
    [updateUserDetails.fulfilled as any]: (state) => {
      state.updating = false;
      state.bioModal = false;
    },
    [updateUserDetails.rejected as any]: (state) => {
      state.updating = false;
    },
  },
});
export const {
  handleNewEmailChange,
  handleOldEmailChange,
  handleUpdateEmailModalClose,
  handleUpdateEmailModalOpen,
  handleNewPasswordChange,
  handleOldPasswordChange,
  handleUpdatePasswordModalClose,
  handleUpdatePasswordModalOpen,
  handleBioModalClose,
  handleBioModalOpen,
} = profileSlice.actions;
export default profileSlice.reducer;
