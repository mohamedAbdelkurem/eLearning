// React & Redux
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//antd
import "antd/dist/antd.css";
import { Alert, Table } from "antd";

//Types
import { State } from "../../../redux/types";

//Actions
import { getArticles } from "../../../redux/slices/articlesSlice";
import { deleteArticle } from "../../../redux/slices/articleSlice";
// Compontnes

// Dayjs
import { formatDate } from "../../../utils/dayjsHelper";

import Modal from "antd/lib/modal/Modal";
import { Link } from "react-router-dom";
import AdminArticleAdd from "./AdminArticleAdd";
import AdminArticleEdit from "./AdminArticleEdit";
import SearchColumns from "../shared/SearchColumns";

const AdminArticle = () => {
  // Get all Courses when page laod
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getArticles());
  }, [dispatch]);

  //get Courses & single course states
  const { list, status } = useSelector((state: State) => state.articles);
  const { deleting, updating, posting } = useSelector(
    (state: State) => state.article
  );
  const [deleteModel, setDeleteModel] = useState({
    open: false,
    id: undefined,
  });

  // ANTD columns to fill the table
  const columns = [
    {
      title: "title",
      dataIndex: "title",
    },
    {
      title: "username",
      dataIndex: "username",
    },
    {
      title: "category",
      dataIndex: "articleCategory.title",
      render:(_,record) => <p>{record.articleCategory.title}</p>,
      onFilter: (value, record) =>
      record.articleCategory.title
        ? record.articleCategory.title
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    filterDropdown: SearchColumns,
    },
    {
      title: "latest update",
      dataIndex: "updatedAt",
      render: (_, record) => <p>{formatDate(record.updatedAt)}</p>,
    },
    {
      title: "creation date",
      dataIndex: "createdAt",
      render: (_, record) => <p>{formatDate(record.createdAt)}</p>,
    },
    {
      title: "actions",
      render: (_, { body, title, id }) => (
        <>
          <button className="p-1 ml-2 text-white bg-green-400 rounded hover:text-red-200">
            <Link to={`/articles/${id}`}>preview</Link>
          </button>
          <AdminArticleEdit title={title} body={body} id={id} key={id} />
          <button
            className="p-1 ml-2 text-white bg-red-500 rounded hover:text-red-200"
            onClick={() => {
              setDeleteModel({ id, open: true });
            }}
          >
            delete
          </button>
          <div>
            <Modal
              title={`delete: ${title}`}
              destroyOnClose
              style={{ textAlign: "center", justifyContent: "center" }}
              visible={deleteModel.open && deleteModel.id === id}
              onOk={() => dispatch(deleteArticle({ id }))}
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
    <div className="mt-3 mb-3 ">
      <div className="flex justify-between mt-4 ml-4 justify-items-end">
        <button className="p-1 ml-2 text-white bg-green-400 rounded ">
          <Link to={`/articles`}>VIEW ON SITE</Link>
        </button>
        <AdminArticleAdd />
      </div>
      <Table
        size="small"
        bordered={true}
        showSorterTooltip
        columns={columns}
        dataSource={list}
        loading={status || deleting || updating || posting}
      />
    </div>
  );
};

export default AdminArticle;
