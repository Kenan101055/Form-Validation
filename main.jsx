import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import { Provider } from "@chakra-ui/react";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <Provider> */}
      <App />
    {/* </Provider> */}
  </StrictMode>
);
