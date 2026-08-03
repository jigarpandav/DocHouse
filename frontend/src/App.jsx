import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import DashboardLayout from "./components/layout/DashboardLayout";
import FirmProfile from "./pages/firm/FirmProfile";
import UpdateBrand from "../../../CompClinic/frontend/src/pages/Brand/updateBrand";
import UpdateFirm from "./pages/firm/UpdateFirm";
import TemplateList from "./pages/template/TemplateList";
import UpdateTemplate from "./pages/template/UpdateTemplate";
import ViewTemplate from "./pages/template/ViewTemplate";
import CreateTemplate from "./pages/template/CreateTemplate";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
  <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={2500}
        theme="dark"
        newestOnTop
        pauseOnHover
      />
   
    </BrowserRouter>
  );
}

export default App;