//React
import { useEffect } from "react";

//Global Styles
import "./index.css";
//Redux
import { useDispatch } from "react-redux";

//React Router
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//Antd
import { BackTop } from "antd";
//Actions
import { getUserOnLoadThunk } from "./redux/slices/authSlice";

//Toastifiy
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Components
//Articles
import Article from "./components/Article/Article";
import Articles from "./components/Articles/Articles";
//Auth
import Login from "./components/Auth/Login";
import Register from "./components/Auth/register";

import Sub from "./components/Sub/Sub";
import Main from "./components/Main/Main";
import Lesson from "./components/Lesson/Lesson";
import LessonQuiz from "./components/Lesson/LessonQuiz";

import Profile from "./components/Profile/Profile";
import Courses from "./components/Courses/Courses";
import Product from "./components/Product/Product";
import Products from "./components/Products/Products";

//Layout
import MainLayout from "./components/shared/MainLayout";

import NotFound from "./components/shared/NotFound";

import PrivateRouteUser from "./components/Routes/PrivateRouteUser";
import PrivateRouteGuest from "./components/Routes/PrivateRouteGuest";

import ScrollToTop from "./components/shared/ScrollToTop";
import axios from "axios";
import Course from "./components/Course/Course";

import Books from "./components/Books/Books";
import Book from "./components/Book/Book";

import CourseQuiz from "./components/Course/CourseQuiz";
import DashboardPages from "./pages/DashboardPages";
import TestQuiz from "./components/shared/TestQuiz";
import CourseCertificate from "./components/Course/CourseCertificate";
import Certificate from "./components/Certifications/Certificate";
import ResetPassword from "./components/Auth/ResetPassword";
import NewPassword from "./components/Auth/NewPassword";
import MyCertifications from "./components/Certifications/MyCertifications";

axios.defaults.withCredentials = true;
// APP
export default function App() {
  // Hooks
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserOnLoadThunk());
  }, [dispatch]);

  return (
    <Router>
      <BackTop />
      <ScrollToTop />
      <ToastContainer
        draggable
        className="w-2/3 mt-10 md:w-1/3"
        limit={3}
        hideProgressBar
      />
      <Switch>
        {/* DashboardPages====================================================== */}
        <Route path="/admin/:path?" exact component={DashboardPages} />
        {/* SitePages=========================================================== */}
        <Route>
          <MainLayout>
            <Switch>
              {/* Guest Only */}
              <PrivateRouteGuest
                exact
                path="/register"
                component={Register}
                key="_register"
              />
               <PrivateRouteGuest
                exact
                path="/resetpassword"
                component={ResetPassword}
                key="_resetpassword"
              />
               <PrivateRouteGuest
                exact
                path="/auth/newpassword/:userToken"
                component={NewPassword}
                key="_resetpassword"
              />
              <PrivateRouteGuest
                exact
                path="/login"
                key="_login"
                component={Login}
              />
              {/* Any */}
              <Route exact path="/" component={Main} key="_main" />
              <Route
                exact
                path="/c/courses"
                component={Courses}
                key="_courses"
              />
              <Route
                exact
                path="/c/courses/:slug"
                component={Course}
                key="_courses"
              />
              <Route
                exact
                path="/s/:courseSlug/:subSlug"
                component={Sub}
                key="_sub"
              />
              <Route
                path="/p/:subSlug/:identifier/:slug"
                component={Lesson}
                key="_lesson"
              />
              <Route
                exact
                path="/articles"
                component={Articles}
                key="_articles"
              />
              <Route
                exact
                path="/articles/:id"
                component={Article}
                key="_article"
              />
              <Route
                exact
                path="/products"
                component={Products}
                key="_product"
              />
              <Route
                exact
                path="/products/:slug"
                component={Product}
                key="_products"
              />
              <Route exact path="/books" component={Books} key="_books" />
              <Route exact path="/books/:slug" component={Book} key="_book" />
              <Route exact path="/v/certificate/:identifier" component={Certificate} key="_book" />
              {/* User Only */}
              <PrivateRouteUser
                exact
                path="/course/takequiz"
                component={CourseQuiz}
                key="_course_takequiz"
              />
               <PrivateRouteUser
                exact
                path="/v/mycertifications"
                component={MyCertifications}
                key="__mycertifications"
              />
               <PrivateRouteUser
                exact
                path="/certificate/:slug"
                component={CourseCertificate}
                key="_course_takequiz"
              />
              <PrivateRouteUser
                exact
                path="/lesson/takequiz"
                component={LessonQuiz}
                key="_course_takequiz"
              />
               <PrivateRouteUser
                exact
                path="/quiz/testquiz"
                component={TestQuiz}
                key="_quiz_testquiz"
              />
              
              <PrivateRouteUser
                exact
                path="/profile"
                component={Profile}
                key="_profile"
              />
              <Route exact path="/*" component={NotFound} key="_notfound" />
            </Switch>
          </MainLayout>
        </Route>
      </Switch>
    </Router>
  );
}
