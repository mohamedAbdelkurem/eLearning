//React
import { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
//Redyx
import { useDispatch, useSelector } from "react-redux";
//Antd
import { Breadcrumb, Image, Input, Form, Spin, Button } from "antd";
//states
import { State } from "../../redux/types";
//Components
import PostSharing from "../Lesson/LessonSharing";

//Dayjs
import { formatDate, fromNow } from "../../utils/dayjsHelper";

//DraftJS
import draftToHTML from "draftjs-to-html";
import parse from "html-react-parser";

//actions
import { addInterest, getProduct } from "../../redux/slices/productSlice";
//types
interface ParamTypes {
  slug: string;
}
function Product() {
  const { pathname } = useLocation();

  const dispatch = useDispatch();
  const { slug } = useParams<ParamTypes>();
  useEffect(() => {
    dispatch(getProduct({ slug }));
  }, [pathname, slug, dispatch]);

  const { product, loading, interestErrors, interestLoading } = useSelector(
    (state: State) => state.product
  );
  const onFinish = (values) => {
    console.log(values);
    dispatch(
      addInterest({ slug, email: values.email, fullName: values.fullName })
    );
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="container px-5 py-4">
      <div className="mb-2">
        {/* BREADCRUMB*/}
        <Breadcrumb>
          <Breadcrumb.Item href="">
            <Link to="/">
              Homepage
              <i className="ml-2 fas fa-home"></i>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/products">Products</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {!loading && <span>{product.title}</span>}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      {loading || !product? (
        <Spin size="large" spinning />
      ) : (
        <div className="col-span-4 p-3 bg-white md:col-span-3">
          <section className="overflow-hidden text-gray-600 body-font">
            <div className="grid w-full grid-cols-1 gap-5 mx-auto md:grid-cols-2 lg:w-4/5 justify-items-center">
              <div className="flex items-center justify-center w-full border border-gray-400 ">
                <Image
                  alt="product"
                  src={`http://localhost:5000/uploads/products/${product.imageUrn}`}
                />
              </div>
              <div className="w-full mb-6 lg:pr-10 lg:py-6 lg:mb-0">
                <h1 className="mb-4 text-3xl font-medium text-gray-900 title-font">
                  {product.title}
                </h1>
                <div className="mb-3 text-lg border text-pacific-600">
                  Description
                </div>
                  created :{fromNow(product.createdAt)}
                <p className="mb-4 leading-relaxed">
                  {parse(draftToHTML(JSON.parse(product.description)))}
                </p>
              </div>
            </div>
          </section>
          <section className="container px-1 py-12 md:px-28">
            <h1 className="mb-4 text-lg font-medium text-gray-900 title-font">
              Interested? submit your email to receive more information.
            </h1>
            <Form name="basic" onFinish={onFinish}>
              <Form.Item
                label="Fullname"
                name="fullName"
                rules={[
                  { required: true, message: "Please input your fullname!" },
                ]}
                validateStatus={interestErrors && interestErrors.fullName}
                help={
                  interestErrors &&
                  interestErrors.fullName && <p>{interestErrors.fullName}</p>
                }
              >
                <Input disabled={interestLoading} />
              </Form.Item>
              {interestErrors && interestErrors.fullName && (
                <p>{interestErrors.fullName}</p>
              )}
              <Form.Item
                label="Email"
                name="email"
                validateStatus={
                  (interestErrors && interestErrors.email
                    ? "error"
                    : "validating") ||
                  (interestErrors && interestErrors.alreadyInterested
                    ? "error"
                    : "validating")
                }
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
                help={
                  (interestErrors && interestErrors.email && (
                    <p>{interestErrors.email}</p>
                  )) ||
                  (interestErrors && interestErrors.alreadyInterested && (
                    <p>{interestErrors.alreadyInterested}</p>
                  ))
                }
              >
                <Input disabled={interestLoading} />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={interestLoading}
                >
                  subscribe
                </Button>
              </Form.Item>
            </Form>
          </section>
        </div>
      )}
      <div>
        <p className="text-sm text-center">share this product</p>
        <PostSharing />
      </div>
    </div>
  );
}

//types
interface ParamTypes {
  id: string;
}
export default Product;
