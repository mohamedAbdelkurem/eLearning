//React
import  { useState } from "react";
//Redux
import { useDispatch, useSelector } from "react-redux";
//Antd
import { Modal, Button, Input } from "antd";

//React
import { State } from "../../../redux/types";

//Actions
import {
  createProduct,
  closeProductModel,
  openProductModel,
} from "../../../redux/slices/productSlice";

//Draft Js
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

//Component
const AdminProductAdd = () => {
  const dispatch = useDispatch();
  const { posting, postingError, productModel } = useSelector(
    (state: State) => state.product
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<EditorState>(
    EditorState.createEmpty()
  );
  const [picture, setPicture] = useState<File | null>(null);

  const handleOk = () => {
    dispatch(
      createProduct({
        title,
        description: JSON.stringify(
          convertToRaw(description.getCurrentContent())
        ),
        picture,
      })
    );
  };
  const handleCancel = () => {
    dispatch(closeProductModel());
  };

  return (
    <>
      <Button type="primary" onClick={() => dispatch(openProductModel())}>
        Add an product
      </Button>
      <Modal
        title="Add an product"
        visible={productModel}
        onOk={handleOk}
        confirmLoading={posting}
        onCancel={handleCancel}
        width={"800px"}
      >
        <form className="flex flex-col ">
          <label>Title</label>
          <Input
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            type="text"
            disabled={posting}
            placeholder="Title"
            name="title"
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
          />
          <p className="text-red-500 ">{postingError && postingError.title}</p>
          <label>Description</label>
          <div>
            <Editor
              editorState={description}
              toolbarClassName="border border-blue-200 py-2"
              wrapperClassName="border  py-2"
              editorClassName="border border-blue-200 space-y-3 py-2"
              onEditorStateChange={(editorState: EditorState) => {
                setDescription(editorState);
              }}
            />
          </div>
          <p className="text-red-500">
            {postingError && postingError.description}
          </p>
          <label>Header</label>
          <Input
            type="file"
            onChange={(e) => {
              if (e.target.files) setPicture(e.target.files[0]);
            }}
          />
        </form>
      </Modal>
    </>
  );
};

export default AdminProductAdd;
