import { Navigate, Route, Routes } from "react-router-dom";

import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import DashboardLayout from "../components/layout/DashboardLayout";

import ViewProfile from "../pages/profile/ViewProfile";
import ChangePassword from "../pages/profile/ChangePassword";

import FirmProfile from "../pages/firm/FirmProfile";
import UpdateFirm from "../pages/firm/UpdateFirm";

import CreateTemplate from "../pages/template/CreateTemplate";
import UpdateTemplate from "../pages/template/UpdateTemplate";
import TemplateList from "../pages/template/TemplateList";
import ViewTemplate from "../pages/template/ViewTemplate";
import Dashboard from "../pages/dashboard/Dashboard";
import CreateFirm from "../pages/firm/CreateFirm";
import CreateCategory from "../pages/categories/CreateCategory";
import ViewCategory from "../pages/categories/ViewCategory";
import UpdateCategory from "../pages/categories/UpdateCategory";
import ClientTemplateList from "../pages/clients/ClientTemplateList";
import ClientViewTemplate from "../pages/clients/ClientViewTemplate";
import ProtectedRoute from "./ProtectedRoute";
                

const AppRoutes = () => {
return(
    <Routes>

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetPasswordToken" element={<ResetPassword />} />

        <Route element={<ProtectedRoute />}>
        <Route  element={<DashboardLayout />} >
        <Route path="/dashboard" element={<Dashboard/>} />
        
        <Route path="/profile" element={<ViewProfile /> } />
        <Route path="/change-password" element={<ChangePassword />} />


        <Route path="/firm" element={<FirmProfile />} />
        <Route path="/firm/create" element={<CreateFirm />} />
        <Route path="/firm/update" element={<UpdateFirm />} />  

        <Route path="/template/create" element={<CreateTemplate />} />
        <Route path="/template/update/:templateId" element={<UpdateTemplate />} />  
        <Route path="/templates" element={<TemplateList />} />
        <Route path="/template/view/:templateId" element = {<ViewTemplate />} />  
        <Route path="/category" element={<CreateCategory />} />
        <Route path="/categories" element={<ViewCategory />} />
        <Route path="/category/update/:categoryId" element={<UpdateCategory />} />
        
        





        
        </Route>
</Route>
        
        <Route path="/client/view" element={<ClientTemplateList />} />
        <Route path="/client/view/:templateId" element={<ClientViewTemplate />} />
    </Routes>
)
}

export default AppRoutes


