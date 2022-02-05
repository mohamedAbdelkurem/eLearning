//React
import  { useEffect, useState } from "react";

//Antd
import { Button, Input, Modal } from "antd";

//Redux
import { useDispatch, useSelector } from "react-redux";

//Types
import { State } from "../../../redux/types";

//DraftJs
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";

//Actions
import {
  closeEditProductModel,
  updateProduct,
  openEditProductModel,
} from "../../../redux/slices/productSlice";

const AdmintProductEdit = (props: {
  title: string;
  description: string;
  slug: string;
}) => {
  const dispatch = useDispatch();
  const {
    updating,
    updatingError,
    editProductModel,
    editProductModelId,
  } = useSelector((state: State) => state.product);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<EditorState>(
    EditorState.createWithContent(convertFromRaw(JSON.parse(props.description)))
  );
  const handleOk = () => {
    dispatch(
      updateProduct({
        title,
        slug: props.slug,
        description: JSON.stringify(
          convertToRaw(description.getCurrentContent())
        ),
      })
    );
  };
  useEffect(() => {
    setTitle(props.title);
  }, [props]);
  const handleCancel = () => {
    dispatch(closeEditProductModel());
  };

  return (
    <>
      <Button
        size="small"
        type="primary"
        onClick={() => dispatch(openEditProductModel({ slug: props.slug }))}
        className="mx-1"
      >
        edit
      </Button>
      <Modal
        destroyOnClose={true}
        title={`Edit course : ${title}`}
        wrapClassName="text-center"
        visible={editProductModel && props.slug === editProductModelId}
        onOk={handleOk}
        confirmLoading={updating}
        onCancel={handleCancel}
        width={"700px"}
      >
        <form className="flex flex-col ">
          <label className="font-bold">Title</label>
          <Input
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            type="text"
            disabled={updating}
            placeholder="title"
            name="name"
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
          />
          <p className="text-red-500">{updatingError && updatingError.name}</p>

          <label className="font-bold">Description</label>
          <div>
            <Editor
              editorState={description}
              toolbarClassName="border border-blue-200 py-2"
              wrapperClassName="border  py-2"
              editorClassName="border border-blue-200 h-32 space-y-3"
              onEditorStateChange={(editorState: EditorState) => {
                setDescription(editorState);
              }}
            />
          </div>
          <p className="text-red-500">
            {updatingError && updatingError.description}
          </p>
        </form>
      </Modal>
    </>
  );
};

export default AdmintProductEdit;
