//React
import  { useState } from "react";

//Redux
import { useDispatch, useSelector } from "react-redux";

//Antd
import { Modal, Button, Input } from "antd";

//Types
import { State } from "../../../redux/types";
//draftjs
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

//Actions
import {
  closeCourseModel,
  openCourseModel,
  createCourse,
} from "../../../redux/slices/courseSlice";
import TextArea from "antd/lib/input/TextArea";

//Component
const AdminCourseAdd = () => {
  const dispatch = useDispatch();
  //Course State
  const { posting, postingError, courseModel } = useSelector(
    (state: State) => state.course
  );
  //

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [details, setDetails] = useState<EditorState>(
    EditorState.createEmpty()
  );

  //

  const handleOk = () => {
    dispatch(
      createCourse({
        name,
        description,
        picture,
        preview,
        details: JSON.stringify(convertToRaw(details.getCurrentContent())),
      })
    );
    setName("");
    setDescription("");
  };

  const handleCancel = () => {
    dispatch(closeCourseModel());
  };
  return (
    <>
      <Button type="primary" onClick={() => dispatch(openCourseModel())}>
        Add Course
      </Button>
      <Modal
        title="Add Course"
        visible={courseModel}
        onOk={handleOk}
        confirmLoading={posting}
        onCancel={handleCancel}
        width={"700px"}
      >
        <form className="flex flex-col ">
          <label>Title</label>
          <Input
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            type="text"
            disabled={posting}
            placeholder="Title"
            name="name"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
          />
          <p className="text-red-500">{postingError && postingError.name}</p>
          <label>Description</label>
          <TextArea
            placeholder="Description"
            name="description"
            disabled={posting}
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            value={description}
            onChange={(e: any) => setDescription(e.target.value)}
          />
          <p className="text-red-500">
            {postingError && postingError.description}
          </p>
          <label>Preview</label>
          <Input
            placeholder="Course preview"
            name="preview"
            disabled={posting}
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            value={preview}
            allowClear
            onChange={(e: any) => setPreview(e.target.value)}
          />
          <p className="text-red-500">{postingError && postingError.preview}</p>

          <div>
            <label>Details</label>
            <Editor
              editorState={details}
              toolbarClassName="border border-blue-200 py-2"
              wrapperClassName="border  py-2"
              editorClassName="border border-blue-200 space-y-3 py-2"
              onEditorStateChange={(editorState: EditorState) => {
                setDetails(editorState);
              }}
            />
          </div>
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

export default AdminCourseAdd;
