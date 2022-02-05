import { Button, Tooltip } from "antd";
import { Link, useHistory } from "react-router-dom";
import { formatDate, fromNow } from "../../utils/dayjsHelper";
import { CheckCircleOutlined, PaperClipOutlined } from "@ant-design/icons";

const PostComponent = ({
  updatedAt,
  title,
  slug,
  identifier,
  subSlug,
  quiz,
  emailConfirmed,
  results,
}) => {
  console.log(quiz);
  const history = useHistory();
  return (
    <>
      <div className="w-full mx-4">
        <div className="flex flex-row ">
          <i className="mr-2 fas fa-clock"></i>
          <span className="flex flex-col mt-auto text-xs text-gray-400 ">
            <Tooltip placement="top" title={formatDate(updatedAt)}>
              {fromNow(updatedAt)}
            </Tooltip>
          </span>
        </div>
        <p className="mb-2 text-lg font-semibold text-gray-700">
          <Link to={`/p/${subSlug}/${identifier}/${slug}`}>{title}</Link>
        </p>
        {quiz && (
          <>
            {emailConfirmed && results.length == 0 ? (
              <p>
                <Button
                  icon={<PaperClipOutlined className="text-red-500" />}
                  onClick={() =>
                    history.push("/lesson/takequiz", {
                      quiz: JSON.parse(quiz),
                      slug,
                      identifier,
                    })
                  }
                >
                  Quiz
                </Button>
              </p>
            ) : (
              <Button
                type="ghost"
                icon={<CheckCircleOutlined className="text-green-500" />}
                onClick={() =>
                  history.push("/quiz/testquiz", {
                    quiz: JSON.parse(quiz),
                    slug,
                    identifier,
                  })
                }
              >
                quiz
              </Button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default PostComponent;
