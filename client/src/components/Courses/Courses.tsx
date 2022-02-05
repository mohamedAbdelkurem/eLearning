//React
import { Breadcrumb, Button, Result, Spin } from "antd";
import { ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getCourses } from "../../redux/slices/coursesSlice";
import { State } from "../../redux/types";
import { fromNow } from "../../utils/dayjsHelper";
import MainSearch from "../Main/MainSearch";

const Courses = (): ReactElement => {
  const courses = useSelector((state: State) => state.courses);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCourses());
  }, [dispatch]);
  return (
    <section className="container p-4">
      {!courses.status && !courses.error && (
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/">
              Homepage
              <i className="ml-2 fas fa-home"></i>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Courses</Breadcrumb.Item>
        </Breadcrumb>
      )}
      <MainSearch />

      {courses.status ? (
        <Spin size="large" spinning />
      ) : courses.error ? (
        <Result
          status="500"
          title="a problem has occured"
          extra={
            <Button type="primary" onClick={() => dispatch(getCourses())}>
              reload
            </Button>
          }
        />
      ) : courses.list.length === 0 ? (
        <>
          <Result
            status="info"
            title="There's no courses"
            subTitle="try again later.."
            extra={
              <Button type="primary">
                <Link to="/">return</Link>
              </Button>
            }
          />
        </>
      ) : (
        <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {courses.list.map((course) => (
            <div className="m-2 bg-white border-b-4 rounded-t shadow-sm border-pacific-400 hover:shadow-lg hover:border-pacific-500 hover:bg-gray-200 ">
              <img
                src={`http://localhost:5000/uploads/${course.imageUrn}`}
                alt="People"
                className="object-cover w-full h-32 sm:h-48 md:h-64"
              />
              <div className="p-1 md:p-4">
                <h3 className="mb-2 text-xl font-semibold leading-tight cursor-pointer sm:leading-normal">
                  <Link to={`/c/courses/${course.slug}`}>{course.name}</Link>
                </h3>

                <div className="flex text-sm">
                  <i className="mr-2 fas fa-clock"></i>{" "}
                  <p className="leading-none">{fromNow(course.createdAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Courses;
