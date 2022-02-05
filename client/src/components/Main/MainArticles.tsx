//React
import { Button } from "antd";
import { ReactElement } from "react";
import { Link } from "react-router-dom";
import { fromNow } from "../../utils/dayjsHelper";

const MainArticles = ({ articles }): ReactElement => {
  return (
    <>
      {articles.length > 0 && (
        <section className="py-12 text-gray-600">
          <div className="w-20 h-1 bg-brand"></div>
          <div className="w-10 h-1 mt-2 bg-brand"></div>
          <div className="container px-5 pb-12 mx-auto">
            <div className="flex flex-col w-full text-center">
              <p className="mt-2 text-3xl font-extrabold tracking-tight text-center text-brand sm:text-4xl">
                Latest Articles
              </p>
            </div>
            <div className="grid grid-cols-1 border-gray-300 shadow-md gap-x-3 gap-y-2">
              {articles.map((article) => (
                <div className="flex flex-col w-full col-span-6 px-8 border border-l-2 border-gray-300 md:col-span-3 lg:col-span-2 ">
                  <h2 className="mb-2 overflow-hidden text-lg font-medium text-gray-900 md:truncate sm:text-xl title-font ">
                    <Link to={`/articles/${article.id}`}> {article.title}</Link>
                  </h2>
                  <p className="mb-4 text-sm leading-relaxed">
                    {fromNow(article.createdAt)}
                  </p>
                  <Button
                    type="text"
                    className="flex items-center justify-end text-blue-500 md:justify-start"
                  >
                    <Link to={`/articles/${article.id}`}>Read</Link>
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      className="w-4 h-4 ml-2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default MainArticles;
