import ReactDOM from "react-dom";
import { RouterProvider } from "react-router";
import { router } from "./router";
import "./css/wp-hack.css";
import { ToastProvider } from "./contexts/toast";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({});

const container = document.getElementById("app");
const root = ReactDOM.createRoot(container);
root.render(
  <ThemeProvider theme={theme}>
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  </ThemeProvider>,
);
