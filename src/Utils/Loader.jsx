import React from "react";
import { ClipLoader } from "react-spinners";

export default function Loader() {
  return (
    <div
      className="position-fixed d-flex flex-column justify-content-center align-items-center w-100 h-100"
      style={{ top: 0, left: 0, zIndex: 50, backgroundColor: "#fff3cd" }}
    >
      <div>
        <ClipLoader color="#DE2D35" size={50} />
      </div>
      <p className="text-center fw-medium fs-5 text-warning">
        Loading...
      </p>
    </div>
  );
}

export function Loader2() {
  return (
    <div
      className="position-relative d-flex flex-column justify-content-center align-items-center w-100 h-100"
      style={{ zIndex: 50 }}
    >
      <div>
        <ClipLoader color="#DE2D35" size={50} />
      </div>
      <p className="text-center fw-medium fs-5 text-warning">
        Loading...
      </p>
    </div>
  );
}
