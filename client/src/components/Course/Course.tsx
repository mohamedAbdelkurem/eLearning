//React
import { useEffect, useState } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
//Redyx
import { useDispatch, useSelector } from "react-redux";
//Antd
import { Breadcrumb, Button, Progress, Spin, Tooltip } from "antd";
import {
  CheckCircleOutlined,
  HeartOutlined,
  LockOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
//states
import { State } from "../../redux/types";
//Components
import PostSharing from "../Lesson/LessonSharing";
//Dayjs
import { formatDate, fromNow } from "../../utils/dayjsHelper";
import classnames from "classnames";
//actions
import { getCourse, getCourseProgress } from "../../redux/slices/courseSlice";
//draftjs
import draftToHTML from "draftjs-to-html";
import parse from "html-react-parser";
import Modal from "antd/lib/modal/Modal";
import ReactPlayer from "react-player";
import {
  checkCertificate,
  createCertificate,
} from "../../redux/slices/certificateSlice";
//types

interface ParamTypes {
  slug: string;
}
function Course() {
  const { pathname } = useLocation();

  const dispatch = useDispatch();
  const { slug } = useParams<ParamTypes>();
  useEffect(() => {
    dispatch(getCourse({ slug }));
    dispatch(checkCertificate({ slug }));
    dispatch(getCourseProgress({ slug }));
  }, [pathname, slug, dispatch]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const history = useHistory();
  const {
    course,
    loading,
    progress,
    progressError,
    progressLoading,
  } = useSelector((state: State) => state.course);
  const certificate = useSelector((state: State) => state.certificate);
  const auth = useSelector((state: State) => state.auth);
  //tabs
  const [description, setDescription] = useState(true);
  const [details, setDetails] = useState(false);
  const [preview, setPreview] = useState(false);
  return (
    <div className="container px-5 py-4">
      <div className="mb-2">
        {/* BREADCRUMB*/}
        <Breadcrumb>
          <Breadcrumb.Item href="">
            <Link to="/">
              Homepage
              <i className="ml-2 fas fa-home"></i>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/c/courses">Courses</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {!loading && <span>{course.name}</span>}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      {loading ? (
        <Spin size="large" spinning />
      ) : (
        <div className="w-full col-span-4 p-4 bg-white rounded shadow-md md:col-span-3">
          <section className="overflow-hidden text-gray-600 divide-y divide-gray-300 body-font">
            <div className="px-5 py-12 mx-auto ">
              <div className="grid w-full grid-cols-1 gap-5 mx-auto md:grid-cols-2 lg:w-4/5 justify-items-auto">
                <div className="flex items-center justify-center w-full border border-gray-400 ">
                  <div className="w-full col-span-6 bg-white shadow-lg lg:col-span-2 md:col-span-3 ">
                    <div className="relative flex ">
                      <div className="relative z-10 w-full ">
                        <div
                          className="object-cover w-full bg-center bg-cover h-72 "
                          style={{
                            backgroundImage: `url(http://localhost:5000/uploads/${course.imageUrn})`,
                          }}
                        ></div>
                      </div>
                      {course.preview && (
                        <img
                          onClick={() => {
                            setPreview(true);
                          }}
                          alt="gallery"
                          className="absolute inset-0 z-30 flex items-center justify-center object-cover w-full h-full transition-all bg-gray-700 bg-opacity-50 opacity-0 cursor-pointer hover:opacity-70"
                          src="https://www.creativefabrica.com/wp-content/uploads/2019/12/11/play-button-icon-Graphics-1-8-580x386.jpg"
                        />
                      )}
                    </div>
                    {course.preview && (
                      <Modal
                        destroyOnClose
                        visible={preview}
                        onCancel={() => setPreview(false)}
                        footer={() => {
                          <p>cancel</p>;
                        }}
                      >
                        <ReactPlayer
                          controls
                          config={{
                            youtube: {
                              playerVars: { showinfo: 1 },
                            },
                          }}
                          width="100%"
                          url={`${course.preview}`}
                          className="react-player"
                        />
                      </Modal>
                    )}
                  </div>
                </div>

                <div className="w-full col-span-2 mb-6 lg:pr-10 lg:py-6 lg:mb-0 md:col-span-1">
                  <h1 className="mb-4 text-3xl font-medium text-gray-900 title-font">
                    {course.name}
                  </h1>
                  <div className="flex mb-4">
                    <p
                      onClick={() => {
                        setDescription(true);
                        setDetails(false);
                      }}
                      className={classnames(
                        "flex-grow px-1 py-2 text-lg border-b-2  transition-all cursor-pointer",
                        description
                          ? "border-pacific-500 text-pacific-500"
                          : "border-gray-300 text-gray-600"
                      )}
                    >
                      Description
                    </p>
                    <p
                      onClick={() => {
                        setDescription(false);
                        setDetails(true);
                      }}
                      className={classnames(
                        "flex-grow px-1 py-2 text-lg border-b-2 transition-all cursor-pointer",
                        details
                          ? "border-pacific-500 text-pacific-500"
                          : "border-gray-300 text-gray-600"
                      )}
                    >
                      Details
                    </p>
                  </div>
                  {description && (
                    <div className="divide-y divide-gray-300">
                      <div className="flex flex-col divide-gray-300">
                        <Tooltip title={formatDate(course.createdAt)}>
                          {
                            <span className="mb-1 leading-relaxed text-gray-600 cursor-pointer">
                              created: {fromNow(course.createdAt)}
                            </span>
                          }
                        </Tooltip>
                        <Tooltip title={formatDate(course.updatedAt)}>
                          {
                            <span className="mb-1 leading-relaxed text-gray-600 cursor-pointer">
                              latest updated: {fromNow(course.updatedAt)}
                            </span>
                          }
                        </Tooltip>
                      </div>
                      <p className="mt-2 mb-4 ">{course.description}</p>
                    </div>
                  )}

                  {details && (
                    <p className="mb-4 leading-relaxed break-words ">
                      {parse(draftToHTML(JSON.parse(course.details)))}
                    </p>
                  )}
                  <div className="flex space-x-2">
                    {/* <div>
                      <Button
                        className="bg-pacific-500"
                        type="primary"
                        icon={<HeartOutlined />}
                      >
                        Enroll
                      </Button> 
                      </div>*/}

                    {auth.isAuthenticated &&
                      auth.user?.emailConfirmed &&
                      course.quizesCourse?.length > 0 && (
                        <div>
                          {course.courseResult ? (
                            <Button
                              type="ghost"
                              className="text-green-500"
                              icon={<CheckCircleOutlined />}
                              onClick={() =>
                                history.push("/quiz/testquiz", {
                                  quiz: JSON.parse(course.quizesCourse[0].quiz),
                                  slug,
                                })
                              }
                            >
                              quiz
                            </Button>
                          ) : progress.finishedAllLessonQuizs ? (
                            <Button
                              type="dashed"
                              icon={<PaperClipOutlined />}
                              onClick={() =>
                                history.push("/course/takequiz", {
                                  quiz: JSON.parse(course.quizesCourse[0].quiz),
                                  slug,
                                })
                              }
                            >
                              Final Quiz
                            </Button>
                          ) : (
                            <Tooltip title="finsih all lessons quiz to unlock">
                              <Button
                                disabled
                                icon={<LockOutlined />}
                                type="dashed"
                              >
                                Final Quiz
                              </Button>
                            </Tooltip>
                          )}
                        </div>
                      )}
                  </div>
                  {auth.isAuthenticated && auth.user?.emailConfirmed && (
                    <div>
                      {progressLoading || certificate.loading ? (
                        <Spin size="small" spinning />
                      ) : !progress.progress ? (
                        <></>
                      ) : (
                        <div>
                          progress:
                          <Progress
                            percent={Number(progress.progress.toFixed(2))}
                            status={
                              Number(progress.progress) === 100
                                ? "success"
                                : "active"
                            }
                          />
                          {Number(progress.progress) === 100 &&
                            (certificate.certificate ? (
                              <Link to={`/certificate/${slug}`}>
                                <Button type="dashed">view certificate</Button>
                              </Link>
                            ) : (
                              <Button
                                loading={certificate.creating}
                                danger
                                type="dashed"
                                onClick={() =>
                                  dispatch(createCertificate({ slug }))
                                }
                              >
                                claim certificate
                              </Button>
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <h2 className="text-lg font-semibold">Sections:</h2>
              {course.subs.length > 0 ? (
                course.subs.map((sub) => {
                  return (
                    <div className="w-full p-3 my-2 bg-gray-200 border border-gray-300 rounded shadow-md cursor-pointer hover:bg-gray-300 ">
                      <Link to={`/s/${slug}/${sub.slug}`}>
                        <p className="font-medium">{sub.title}</p>
                      </Link>
                    </div>
                  );
                })
              ) : (
                <div className="p-3 my-2 bg-gray-200 rounded shadow-md cursor-pointer ">
                  <p className="font-medium">
                    This course does not have any sections
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
      <PostSharing />
    </div>
  );
}
//types
interface ParamTypes {
  id: string;
}
export default Course;
