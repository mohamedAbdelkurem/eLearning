import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

//USER
import authReducer from "./slices/authSlice";
//POST
import lessonsReducer from "./slices/lessonsSlice";
import lessonReducer from "./slices/lessonSlice";
//COURSE
import coursesReducer from "./slices/coursesSlice";
import courseReducer from "./slices/courseSlice";
//SUB
import subsReducer from "./slices/subsSlice";
import subReducer from "./slices/subSlice";
//USERS
import usersReducer from "./slices/usersSlice";
import userReducer from "./slices/userSlice";
//COMMENTS
import commentReducer from "./slices/commentSlice";
import commentsReducer from "./slices/commentsSlice";
//ARTICLES
import articleReducer from "./slices/articleSlice";
import articlesReducer from "./slices/articlesSlice";
//PROFILE
import profileReducer from "./slices/profileSlice";
//SEARCH
import searchReducer from "./slices/searchSlice";
//STATS
import statisticsReducer from "./slices/statisticsSlice";
//BOOKS
//Books
import bookReducer from "./slices/bookSlice";
import booksReducer from "./slices/booksSlice";

//ARTICLES
import productReducer from "./slices/productSlice";
import productsReducer from "./slices/productsSlice";

//REPORTS
import reportsSlice from "./slices/reportsSlice";
import certificateSlice from "./slices/certificateSlice";
import articleCategoriesSlice from "./slices/articleCategoriesSlice";
import articleCategorySlice from "./slices/articleCategorySlice";
const reducer = {
  auth: authReducer,
  //
  lessons: lessonsReducer,
  lesson: lessonReducer,
  //
  courses: coursesReducer,
  course: courseReducer,
  //
  subs: subsReducer,
  sub: subReducer,
  //
  user: userReducer,
  users: usersReducer,
  //
  comment: commentReducer,
  comments: commentsReducer,
  //
  article: articleReducer,
  articles: articlesReducer,
  //
  profile: profileReducer,
  //
  search: searchReducer,
  //
  statistics: statisticsReducer,
  //
  book: bookReducer,
  books: booksReducer,
  //
  product: productReducer,
  products: productsReducer,
  //
  reports:reportsSlice,
  //
  certificate:certificateSlice,
  //
  articleCategories:articleCategoriesSlice,
  articleCategory:articleCategorySlice
};

export default configureStore({
  reducer,
  middleware: [...getDefaultMiddleware()],
});
