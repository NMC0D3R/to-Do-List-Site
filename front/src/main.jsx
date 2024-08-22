import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./stores/UserStore.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
      <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
      <App />
    </Provider>
  </StrictMode>
);
