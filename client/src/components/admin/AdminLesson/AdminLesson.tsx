//React
import { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

//Redux
import { useDispatch, useSelector } from "react-redux";

//Antd
import { Button, Dropdown, Popconfirm, Table, Tag } from "antd";
import { DownOutlined } from "@ant-design/icons";

//Types
import { State } from "../../../redux/types";

//Actions
import { getLessons } from "../../../redux/slices/lessonsSlice";
import {
  deleteLesson,
  changeLessonDisplayStatus,
  deleteQuizLesson,
} from "../../../redux/slices/lessonSlice";

//Components
import { formatDate } from "../../../utils/dayjsHelper";
import AdminLessonEdit from "./AdminLessonEdit";
import AdminLessonAdd from "./AdminLessonAdd";
import FilterColumns from "../shared/FilterColumns";
import { getSubsAction } from "../../../redux/slices/subsSlice";
import SearchColumns from "../shared/SearchColumns";

//Component
const AdminLesson = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  // On Load , get All Lessons
  useEffect(() => {
    dispatch(getLessons());
    dispatch(getSubsAction());
  }, [dispatch]);

  const { list, status } = useSelector((state: State) => state.lessons);
  const { filters } = useSelector((state: State) => state.subs);

  const { deleting, updating } = useSelector((state: State) => state.lesson);

  // Columns
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      sorter: (a, b) => a.title.length - b.title.length,
      onFilter: (value, record) =>
        record.title
          ? record.title
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : "",
      filterDropdown: SearchColumns,
    },
    {
      title: "Section",
      dataIndex: "SubTitle",
      sorter: (a, b) => a.SubTitle.length - b.SubTitle.length,
      onFilter: (value, record) =>
        record.SubTitle
          ? record.SubTitle
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : "",
      filterDropdown: SearchColumns,
    },
    {
      title: "Course",
      dataIndex: "course",
      sorter: true,
      render: (_, record) => (
        <>
          <p className="p-1 ml-2 rounded">{record.courseTitle}</p>
        </>
      ),
      filterDropdown: ({ setSelectedKeys, confirm, clearFilters }) => (
        <FilterColumns
          setSelectedKeys={setSelectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
          filters={filters}
        />
      ),
      onFilter: (value, record) => record.courseTitle === value,
    },
    {
      title: "Status",
      dataIndex: "displayStatus",
      render: (_, record) => (
        <>
          <p className="p-1 ml-2 rounded">
            {record.displayStatus ? (
              <Tag color="green">shown</Tag>
            ) : (
              <Tag color="red">hidden</Tag>
            )}
          </p>
        </>
      ),
    },
    {
      title: "Latest update",
      dataIndex: "updatedAt",
      render: (_, record) => (
        <>
          <p className="p-1 ml-2 rounded">{formatDate(record.updatedAt)}</p>
        </>
      ),
    },
    {
      title: "Creation date",
      dataIndex: "createdAt",
      render: (_, record) => (
        <>
          <p className="p-1 ml-2 rounded">{formatDate(record.createdAt)}</p>
        </>
      ),
    },
    {
      title: "quiz",
      dataIndex: "quizes",

      render: (_, record) => (
        <>
          {record.quizes && record.quizes.length > 0 ? (
            <div className="space-x-2">
              <Button
                size="small"
                onClick={() =>
                  history.push("/admin/testquiz", {
                    quiz: JSON.parse(record.quizes[0].quiz),
                  })
                }
              >
                preview
              </Button>
              <Button danger size="small">
                <Popconfirm
                  title="Are you sure about deleting this quiz?"
                  onConfirm={() =>
                    dispatch(
                      deleteQuizLesson({
                        slug: record.slug,
                        identifier: record.identifier,
                      })
                    )
                  }
                  okText="Yes"
                  cancelText="No"
                >
                  delete
                </Popconfirm>
              </Button>
            </div>
          ) : (
            <Button
              size="small"
              type="primary"
              onClick={() => {
                history.push("/admin/lessonquiz", {
                  slug: record.slug,
                  identifier: record.identifier,
                });
              }}
            >
              Add quiz
            </Button>
          )}
        </>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (
        _,
        { identifier, slug, title, videoLink, body, displayStatus, subSlug }
      ) => (
        <div className="space-x-1">
          <Dropdown
            trigger={["click"]}
            overlay={
              <div className="flex flex-col space-y-2 bg-white border border-gray-300 shadow-sm ">
                <AdminLessonEdit
                  title={title}
                  key={identifier}
                  body={body}
                  videoLink={videoLink}
                  identifier={identifier}
                  slug={slug}
                />

                <Button
                  size="small"
                  type="primary"
                  danger
                  onClick={() => {
                    dispatch(deleteLesson({ identifier, slug }));
                  }}
                >
                  delete
                </Button>
                <Link to={`/p/${subSlug}/${identifier}/${slug}`}>
                  <Button
                    size="small"
                    type="primary"
                    className="bg-yellow-500 "
                  >
                    preview
                  </Button>
                </Link>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => {
                    dispatch(changeLessonDisplayStatus({ identifier, slug }));
                  }}
                >
                  {displayStatus ? "hide" : "show"}
                </Button>
              </div>
            }
          >
            <Button
              type="link"
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <div className="m-10 mt-3 ">
      <div className="flex justify-end mt-4 ml-4 justify-items-end">
        <AdminLessonAdd />
      </div>
      <Table
        bordered
        showSorterTooltip
        className="border border-gray-400 "
        columns={columns}
        dataSource={list}
        loading={status || deleting || updating}
      />
    </div>
  );
};

export default AdminLesson;
