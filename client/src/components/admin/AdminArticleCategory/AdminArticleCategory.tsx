// React & Redux
import  { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//antd
import "antd/dist/antd.css";
import { Alert, Table } from "antd";
import Modal from "antd/lib/modal/Modal";

//Types
import { State } from "../../../redux/types";

//Actions
import { getArticleCategories } from "../../../redux/slices/articleCategoriesSlice";
import { deleteArticleCategory } from "../../../redux/slices/articleCategorySlice";

// Compontnes
import { formatDate } from "../../../utils/dayjsHelper";
import AdminArticleCategoryAdd from "./AdminArticleCategoryAdd";
import AdminArticleCategoryEdit from "./AdminArticleCategoryEdit";

const AdminSubCourse = () => {
  // Get all courses when page laod
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getArticleCategories());
  }, [dispatch]);
  const [deleteModel, setDeleteModel] = useState({
    open: false,
    id: undefined,
  });
  const { list,status } = useSelector((state: State) => state.articleCategories);
  const { deleting, posting, updating } = useSelector(
    (state: State) => state.articleCategory
  );

  // ANTD columns to fill the table
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
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
        <p className="p-1 ml-2 rounded">{formatDate(record.createdAt)}</p>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (_, { title, description,id }) => (
        <>
          <AdminArticleCategoryEdit
            title={title}
            description={description}
            id={id}
          />
          <button
            className="p-1 ml-2 text-white bg-red-500 rounded hover:text-red-200"
            onClick={() => {
              setDeleteModel({ id: id, open: true });
            }}
          >
            delete
          </button>
          <div>
            <Modal
              title={`Delete section: ${title}`}
              destroyOnClose
              style={{ textAlign: "center", justifyContent: "center" }}
              visible={deleteModel.open && deleteModel.id === id}
              onOk={() => dispatch(deleteArticleCategory({ id }))}
              confirmLoading={deleting}
              okText="delete"
              cancelText="cancel"
              onCancel={() => setDeleteModel({ id: undefined, open: false })}
              okType="danger"
            >
              <Alert
                message="You cannot undo this action"
                type="warning"
                showIcon
                className="border-secondary"
              />
            </Modal>
          </div>
        </>
      ),
    },
  ];
  return (
    <div className="m-10 mt-3 ">
      <div className="flex justify-end mt-4 ml-4 justify-items-end">
        <AdminArticleCategoryAdd />
      </div>
      <Table
        bordered
        showSorterTooltip
        columns={columns}
        dataSource={list}
        loading={status || deleting || updating || posting}
        style={{ textAlign: "center" }}
      />
    </div>
  );
};

export default AdminSubCourse;
