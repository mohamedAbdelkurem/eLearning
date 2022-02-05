// React & Redux
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//antd
import "antd/dist/antd.css";
import { Alert, Button, Image, Table, Tag } from "antd";

//Types
import { State } from "../../../redux/types";

//Actions
import { getProducts } from "../../../redux/slices/productsSlice";
import {
  confirmInterestedPerson,
  deleteInterestedPerson,
  deleteProduct,
} from "../../../redux/slices/productSlice";
// Compontnes

// Dayjs
import { formatDate } from "../../../utils/dayjsHelper";

import Modal from "antd/lib/modal/Modal";
import { Link } from "react-router-dom";
import AdminProductAdd from "./AdminProductAdd";
import AdminProductEdit from "./AdminProductEdit";

const AdminProduct = () => {
  // Get all Courses when page laod
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  //get Courses & single course states
  const { list, status } = useSelector((state: State) => state.products);
  const { deleting, updating, posting } = useSelector(
    (state: State) => state.product
  );
  const [deleteModel, setDeleteModel] = useState({
    open: false,
    slug: undefined,
  });

  // ANTD columns to fill the table
  const columns = [
    { title: "id", dataIndex: "id" },
    {
      title: "title",
      dataIndex: "title",
    },
    {
      title: "image",
      dataIndex: "imageUrn",
      render: (_, record) => (
        <Image
          src={`http://localhost:5000/uploads/products/${record.imageUrn}`}
          width={50}
        />
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
      render: (_, record) => (
        <>
          <Button
            type="dashed"
            size="small"
            className="text-white bg-green-400 "
          >
            <Link to={`/products/${record.slug}`}>preview</Link>
          </Button>

          <AdminProductEdit
            title={record.title}
            description={record.description}
            slug={record.slug}
            key={record.id}
          />
          <Button
            danger
            size="small"
            className="text-white bg-red-500 "
            onClick={() => {
              setDeleteModel({ slug: record.slug, open: true });
            }}
          >
            delete
          </Button>
          <div>
            <Modal
              title={`delete: ${record.title}`}
              destroyOnClose
              style={{ textAlign: "center", justifyContent: "center" }}
              visible={deleteModel.open && deleteModel.slug === record.slug}
              onOk={() => dispatch(deleteProduct({ slug: record.slug }))}
              confirmLoading={deleting}
              okText="delete"
              cancelText="cancel"
              onCancel={() => setDeleteModel({ slug: undefined, open: false })}
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
    <div className="m-10 mt-3 mb-3 ">
      <div className="flex justify-between mt-4 ml-4 justify-items-end">
        <Button className="p-1 ml-2 " type="primary">
          <Link to={`/products`}>VIEW LIVE</Link>
        </Button>
        <AdminProductAdd />
      </div>
      <Table
        bordered
        showSorterTooltip
        columns={columns}
        dataSource={list}
        className="mt-2 border-gray-400"
        rowClassName="border-gray-400 border border "
        rowKey="id"
        loading={status || deleting || updating || posting}
        expandable={{
          rowExpandable: (record) => record.interestedPersons.length > 0,
          expandedRowRender: (record) => (
            <Table
              className="border border-gray-400 "
              pagination={false}
              size="small"
              dataSource={record.interestedPersons}
              columns={[
                {
                  title: "Email",
                  dataIndex: "email",
                },
                {
                  title: "Fullname",
                  dataIndex: "fullName",
                },
                {
                  title: "creation date",
                  dataIndex: "createdAt",
                  render: (_, record) => <p>{formatDate(record.createdAt)}</p>,
                },
                {
                  title: "status",
                  dataIndex: "status",
                  render: (_, record) => (
                    <p>
                      {record.status ? (
                        <Tag color="green">success</Tag>
                      ) : (
                        <Tag color="red">pending</Tag>
                      )}
                    </p>
                  ),
                },
                {
                  title: "actions",
                  dataIndex: "actions",
                  render: (_, record) => (
                    <div className="space-x-1">
                      {record.status ? (
                        <Button
                          size="small"
                          color="green"
                          type="dashed"
                          className="text-red-400"
                          onClick={() =>
                            dispatch(confirmInterestedPerson({ id: record.id }))
                          }
                        >
                          unconfirm
                        </Button>
                      ) : (
                        <Button
                          className="text-green-500"
                          type="dashed"
                          size="small"
                          color="red"
                          onClick={() =>
                            dispatch(confirmInterestedPerson({ id: record.id }))
                          }
                        >
                          confirm
                        </Button>
                      )}
                      <Button
                        size="small"
                        color="red"
                        type="dashed"
                        danger
                        onClick={() =>
                          dispatch(deleteInterestedPerson({ id: record.id }))
                        }
                      >
                        delete
                      </Button>
                    </div>
                  ),
                },
              ]}
            />
          ),
        }}
      />
    </div>
  );
};

export default AdminProduct;
