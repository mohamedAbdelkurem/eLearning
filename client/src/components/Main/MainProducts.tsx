import { Carousel } from "antd";
import { Link, useHistory } from "react-router-dom";

function MainProducts({ products, loading }) {
  return (
    <>
      {products.length > 0 && (
        <section className="py-12 text-white body-font bg-brand">
          {!loading && (
            <>
              <div className="w-20 h-1 bg-white"></div>
              <div className="w-10 h-1 mt-2 bg-white"></div>
              <div className="container px-5 pb-12 mx-auto">
                <div className="flex flex-col w-full text-center">
                  <p className="mt-2 text-3xl font-extrabold tracking-tight text-center text-white sm:text-4xl">
                    Latest Products
                  </p>
                </div>
                <div className="justify-center hidden grid-cols-6 gap-2 justify-items-center md:grid">
                  {products.map((product) => (
                    <div className="w-full col-span-6 bg-white shadow-lg lg:col-span-2 md:col-span-3 ">
                      <div className="relative flex ">
                        <div className="relative z-10 w-full ">
                          <div
                            className="object-cover w-full h-40 bg-center bg-cover "
                            style={{
                              backgroundImage: `url(http://localhost:5000/uploads/products/${product.imageUrn})`,
                            }}
                          ></div>
                          <Link to={`/products/${product.slug}`}>
                            <h1 className="mb-3 text-lg font-medium text-center text-black title-font">
                              {product.title}
                            </h1>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="block py-4 mx-4 md:hidden">
                  <Carousel dotPosition="top" slidesToScroll={1} swipeToSlide>
                    {products.map((product) => (
                      <div className="w-full col-span-6 bg-white shadow-lg lg:col-span-2 md:col-span-3 ">
                        <div className="relative flex ">
                          <div className="relative z-10 w-full ">
                            <div
                              className="object-cover w-full h-40 bg-center bg-cover "
                              style={{
                                backgroundImage: `url(http://localhost:5000/uploads/products/${product.imageUrn})`,
                              }}
                            ></div>
                            <Link to={`/products/${product.slug}`}>
                              <h1 className="mb-3 text-lg font-medium text-center text-black cursor-pointer title-font">
                                {product.title}
                              </h1>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Carousel>
                </div>
              </div>
            </>
          )}
        </section>
      )}
    </>
  );
}

export default MainProducts;
