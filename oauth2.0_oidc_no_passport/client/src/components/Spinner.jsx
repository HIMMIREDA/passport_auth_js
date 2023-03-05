import React from "react";
import { MoonLoader } from "react-spinners";

function Spinner() {
  return (
    <div
      style={{minHeight: "100vh",minWidth: "100vw",position: "fixed",backgroundColor: "rgba(11,11,11,0.4)",display: "flex",alignItems:"center",justifyContent: "center"}}
    >
      <MoonLoader color="#1976D2" loading size={70} speedMultiplier={1} />
    </div>
  );
}

Spinner.defaultProps = {
  fixed: true,
};
export default Spinner;