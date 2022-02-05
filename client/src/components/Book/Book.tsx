//React
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
//Redyx
import { useDispatch, useSelector } from "react-redux";
//Antd
import { Breadcrumb, Button, Image, Spin } from "antd";
//states
import { State } from "../../redux/types";
//Components
import PostSharing from "../Lesson/LessonSharing";
//Dayjs
import { fromNow } from "../../utils/dayjsHelper";
//actions
import { getBook } from "../../redux/slices/bookSlice";
//Other libraries
import draftToHTML from "draftjs-to-html";
import parse from "html-react-parser";
import Modal from "antd/lib/modal/Modal";
import ResponsiveEmbed from "react-responsive-embed";
import { Document, pdfjs, Page } from "react-pdf";
//types
interface ParamTypes {
  slug: string;
}
function Book() {
  const { pathname } = useLocation();

  const dispatch = useDispatch();
  const { slug } = useParams<ParamTypes>();
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    dispatch(getBook({ slug }));
  }, [pathname, slug, dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const [preview, setPreview] = useState(false);
  const { book, loading } = useSelector((state: State) => state.book);
  const [numPages, setNumPages] = useState(null);
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
            <Link to="/books">Books</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {!loading && <span>{book.title}</span>}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      {loading ? (
        <Spin size="large" spinning />
      ) : (
        <div className="col-span-4 p-1 bg-white md:col-span-3">
          <section className="overflow-hidden text-gray-600 body-font">
            <div className="px-5 py-12 mx-auto ">
              <div className="grid w-full grid-cols-1 gap-5 mx-auto md:grid-cols-2 lg:w-4/5 justify-items-center">
                <div className="flex items-center justify-center w-full border border-gray-400 ">
                  <Image
                    alt="product"
                    src={`http://localhost:5000/uploads/${book.imageUrn}`}
                  />
                </div>
                {/* <div className="grid grid-cols-2 gap-5 mx-auto lg:w-4/5">
                <Image
                  alt="book"
                  className="col-span-2 md:col-span-1"
                  src={`http://localhost:5000/uploads/${book.imageUrn}`}
                /> */}
                <div className="w-full col-span-2 mb-6 divide-y-2 divide-gray-300 lg:pr-10 lg:py-6 lg:mb-0 md:col-span-1">
                  <h1 className="mb-4 text-3xl font-medium text-gray-900 title-font">
                    {book.title}
                  </h1>
                 
                  <p>added:{fromNow(book.createdAt)}</p>
                  <h3 className="mb-4 text-xl font-medium text-pacific-700 title-font">
                    Description:
                  </h3>
                 
                  <p className="mb-4 leading-relaxed">
                    {parse(draftToHTML(JSON.parse(book.description)))}
                  </p>
                  <div className="flex">
                    <button
                      className="flex px-6 py-2 ml-auto text-white border-0 rounded bg-pacific-500 focus:outline-none hover:bg-pacific-600"
                      onClick={() => setPreview(true)}
                    >
                      View
                    </button>
                    <Modal
                      visible={preview}
                      destroyOnClose
                      className="overflow-hidden"
                      footer={[
                        <Button key="back" onClick={() => setPreview(false)}>
                          Return
                        </Button>,
                        <a
                          href={
                            book.link
                              ? book.link
                              : `http://localhost:5000/uploads/books/${book.fileUrn}`
                          }
                        >
                          <Button
                            key="View"
                            type="primary"
                            onClick={() => setPreview(false)}
                          >
                            View & Download
                          </Button>
                        </a>,
                      ]}
                      onCancel={() => setPreview(false)}
                    >
                      <div className="overflow-auto h-96">
                        {book.link ? (
                          <ResponsiveEmbed
                            ratio="4:3"
                            src={book.link}
                            allowfullscreen
                          />
                        ) : (
                          <Document
                            onLoadError={console.error}
                            file={{
                              url: `http://localhost:5000/uploads/books/${book.fileUrn}`,
                            }}
                            onLoadSuccess={({ numPages }) =>
                              setNumPages(numPages)
                            }
                          >
                            {Array.apply(null, Array(numPages))
                              .map((_, i) => i + 1)
                              .map((page) => (
                                <Page pageNumber={page} width={400} />
                              ))}
                          </Document>
                        )}
                      </div>
                    </Modal>
                    <button className="inline-flex items-center justify-center w-10 h-10 p-0 ml-4 text-gray-500 bg-gray-200 border-0 rounded-full">
                      <svg
                        fill="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
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
export default Book;
