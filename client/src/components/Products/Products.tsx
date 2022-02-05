//React
import { Breadcrumb, Button, Result, Spin } from "antd";
import { ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getProducts } from "../../redux/slices/productsSlice";
import { State } from "../../redux/types";
import {  formatDate, fromNow } from "../../utils/dayjsHelper";

const Products = (): ReactElement => {
  const products = useSelector((state: State) => state.products);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);
  return (
    <section className="container p-4">
      {!products.status && !products.error && (
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/">
              Homepage
              <i className="ml-2 fas fa-home"></i>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Products</Breadcrumb.Item>
        </Breadcrumb>
      )}
      <div className="flex flex-wrap justify-center flex-grow-0">
        {products.status ? (
          <Spin size="large" spinning />
        ) : products.error ? (
          <Result
            status="500"
            title="a problem has occured"
            extra={
              <Button type="primary" onClick={() => dispatch(getProducts())}>
                reload
              </Button>
            }
          />
        ) : products.list.length === 0 ? (
          <>
            <Result
              status="info"
              title="There's no products"
              subTitle="try again later.."
              extra={
                <Button type="primary">
                  <Link to="/">return</Link>
                </Button>
              }
            />
          </>
        ) : (
          products.list.map((product) => (
            <div className="w-full m-2 overflow-hidden bg-white border-b-4 border-blue-500 shadow-sm hover:shadow-lg hover:bg-gray-200 lg:w-3/12 md:w-5/12">
              <img
                src={`http://localhost:5000/uploads/products/${product.imageUrn}`}
                alt="People"
                className="object-cover w-full h-32 sm:h-48 md:h-64"
              />
              <div className="p-1 md:p-4">
                <h3 className="mb-2 text-xl font-semibold leading-tight cursor-pointer sm:leading-normal">
                  <Link to={`/products/${product.slug}`}>{product.title}</Link>
                </h3>
                <div className="flex text-sm">
                  <i className="mr-2 fas fa-clock"></i>
                  <p className="leading-none">{fromNow(product.createdAt)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Products;
