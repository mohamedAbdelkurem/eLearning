//React
import { useEffect, useState } from "react";

//Redux
import { useDispatch, useSelector } from "react-redux";

//Antd
import { Button, Popconfirm, Table } from "antd";

//Types
import { State } from "../../../redux/types";

//Actions
import { getReports, deleteReport } from "../../../redux/slices/reportsSlice";
import { Link } from "react-router-dom";
import { formatDate } from "../../../utils/dayjsHelper";

const AdminReport = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getReports());
  }, [dispatch]);

  const { list, status } = useSelector((state: State) => state.reports);
  const columns = [
    {
      title: "id",
      dataIndex: "id",
      sorter: (a, b) => a.username.length - b.username.length,
    },
    {
      title: "reported Link",
      key: "reportedLink",
      render: (_, { lesson }) => (
        <Button  type="link" href={lesson.videoLink} target="_blank">
          test link
        </Button>
      ),
    },
    {
      title: "report date",
      dataIndex: "createdAt",
      render: (_, record) => (
        <>
          <p className="p-1 ml-2 rounded">{formatDate(record.createdAt)}</p>
        </>
      ),
    },
    {
      title: "Lesson",
      key: "lesson",
      render: (_, { lesson }) => (
        <Link to={`/p/${lesson.subSlug}/${lesson.identifier}/${lesson.slug}`}>
          <p>{lesson.title}</p>
        </Link>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, { lesson }) => (
        <Popconfirm
          title="Are  you sure about deleting this quiz?"
          onConfirm={() => {
            dispatch(
              deleteReport({ slug: lesson.slug, identifier: lesson.identifier })
            );
          }}
          okText="Yes"
          cancelText="No"
        >
          <Button type="dashed" danger>
            delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="m-10 mt-3 ">
      <Table
        bordered
        showSorterTooltip
        columns={columns}
        dataSource={list}
        loading={status}
      />
    </div>
  );
};

export default AdminReport;
