// React & Redux
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//antd
import "antd/dist/antd.css";
import { Alert, Table, Modal, Button, Dropdown, Popconfirm, Image } from "antd";
import { DownOutlined } from "@ant-design/icons";

//Types
import { State } from "../../../redux/types";

//Actions
import {
  deleteCourse,
  deleteQuizCourse,
} from "../../../redux/slices/courseSlice";
// Components
import AdminCourseAdd from "./AdminCourseAdd";
import AdminCourseEdit from "./AdminCourseEdit";

// Dayjs
import { formatDate } from "../../../utils/dayjsHelper";
import dayjs from "dayjs";
import { ColumnsType } from "antd/lib/table";
import { getCourses } from "../../../redux/slices/coursesSlice";
import { Link, useHistory } from "react-router-dom";

const AdminCourse = () => {
  // Get all courses  when page load
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCourses());
  }, [dispatch]);

  //get courses &  course states
  const { list, status } = useSelector((state: State) => state.courses);
  const { deleting, updating, posting } = useSelector(
    (state: State) => state.course
  );

  //TODO move it to redux
  const [deleteModel, setDeleteModel] = useState({
    open: false,
    id: undefined,
  });
  const history = useHistory();
  // ANTD columns to fill the table
  const columns: ColumnsType<any> = [
    {
      title: "Display order",
      dataIndex: "apperance_order",
      sorter: (a, b) => a.apperance_order - b.apperance_order,
      render: (_, record) => (
        <p className="font-bold">{record.apperance_order}</p>
      ),
      filterIcon: true,
    },
    {
      title: "title",
      dataIndex: "name",
    },
    {
      title: "image",
      dataIndex: "imageUrn",
      render: (_, record) => (
        <Image src={`http://localhost:5000/uploads/${record.imageUrn}`} width={50} />
      ),
    },

    {
      title: "description",
      dataIndex: "description",
    },
    {
      title: "quiz",
      dataIndex: "quizesCourse",

      render: (_, record) => (
        <>
          {record.quizesCourse.length > 0  ? (
            <div className="space-x-2">
              <Button
                size="small"
                onClick={() =>
                  history.push("/admin/testquiz", {
                    quiz: JSON.parse(record.quizesCourse[0].quiz),
                  })
                }
              >
                preview
              </Button>
              <Button danger size="small">
                <Popconfirm
                  title="Are  you sure about deleting this quiz?"
                  onConfirm={() =>
                    dispatch(deleteQuizCourse({ slug: record.slug }))
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
                history.push("/admin/coursequiz", { slug: record.slug });
              }}
            >
              Add quiz
            </Button>
          )}
        </>
      ),
    },
    {
      title: "creation date",
      dataIndex: "createdAt",
      sorter: (a, b) => dayjs(a.createdAt).diff(dayjs(b.createdAt)),
      render: (_, record) => (
        <p className="p-1 ml-2 rounded">{formatDate(record.createdAt)}</p>
      ),
    },
    {
      title: "actions",
      key: "action",
      render: (
        _,
        { name, description, slug, apperance_order, preview, details }
      ) => (
        <Dropdown
          trigger={["click"]}
          overlay={
            <div className="flex flex-col space-y-1 bg-white">
              <AdminCourseEdit
                apperanceOrder={Number(apperance_order)}
                name={name}
                description={description}
                slug={slug}
                preview={preview}
                details={details}
              />
              <Button
                size="small"
                type="primary"
                danger
                onClick={() => {
                  setDeleteModel({ id: slug, open: true });
                }}
              >
                Delete
              </Button>
              <Button className="bg-green-400 " size="small">
                <Link to={`/c/courses/${slug}`}>preview</Link>
              </Button>
              <div>
                <Modal
                  title={`delete course: ${name}`}
                  destroyOnClose
                  style={{ textAlign: "center", justifyContent: "center" }}
                  visible={deleteModel.open && deleteModel.id === slug}
                  onOk={() => dispatch(deleteCourse({ slug }))}
                  confirmLoading={deleting}
                  okText="delete"
                  cancelText="cancel"
                  onCancel={() =>
                    setDeleteModel({ id: undefined, open: false })
                  }
                  okType="danger"
                >
                  <Alert
                    message="You cannot undo this action"
                    type="warning"
                    showIcon
                    className="border-red-500"
                  />
                </Modal>
              </div>
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
      ),
    },
  ];

  return (
    <div className="mt-3 mb-3 ">
      <div className="flex justify-between mt-4 ml-4 justify-items-end">
        <button className="p-1 ml-2 text-white bg-green-400 rounded ">
          <Link to={`/c/courses`}>VIEW ON SITE</Link>
        </button>
        <AdminCourseAdd />
      </div>
      <Table
        size="middle"
        bordered={true}
        showSorterTooltip
        columns={columns}
        dataSource={list}
        loading={status || deleting || updating || posting}
        
      />
    </div>
  );
};

export default AdminCourse;

/* onClick={() =>

}*/
