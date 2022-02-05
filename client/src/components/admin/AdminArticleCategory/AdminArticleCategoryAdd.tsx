//React
import { useEffect, useState } from "react";

//Antd
import { Modal, Button, Input } from "antd";

//Redux
import { useDispatch, useSelector } from "react-redux";

//Types
import { State } from "../../../redux/types";

//Actions
import {
  createArticleCategory,
  closeArticleCategoryModel,
  openArticleCategoryModel,
} from "../../../redux/slices/articleCategorySlice";

//Component
const AdminSubCourseAdd = () => {
  const dispatch = useDispatch();

  const { posting, postingError, articleCategoryModel } = useSelector(
    (state: State) => state.articleCategory
  );

  const [title, setTitle] = useState("");
  const [description, setBody] = useState("");

  const handleOk = () => {
    dispatch(createArticleCategory({ title, description }));
  };

  const handleCancel = () => {
    dispatch(closeArticleCategoryModel());
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => dispatch(openArticleCategoryModel())}
      >
        Add category
      </Button>
      <Modal
        title="Add category"
        wrapClassName="text-center"
        visible={articleCategoryModel}
        onOk={handleOk}
        confirmLoading={posting}
        onCancel={handleCancel}
        width={"700px"}
      >
        <form className="flex flex-col ">
          <label className="font-bold">Title</label>
          <Input
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            type="text"
            disabled={posting}
            placeholder="Title"
            name="title"
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
          />
          <p className="text-red-500">{postingError && postingError.title}</p>
          <label className="font-bold">Description</label>
          <Input
            placeholder="Description"
            name="description"
            disabled={posting}
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            value={description}
            onChange={(e: any) => setBody(e.target.value)}
          />
          <p className="text-red-500">
            {postingError && postingError.description}
          </p>
        </form>
      </Modal>
    </>
  );
};

export default AdminSubCourseAdd;
