//React
import { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
//Redyx
import { useDispatch, useSelector } from "react-redux";
//Antd
import { Breadcrumb, Image, Spin, Tooltip } from "antd";
//states
import { State } from "../../redux/types";
//draftjs
import parse from "html-react-parser";
import draftToHTML from "draftjs-to-html";
//Components
import PostSharing from "../Lesson/LessonSharing";
//Dayjs
import { formatDate, fromNow } from "../../utils/dayjsHelper";
//utils
import { CopyToClipboard } from "react-copy-to-clipboard";

//actions
import { getArticle } from "../../redux/slices/articleSlice";
import { toast } from "react-toastify";
import Avatar from "antd/lib/avatar/avatar";

function Article() {
  const { pathname } = useLocation();

  const dispatch = useDispatch();
  const { id } = useParams<ParamTypes>();
  useEffect(() => {
    dispatch(getArticle({ id }));
  }, [pathname, id, dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const article = useSelector((state: State) => state.article);

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
            <Link to="/articles">Articles</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {!article.loading && <span>{article.article.title}</span>}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      {article.loading ? (
        <Spin size="large" spinning />
      ) : (
        <div className="col-span-4 p-1 bg-white border border-gray-300 md:col-span-3">
          <div className="flex-1 min-w-0 p-3 border divide-y-4 divide-y divide-gray-300 rounded-sm">
            {/* header */}
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl ">
              {article.article.title}
            </h2>
            <div className="mt-1 sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
              <div className="flex items-center mt-2 space-x-2 text-sm text-gray-500">
                <Avatar
                  src={
                    <Image
                      src={`http://localhost:5000/uploads/profilepictures/${article.article.user.imageUrn}`}
                    />
                  }
                />
                <span className=" text-pacific-500">
                  {article.article.user.username}
                </span>
                <span className="m-3 text-gray-500">
                  {formatDate(article.article.createdAt)}
                </span>
                <div className="flex flex-row space-x-1">
                  {article.article.user.facebookAccount && (
                    <div className="flex flex-col items-center justify-center">
                      <CopyToClipboard
                        text={article.article.user.whatsappAccount}
                        onCopy={() => toast.success("Copied")}
                      >
                        <Tooltip title="copy">
                          <i className="cursor-pointer fab fa-whatsapp hover:text-green-600"></i>
                        </Tooltip>
                      </CopyToClipboard>
                    </div>
                  )}
                  {article.article.user.facebookAccount && (
                    <div className="flex flex-col items-center justify-center">
                      <CopyToClipboard
                        text={article.article.user.facebookAccount}
                        onCopy={() => toast.success("Copied")}
                      >
                        <Tooltip title="copy">
                          <i className="cursor-pointer fab fa-facebook hover:text-pacific-600"></i>
                        </Tooltip>
                      </CopyToClipboard>
                    </div>
                  )}
                  {article.article.user.linkedinAccount && (
                    <div className="flex flex-col items-center justify-center">
                      <CopyToClipboard
                        text={article.article.user.linkedinAccount}
                        onCopy={() => toast.success("Copied")}
                      >
                        <Tooltip title="copy">
                          <i className="cursor-pointer fab fa-linkedin hover:text-pacific-600"></i>
                        </Tooltip>
                      </CopyToClipboard>
                    </div>
                  )}
                  {article.article.user.twitterAccount && (
                    <div className="flex flex-col items-center justify-center">
                      <CopyToClipboard
                        text={article.article.user.twitterAccount}
                        onCopy={() => toast.success("Copied")}
                      >
                        <Tooltip title="copy">
                          <i className="cursor-pointer fab fa-twitter hover:text-pacific-600"></i>
                        </Tooltip>
                      </CopyToClipboard>
                    </div>
                  )}
                  {article.article.user.instagramAccount && (
                    <div className="flex flex-col items-center justify-center">
                      <CopyToClipboard
                        text={article.article.user.instagramAccount}
                        onCopy={() => toast.success("Copied")}
                      >
                        <Tooltip title="copy">
                          <i className="cursor-pointer fab fa-instagram hover:text-pacific-600"></i>
                        </Tooltip>
                      </CopyToClipboard>
                    </div>
                  )}
                </div>
              </div>
              {/*socials*/}
            </div>

            {/* body */}
            <div className="mt-5">
              <div className="mb-4">
                {parse(draftToHTML(JSON.parse(article.article.body)))}
              </div>
              <hr />
            </div>
          </div>
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
export default Article;
