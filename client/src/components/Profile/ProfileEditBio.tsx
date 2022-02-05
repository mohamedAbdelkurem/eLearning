import Modal from "antd/lib/modal/Modal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
//Types
import { State } from "../../redux/types";
//Antd
import TextArea from "antd/lib/input/TextArea";
import { Input, Spin, Form } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  InstagramOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";

import { SocialLinks } from "social-links";
import { updateUserDetails } from "../../redux/slices/profileSlice";
const socialLinks = new SocialLinks();

// Prop Types

interface PropTypes {
  isModalVisible: boolean;
  handleCancel: () => void;
  errors: any;
  updating: boolean;
  bio: string;
  facebookAccount: string;
  instagramAccount: string;
  whatsappAccount: string;
  twitterAccount: string;
  linkedinAccount: string;
}

// Component
function ProfileEditBio(props: PropTypes) {
  const dispatch = useDispatch();
  const [bioState, setBio] = useState<string>("");
  const [facebookAccountState, setFacebookAccountState] = useState<string>("");
  const [instagramAccountState, setInstagramAccountState] = useState<string>(
    ""
  );
  const [whatsappAccountState, setWhatsappAccountState] = useState<string>("");
  const [twitterAccountState, setTwitterAccountState] = useState<string>("");
  const [linkedinAccountState, setLinkedinAccountState] = useState<string>("");
  useEffect(() => {
    setBio(props.bio);
    setFacebookAccountState(props.facebookAccount);
    setInstagramAccountState(props.instagramAccount);
    setWhatsappAccountState(props.whatsappAccount);
    setTwitterAccountState(props.twitterAccount);
    setLinkedinAccountState(props.linkedinAccount);
  }, [props]);
  const { loading } = useSelector((state: State) => state.auth);
  const onFinish = () => {
    dispatch(
      updateUserDetails({
        bio: bioState,
        facebookAccount: facebookAccountState
          ? socialLinks.getProfileId("facebook", facebookAccountState)
          : "",
        whatsappAccount: whatsappAccountState,
        twitterAccount: twitterAccountState
          ? socialLinks.getProfileId("twitter", twitterAccountState)
          : "",
        linkedinAccount: linkedinAccountState
          ? socialLinks.getProfileId("linkedin", linkedinAccountState)
          : "",
        instagramAccount: instagramAccountState
          ? socialLinks.getProfileId("instagram", instagramAccountState)
          : "",
      })
    );
  };
  return (
    <Modal
      destroyOnClose
      centered
      okType="primary"
      title="Update bio & socials"
      visible={props.isModalVisible}
      onOk={onFinish}
      onCancel={props.handleCancel}
      okText={"save"}
      cancelText={"cancel"}
      confirmLoading={props.updating}
      closable={false}
      getContainer="#root"
    >
      {loading ? (
        <Spin size="large" spinning />
      ) : (
        <div className="flex flex-col mb-4">
          <div className="relative">
            <Form onFinish={onFinish}>
              <Form.Item
                name="facebook"
                initialValue={facebookAccountState}
                rules={[
                  () => ({
                    validator(_, value) {
                      if (
                        socialLinks.isValid("facebook", value) ||
                        value === "" ||
                        value === null
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("invalid facebook link"));
                    },
                  }),
                ]}
              >
                <Input
                  prefix={<FacebookOutlined />}
                  onChange={(e) => setFacebookAccountState(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                name="instagram"
                initialValue={instagramAccountState}
                rules={[
                  () => ({
                    validator(_, value) {
                      if (
                        socialLinks.isValid("instagram", value) ||
                        value === "" ||
                        value === null
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("invalid instagram link")
                      );
                    },
                  }),
                ]}
              >
                <Input
                  prefix={<InstagramOutlined />}
                  onChange={(e) => setInstagramAccountState(e.target.value)}
                />
              </Form.Item>
              <Form.Item name="whatsapp" initialValue={whatsappAccountState}>
                <Input
                  prefix={<WhatsAppOutlined />}
                  onChange={(e) => setWhatsappAccountState(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                initialValue={twitterAccountState}
                name="twitter"
                rules={[
                  () => ({
                    validator(_, value) {
                      if (
                        socialLinks.isValid("twitter", value) ||
                        value === "" ||
                        value === null
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("invalid twitter link"));
                    },
                  }),
                ]}
              >
                <Input
                  prefix={<TwitterOutlined />}
                  onChange={(e) => setTwitterAccountState(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                name="linkedin"
                initialValue={linkedinAccountState}
                rules={[
                  () => ({
                    validator(_, value) {
                      if (
                        socialLinks.isValid("linkedin", value) ||
                        value === "" ||
                        value === null
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("invalid linkedin link"));
                    },
                  }),
                ]}
              >
                <Input
                  placeholder="linkedin"
                  prefix={<LinkedinOutlined />}
                  onChange={(e) => setLinkedinAccountState(e.target.value)}
                />
              </Form.Item>
              <TextArea
                value={bioState}
                maxLength={150}
                showCount
                rows={3}
                size={"large"}
                id="bio"
                name="bio"
                placeholder="About me"
                onChange={(e) => {
                  setBio(e.target.value);
                }}
              />
            </Form>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default ProfileEditBio;
