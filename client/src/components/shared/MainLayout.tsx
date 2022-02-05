//Antd
import { Layout } from "antd";
//Components
import FooterComponent from "./Footer";
import Navbar from "../shared/Navbar";

const { Content, Header } = Layout;

const MainLayout = ({ children }) => {
  return (
    <Layout className="bg-gray-200 ">
      <Header className="px-0 bg-white h-1/5">
        <Navbar />
      </Header>
      <Layout>
        <Content className="min-h-screen bg-gray-200">{children}</Content>
        <FooterComponent />
      </Layout>
    </Layout>
  );
};

export default MainLayout;
