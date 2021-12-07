import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { LogInContextProvider } from "./store/loginContext";

import "./index.css";
import App from "./App";

ReactDOM.render(
  <BrowserRouter>
    <LogInContextProvider>
      <App />
    </LogInContextProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
