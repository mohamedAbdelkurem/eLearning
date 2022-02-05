//React
import  { useState } from "react";

//Antd
import { Modal } from "antd";

//Redux
import { useDispatch, useSelector } from "react-redux";

//Types
import { State } from "../../../redux/types";

//Actions
import {
  openEditArticleCategoryModel,
  closeEditArticleCategoryModel,
  updatedArticleCategory,
} from "../../../redux/slices/articleCategorySlice";

const AdminSubCourseEdit = (props) => {
  const dispatch = useDispatch();

  const { updating, updatingError, editArticleCategoryModel, editArticleCategoryModelId } = useSelector(
    (state: State) => state.articleCategory
  );

  const [title, setTitle] = useState(props.title);
  const [description, setDescription] = useState(props.description);

  const handleOk = () => {
    dispatch(
      updatedArticleCategory({
        title,
        description,
        id: props.id,
      })
    );
  };

  const handleCancel = () => {
    dispatch(closeEditArticleCategoryModel());
  };

  return (
    <>
      <button
        className="p-1 ml-2 text-white bg-blue-500 rounded hover:text-red-200"
        onClick={() => dispatch(openEditArticleCategoryModel({ id: props.id }))}
      >
        edit
      </button>
      <Modal
        destroyOnClose={true}
        title="Add section"
        wrapClassName="text-center"
        visible={editArticleCategoryModel && props.id === editArticleCategoryModelId}
        onOk={handleOk}
        confirmLoading={updating}
        onCancel={handleCancel}
        width={"700px"}
      >
        <form className="flex flex-col ">
          <label className="font-bold">Title</label>
          <input
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            type="text"
            disabled={updating}
            placeholder="Title"
            name="title"
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
          />
          <p className="text-red-500">{updatingError && updatingError.title}</p>
          <label>Description</label>
          <input
            placeholder="Description"
            name="description"
            disabled={updating}
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            value={description}
            onChange={(e: any) => setDescription(e.target.value)}
          />
          <p className="text-red-500">
            {updatingError && updatingError.description}
          </p>
        </form>
      </Modal>
    </>
  );
};



export default AdminSubCourseEdit;
