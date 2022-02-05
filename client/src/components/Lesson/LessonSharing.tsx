//React Share
import {
  FacebookShareButton,
  WhatsappShareButton,
  FacebookMessengerShareButton,
  TwitterShareButton,
} from "react-share";

//Utils
import { toast } from "react-toastify";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Tooltip } from "antd";

const PostSharing = () => {
  return (
    <div className="flex flex-row justify-center mt-6">
      <div className="flex items-center justify-center space-x-5">
        <FacebookShareButton
          quote="share on facebook"
          url={window.location.href}
          className="focus:outline-none"
        >
          <i className="cursor-pointer fab fa-facebook hover:text-blue-500"></i>
        </FacebookShareButton>
        <FacebookMessengerShareButton
          appId="facebook"
          url={window.location.href}
          className="focus:outline-none"
        >
          <i className=" fab fa-facebook-messenger hover:text-blue-500"></i>
        </FacebookMessengerShareButton>
        <WhatsappShareButton
          url={window.location.href}
          className="focus:outline-none"
        >
          <i className=" fab fa-whatsapp hover:text-blue-500"></i>
        </WhatsappShareButton>
        <TwitterShareButton
          url={window.location.href}
          className="focus:outline-none"
        >
          <i className=" fab fa-twitter hover:text-blue-500"></i>
        </TwitterShareButton>
        <CopyToClipboard
          text={window.location.href}
          onCopy={() => toast.success("Link Copied To Clipboard")}
        >
          <Tooltip title="copy link">
            <i className="cursor-pointer fas fa-copy hover:text-green-600"></i>
          </Tooltip>
        </CopyToClipboard>
      </div>
    </div>
  );
};

export default PostSharing;
