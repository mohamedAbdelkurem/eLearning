//React
import { ReactElement, useEffect } from "react";

//Redux
import { useDispatch, useSelector } from "react-redux";

//Actions
import { getLatestCourses } from "../../redux/slices/coursesSlice";
import { getLessonsLimited } from "../../redux/slices/lessonsSlice";

//Types
import { State } from "../../redux/types";

//Components
import MainArticles from "./MainArticles";
import MainSearch from "./MainSearch";
import MainDescription from "./MainDescription";
import { getArticlesPaginated } from "../../redux/slices/articlesSlice";
import MainFeatures from "./MainFeatures";
import MainTeam from "./MainTeam";
import MainTests from "./MainTests";
import MainCourses from "./MainCourses";
import MainC from "./MainC";
import MainProducts from "./MainProducts";
import { getProducts, getProductsPaginated } from "../../redux/slices/productsSlice";
import { Spin } from "antd";

const Main = (): ReactElement => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getLatestCourses());
    dispatch(getLessonsLimited());
    dispatch(getArticlesPaginated({ current: 1 }));
    dispatch(getProducts());
  }, [dispatch]);

  const courses = useSelector((state: State) => state.courses);
  const articles = useSelector((state: State) => state.articles);
  const products = useSelector((state: State) => state.products);
  return (
    <div>
      {courses.status || articles.status || products.status ? (
        <Spin spinning />
      ) : (
        <>
          <div className="flex flex-col items-center ">
            <MainC />
          </div>
          <MainCourses courses={courses.listLimited} />
          <MainArticles articles={articles.listPaginated} />
          <MainProducts products={products.list} loading={products.status} />
          <MainTeam />
          <MainFeatures />
          <MainTests />
        </>
      )}
    </div>
  );
};

export default Main;
