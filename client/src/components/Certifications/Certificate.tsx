import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getCertificate } from "../../redux/slices/certificateSlice";
import { State } from "../../redux/types";
import Pdf from "react-to-pdf";
import QRCode from "qrcode.react";
import { Button, Spin } from "antd";
import { formatDate } from "../../utils/dayjsHelper";
import NotFound from "../shared/NotFound";
const options = {
  orientation: "landscape",
};
function Certificate() {
  const { identifier } = useParams<{ identifier: string }>();
  const { certificate, loading } = useSelector((state:State) => state.certificate);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCertificate({ identifier }));
  }, [dispatch, identifier]);
  const ref = useRef(null);
  return (
    <div className="container flex flex-col justify-center">
      {loading ? (
        <Spin size="large" spinning />
      ) : certificate && certificate.course ? (
        <>
          <div
            ref={ref}
            style={{ width: 800, minWidth: 800, minHeight: 550, height: 550 }}
            className="flex flex-col items-center m-4 bg-gray-200 border-8 border-pacific-500 h-72"
          >
            <h2 className="p-3 text-5xl text-center rounded">
              Certificate of Completion
            </h2>
            <img src="/logo.png" className="h-48" />
            <p className="p-3 font-mono text-2xl text-center">
              This is to certify that
              <span className="m-2 font-semibold text-pacific-700">
                {certificate.user.username}
              </span>
              succefully completed
              <span className="m-2 font-semibold text-pacific-700">
                {/* {certificate.course.name} */}
              </span>
              Course {certificate.course.name} at
              <span className="m-2 font-semibold ">
                {formatDate(certificate.createdAt)}
              </span>
            </p>
            <div className="flex content-between justify-around ">
              <div>
                <img src="/singature.svg" className="h-32" />
              </div>
              <div>
                <QRCode
                  value={`http://localhost:3000/v/certificate/${certificate.identifier}/`}
                  className="h-32"
                />
              </div>
            </div>
            <p className="m-2 text-xs text-center">
              shared url :{" "}
              {`http://localhost:3000/v/certificate/${certificate.identifier}/`}
            </p>
          </div>
          <Pdf
            targetRef={ref}
            fileName="certificate.pdf"
            options={options}
            scale={1.3}
            x={0.5}
            y={0.5}
          >
            {({ toPdf }) => (
              <Button
                type="dashed"
                className="w-32 mt-3 text-center text-pacific-500"
                onClick={toPdf}
              >
                download
              </Button>
            )}
          </Pdf>
        </>
      ) : (
        <NotFound />
      )}
    </div>
  );
}

export default Certificate;
