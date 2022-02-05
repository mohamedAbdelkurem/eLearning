import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, Checkbox, Spin } from "antd";
import { useParams } from "react-router";
import {
  verifyActivationLink,
  updatePassword,
} from "../../redux/slices/authSlice";
import { useEffect } from "react";
import { State } from "../../redux/types";

// Component
function NewPassword() {
  const params = useParams<{ userToken: string }>();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(verifyActivationLink({ token: params.userToken }));
  }, [dispatch, params.userToken]);
  const onFinish = (values) => {
    dispatch(
      updatePassword({ password: values.password, userToken: params.userToken })
    );
  };
  const auth = useSelector((state: State) => state.auth);

  return (
    <div className="container flex flex-col items-center justify-center px-4 py-12 lg:px-8 ">
      {auth.activating ? (
        <Spin size="large" spinning />
      ) : !auth.errorsActivating ? (
        <div className="flex flex-col items-center justify-center text-center">
          <Form name="basic" onFinish={onFinish}>
            <Form.Item
              label="New password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      ) : (
        <p>bad link</p>
      )}
    </div>
  );
}

export default NewPassword;
