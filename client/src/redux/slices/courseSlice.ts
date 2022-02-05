//RTK
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//THIRD PARTY
import axios from "axios";
import { toast } from "react-toastify";
//TYPES
import { Course } from "../types";
//ACTIONS
import { getCourses } from "./coursesSlice";

export const getCourse = createAsyncThunk(
  "course/getCourse",
  async ({ slug }: { slug: string }) => {
    const res = await axios.get(
      `http://localhost:5000/api/subs/course/${slug}`
    );
    return res.data;
  }
);

//!Add course
export const createCourse = createAsyncThunk(
  "course/createCourse",
  async (
    {
      name,
      description,
      picture,
      preview,
      details,
    }: {
      name: string;
      description: string;
      picture: File | null;
      details: string;
      preview: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("details", details);
    formData.append("preview", preview);
    if (picture) formData.append("picture", picture);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/subs/course`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      toast.success("Course added succefully");
      dispatch(getCourses());
      return res.data;
    } catch (error) {
      toast.error("a problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);
//!Add quiz
export const createCourseQuiz = createAsyncThunk(
  "course/createCourseQuiz",
  async (
    {
      title,
      quiz,
      slug,
    }: {
      title: string;
      quiz: string;
      slug: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    const data = { quiz, title };
    try {
      const res = await axios.post(
        `http://localhost:5000/api/quizes/addquizcourse/${slug}`,
        data,
        {
          withCredentials: true,
        }
      );
      toast.success("Quiz added succefully");
      dispatch(getCourses());
      return res.data;
    } catch (error) {
      toast.error("a problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);
//!UPDATE COURSE
export const updateCourse = createAsyncThunk(
  "course/updateCourse",
  async (
    {
      name,
      description,
      slug,
      details,
      preview,
      apperance_order,
    }: {
      name: string;
      slug: string;
      description: string;
      details: string;
      preview: string;
      apperance_order: number;
    },
    { rejectWithValue, dispatch }
  ) => {
    const data = {
      name,
      description,
      apperance_order,
      details,
      preview,
    };
    try {
      const res = await axios.put(
        `http://localhost:5000/api/subs/course/${slug}`,
        data,
        {
          withCredentials: true,
        }
      );
      toast.success("Course edited succefully.");

      dispatch(getCourses());
      return res.data;
    } catch (error) {
      toast.error("a problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);

export const deleteCourse = createAsyncThunk(
  "course/deleteCourse",
  async ({ slug }: { slug: string }, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/subs/course/${slug}`
      );
      dispatch(getCourses());
      toast.success("Course deleted succefully.");
      return res.data;
    } catch (error) {
      toast.error("a problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);
//!DELETE QUIZ COURSE
export const deleteQuizCourse = createAsyncThunk(
  "course/deleteQuizCourse",
  async ({ slug }: { slug: string }, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/quizes/deletequizcourse/${slug}`
      );
      dispatch(getCourses());
      toast.success("Quiz deleted succefully.");
      return res.data;
    } catch (error) {
      toast.error("a problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);
//!SUBMIT QUIZ COURSE RESULT

export const submitCourseQuizResult = createAsyncThunk(
  "course/submitCourseQuizResult",
  async ({ slug }: { slug: string }, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/quizes/createresultcoursequiz/${slug}`
      );
      dispatch(getCourse({ slug }));
      toast.success("You finished this quiz.");
      return res.data;
    } catch (error) {
      toast.error("a problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);
export const getCourseProgress = createAsyncThunk(
  "course/getCourseProgress",
  async ({ slug }: { slug: string }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/subs/course/progress/${slug}`
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);

//Initial State
const courseInitialState: Course = {
  course: null, // course object
  loading: true, // loading course
  deleting: false, // loading delete course
  deletingError: {}, // delete course errors
  progress: { progress: 0, finishedAllLessonQuizes: false }, //
  progressLoading: false, //
  progressError: {}, //
  updating: false, // loading update course
  updatingError: {}, // update course errors
  posting: false, // adding course loading
  postingError: {}, // adding course errors
  courseModel: false, // add course model
  editCourseModel: false, // update course model
  editCourseModelId: null,
  submitedQuizCourse: false,
};
//Reducer
const courseSlice = createSlice({
  name: "course",
  initialState: courseInitialState,
  reducers: {
    openCourseModel(state) {
      state.courseModel = true;
    },
    closeCourseModel(state) {
      state.courseModel = false;
    },
    openEditCourseModel(state, { payload }) {
      state.editCourseModel = true;
      state.editCourseModelId = payload.id;
    },
    closeEditCourseModel(state) {
      state.editCourseModel = false;
      state.editCourseModelId = null;
    },

    resetSubmitedQuizCourse(state) {
      state.submitedQuizCourse = false;
    },
  },
  extraReducers: {
    //?------------------------------GET COURSE------------------
    //*pending------------------------------
    [getCourse.pending as any]: (state) => {
      state.loading = true;
    },
    //*fulfilled------------------------------
    [getCourse.fulfilled as any]: (state, { payload }) => {
      state.loading = false;
      state.course = payload;
    },
    //*rejected------------------------------
    [getCourse.rejected as any]: (state) => {
      state.loading = false;
    },
    //?------------------------------Add Course------------------
    //*pending------------------------------
    [createCourse.pending as any]: (state) => {
      state.postingError = {};
      state.posting = true;
    },
    //*fulfilled------------------------------
    [createCourse.fulfilled as any]: (state) => {
      state.posting = false;
      state.courseModel = false;
    },
    //*rejected------------------------------
    [createCourse.rejected as any]: (state, action) => {
      state.postingError = JSON.parse(action.payload);
      state.posting = false;
    },
    //?------------------------------Add Course Quiz------------------
    //*pending------------------------------
    [createCourseQuiz.pending as any]: (state) => {
      state.posting = true;
    },
    //*fulfilled------------------------------
    [createCourseQuiz.fulfilled as any]: (state) => {
      state.posting = false;
    },
    //*rejected------------------------------
    [createCourseQuiz.rejected as any]: (state) => {
      state.posting = false;
    },
    //?------------------------------Add Course Quiz------------------
    //*pending------------------------------
    [submitCourseQuizResult.pending as any]: (state) => {
      state.loading = true;
      state.submitedQuizCourse = false;
    },
    //*fulfilled------------------------------
    [submitCourseQuizResult.fulfilled as any]: (state) => {
      state.loading = false;
      state.submitedQuizCourse = true;
    },
    //*rejected------------------------------
    [submitCourseQuizResult.rejected as any]: (state) => {
      state.loading = false;
      state.submitedQuizCourse = false;
    },
    //?------------------------------Edit Course------------------
    //*pending------------------------------
    [updateCourse.pending as any]: (state) => {
      state.updatingError = {};
      state.updating = true;
    },
    //*fulfilled------------------------------
    [updateCourse.fulfilled as any]: (state) => {
      state.updating = false;
      state.editCourseModel = false;
    },
    //*rejected------------------------------
    [updateCourse.rejected as any]: (state, action) => {
      state.updatingError = JSON.parse(action.payload);
      state.updating = false;
    },
    //?------------------------------DELETE Course------------------
    [deleteCourse.pending as any]: (state) => {
      state.deleting = true;
    },
    //*fulfilled------------------------------
    [deleteCourse.fulfilled as any]: (state) => {
      state.deleting = false;
    },
    //*rejected------------------------------
    [deleteCourse.rejected as any]: (state, action) => {
      state.deleting = false;
      state.deletingError = JSON.parse(action.payload);
    },
    //?------------------------------PROGRESS Course------------------
    [getCourseProgress.pending as any]: (state) => {
      state.progressLoading = true;
    },
    //*fulfilled------------------------------
    [getCourseProgress.fulfilled as any]: (state, action) => {
      state.progressLoading = false;
      state.progress = action.payload;
    },
    //*rejected------------------------------
    [getCourseProgress.rejected as any]: (state, action) => {
      state.progressLoading = false;
      state.progressError = JSON.parse(action.payload);
    },
  },
});
export const {
  closeCourseModel,
  closeEditCourseModel,
  openCourseModel,
  openEditCourseModel,
  resetSubmitedQuizCourse,
} = courseSlice.actions;
export default courseSlice.reducer;
