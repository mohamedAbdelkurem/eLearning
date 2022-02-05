// React & Hooks
import { useEffect } from "react";
//React Router
import { Link, useHistory } from "react-router-dom";
// Redux Hooks
import { useDispatch, useSelector } from "react-redux";
// Redux Actions
import {
  resetErrors,
  resetPassword,
} from "../../redux/slices/authSlice";
//Types
import { State } from "../../redux/types";
// Utils
import { Form, Input, Button, Result } from "antd";
import { MailOutlined } from "@ant-design/icons";

/*LOGIN COMPONENT

useState: email , password
actions : ResetPassw
route@Post : /api/login
route@params: email , password
*/

const ResetPassword = () => {
  //Redux
  const location = useHistory()
  const dispatch = useDispatch();
  //State
  //Form Submit on Finish
  const onFinish = ({ email }: any) => {
    dispatch(resetPassword({ email }));
  };
  const { errorsResetting, loading, resetEmailSent } = useSelector(
    (state: State) => state.auth
  );
  useEffect(() => {
    dispatch(resetErrors());
  }, []);

  //Store states
  return (
    <div className="container flex flex-col items-center justify-center px-4 py-12 lg:px-8 ">
      {resetEmailSent ? (
        <Result
          status="success"
          title="Reset Email Sent Succefully!"
          subTitle="it may take 1-5 minutes, please wait , or check your spam folder"
          extra={[
            <Link to="/">
              <Button type="primary" key="console">
                Homescreen
              </Button>
            </Link>,
          ]}
        />
      ) : (
        <>
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-center text-blue-600">
              Reset Password
            </h2>
          </div>
          <Form
            name="normal_login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            className="w-screen max-w-sm px-2 py-3 lg:w-96"
          >
            <Form.Item name="email">
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="Email"
                className="py-3"
              />
            </Form.Item>
            <p className="text-sm text-red-500">
              {!loading && errorsResetting && <>{errorsResetting.email}</>}
            </p>
            <div className="flex flex-row justify-between">
              <Link to="/" className="text-gray-400">
                <i className="fas fa-long-arrow-alt-left"></i>
              </Link>
              <Link to="/register" className="text-gray-400">
                Register
              </Link>
            </div>
            <Form.Item className="text-center">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full mt-2 login-form-button"
              >
                RESET
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </div>
  );
};
export default ResetPassword;
