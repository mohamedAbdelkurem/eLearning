import AdminHome from "../components/admin/AdminHome";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminUser from "../components/admin/AdminUser/AdminUser";
import AdminCourse from "../components/admin/AdminCourse/AdminCourse";
import AdminSubCourse from "../components/admin/AdminSub/AdminSubCourse";
import AdminLesson from "../components/admin/AdminLesson/AdminLesson";
import AdminComment from "../components/admin/AdminComment/AdminComment";
import AdminBook from "../components/admin/AdminBook/AdminBook";
import AdminArticle from "../components/admin/AdminArticle/AdminArticle";
import AdminQuizTest from "../components/admin/shared/AdminQuizTest";
import AdminProduct from "../components/admin/AdminProduct/AdminProduct";
import AdminReports from "../components/admin/AdminReport/AdminReports";
import AdminCourseQuiz from "../components/admin/AdminCourse/AdminCourseQuiz";
import AdminLessonQuiz from "../components/admin/AdminLesson/AdminLessonQuiz";
import AdminArticleCategory from "../components/admin/AdminArticleCategory/AdminArticleCategory";
import PrivateRouteAdmin from "../components/Routes/PrivateRouteAdmin";
import PrivateRouteEditor from "../components/Routes/PrivateRouteEditor";
import { Switch } from "react-router";
const DashboardPages = () => {
  return (
    <AdminDashboard>
      <Switch>
        <PrivateRouteEditor
          exact
          path="/admin/home"
          component={AdminHome}
          key="_admin_home"
        />
        <PrivateRouteAdmin
          exact
          path="/admin/course"
          component={AdminCourse}
          key="_admin_course"
        />
        <PrivateRouteAdmin
          exact
          path="/admin/subcourse"
          component={AdminSubCourse}
          key="_admin_subcourse"
        />
        <PrivateRouteAdmin exact path="/admin/lesson" component={AdminLesson} />
        <PrivateRouteAdmin
          exact
          path="/admin/comment"
          component={AdminComment}
          key="_admin_comment"
        />
        <PrivateRouteEditor
          exact
          path="/admin/article"
          component={AdminArticle}
          key="_admin_article"
        />
         <PrivateRouteEditor
          exact
          path="/admin/articlecategory"
          component={AdminArticleCategory}
          key="_admin_article_category"
        />
        <PrivateRouteEditor
          exact
          path="/admin/books"
          component={AdminBook}
          key="_admin_books"
        />
        <PrivateRouteAdmin
          exact
          path="/admin/user"
          component={AdminUser}
          key="_admin_user"
        />
        <PrivateRouteAdmin
          exact
          path="/admin/coursequiz"
          component={AdminCourseQuiz}
          key="_admin__course_quiz"
        />
        <PrivateRouteAdmin
          exact
          path="/admin/lessonquiz"
          component={AdminLessonQuiz}
          key="_admin__lesson_quiz"
        />
        <PrivateRouteAdmin
          exact
          path="/admin/report"
          component={AdminReports}
          key="_admin__report"
        />
        <PrivateRouteAdmin
          exact
          path="/admin/testquiz"
          component={AdminQuizTest}
          key="_admin_quiz_test"
        />

        <PrivateRouteAdmin
          exact
          path="/admin/product"
          component={AdminProduct}
          key="_admin_product"
        />
      </Switch>
    </AdminDashboard>
  );
};

export default DashboardPages;
