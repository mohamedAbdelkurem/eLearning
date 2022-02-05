// React & Redux
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

//antd
import "antd/dist/antd.css";
import { Alert, Image, Table } from "antd";
import Modal from "antd/lib/modal/Modal";

//Types
import { State } from "../../../redux/types";

//Actions
import { getBooks } from "../../../redux/slices/booksSlice";
import { deleteBook } from "../../../redux/slices/bookSlice";

// Components
import AdminBookAdd from "./AdminBookAdd";
import AdminBookEdit from "./AdminBookEdit";

// Dayjs
import { formatDate } from "../../../utils/dayjsHelper";

const AdminBook = () => {
  // Get all Books  when page laod
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBooks());
  }, [dispatch]);

  //get Books & single book states
  const { list, status } = useSelector((state: State) => state.books);
  const { deleting, updating, posting } = useSelector(
    (state: State) => state.book
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
      title: "image",
      dataIndex: "imageUrn",
      render: (_, record) => (
        <Image src={`http://localhost:5000/uploads/${record.imageUrn}`} width={50} />
      ),
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
      render: (_, { description, title, id, slug, link }) => (
        <>
          <button className="p-1 ml-2 text-white bg-green-400 rounded hover:text-red-200">
            <Link to={`/books/${slug}`}>preview</Link>
          </button>
          <AdminBookEdit
            title={title}
            description={description}
            slug={slug}
            key={id}
            link={link}
          />
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
              onOk={() => dispatch(deleteBook({ slug }))}
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
                className="border-yellow-300"
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
        <AdminBookAdd />
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

export default AdminBook;
