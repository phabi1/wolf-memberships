import ReactDOM from "react-dom";
import { RouterProvider } from "react-router";
import { router } from "./router";

const container = document.getElementById("app");
const root = ReactDOM.createRoot(container);
root.render(<RouterProvider router={router} />);
