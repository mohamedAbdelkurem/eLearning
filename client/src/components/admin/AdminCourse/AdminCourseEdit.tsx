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
  closeEditCourseModel,
  updateCourse,
  openEditCourseModel,
} from "../../../redux/slices/courseSlice";

interface Props {
  name: string;
  description: string;
  slug: string;
  apperanceOrder: number;
  details: string;
  preview: string;
}
const AdminCourseEdit = (props: Props) => {
  const dispatch = useDispatch();
  const {
    updating,
    updatingError,
    editCourseModel,
    editCourseModelId,
  } = useSelector((state: State) => state.course);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [apperanceOrder, setApperanceOrder] = useState(0);
  const [preview, setPreview] = useState("");
  const [details, setDetails] = useState<EditorState>(
    EditorState.createWithContent(convertFromRaw(JSON.parse(props.details)))
  );
  const handleOk = () => {
    dispatch(
      updateCourse({
        name,
        description,
        slug: props.slug,
        details: JSON.stringify(convertToRaw(details.getCurrentContent())),
        preview,
        apperance_order: apperanceOrder,
      })
    );
  };
  useEffect(() => {
    setName(props.name);
    setDescription(props.description);
    setApperanceOrder(props.apperanceOrder);
    setPreview(props.preview);
  }, [props]);
  const handleCancel = () => {
    dispatch(closeEditCourseModel());
  };

  return (
    <>
      <Button
        size="small"
        type="primary"
        onClick={() => dispatch(openEditCourseModel({ id: props.slug }))}
      >
        edit
      </Button>
      <Modal
        destroyOnClose={true}
        title={`Edit course : ${name}`}
        wrapClassName="text-center"
        visible={editCourseModel && props.slug === editCourseModelId}
        onOk={handleOk}
        confirmLoading={updating}
        onCancel={handleCancel}
        width={"700px"}
      >
        <form className="flex flex-col ">
          <label className="font-bold">Display order</label>
          <Input
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            type="number"
            disabled={updating}
            placeholder="Display order"
            max={5}
            min={1}
            name="apperance_order"
            value={apperanceOrder}
            onChange={(e: any) => setApperanceOrder(e.target.value)}
          />
          <p className="text-red-500">
            {updatingError && updatingError.apperance_order}
          </p>

          <label className="font-bold">Title</label>
          <Input
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            type="text"
            disabled={updating}
            placeholder="title"
            name="name"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
          />
          <p className="text-red-500">{updatingError && updatingError.name}</p>

          <label className="font-bold">Preview</label>
          <Input
            type="text"
            placeholder="Course Preview"
            name="preview"
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            value={preview}
            onChange={(e: any) => setPreview(e.target.value)}
          />
          <p className="text-red-500">
            {updatingError && updatingError.videoLink}
          </p>

          <label className="font-bold">Details</label>
          <div>
            <Editor
              editorState={details}
              toolbarClassName="border border-blue-200 py-2"
              wrapperClassName="border  py-2"
              editorClassName="border border-blue-200 h-32 space-y-3"
              onEditorStateChange={(editorState: EditorState) => {
                setDetails(editorState);
              }}
            />
          </div>
          <p className="text-red-500">{updatingError && updatingError.body}</p>

          <label>Description</label>
          <Input
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

export default AdminCourseEdit;
