import React from "react";
import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.css'
import App from "./App";
import { BrowserRouter } from "react-router-dom";
//const app = express();
// const cors = require('cors');
// app.use(cors());


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);