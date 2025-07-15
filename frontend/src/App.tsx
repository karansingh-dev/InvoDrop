import { Routes, Route } from "react-router-dom";
import Home from "./pages/(app)/Home";
import DashBoard from "./pages/(app)/Dashboard";
import SignUp from "./pages/auth/SignUp";
import { Toaster } from "@/components/ui/sonner";
import VerifyCode from "./pages/auth/VerifyCode";
import Login from "./pages/auth/Login";
import ProtectedRoutes from "./utils/ProtectedRoute";
import Clients from "./pages/clients/Clients";

import AddClient from "./pages/clients/AddClient";
import ManageRoutes from "./utils/ManageRoutes";
import Invoices from "./pages/invoices/Invoices";
import Pdf from "./utils/Pdf";
import { AddInvoice } from "./pages/invoices/AddInvoice";
import ViewInvoice from "./pages/invoices/ViewInvoice";
import EditClient from "./pages/clients/EditClient";
import { EditInvoice } from "./pages/invoices/EditInvoice";
import { Reports } from "./pages/Reports/Reports";
import { Settings } from "./pages/Settings/Settings";
import OnBoarding from "./pages/onBoarding/OnBoarding";


const App = () => {
 
   
  return (
    <>
      <Toaster richColors theme="light" position="top-right" />

      <Routes>
        {/* //public  Routes  */}

        <Route path="/pdf/download/:invoiceId" element={<Pdf />} />
        <Route path="/verify-code/:emailAddress" element={<VerifyCode />} />
        <Route path="/" element={<Home />} />

        <Route path="/onboarding" element={<OnBoarding />} />

        <Route element={<ManageRoutes />}>
          <Route path="/sign-up" element={<SignUp />} />

          <Route path="/login" element={<Login />} />
        </Route>

        {/* //Protected Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/invoices/create" element={<AddInvoice />} />

          <Route path="/invoices/:invoiceId" element={<ViewInvoice />} />
          <Route
            path="/invoices/edit-invoice/:invoiceId"
            element={<EditInvoice />}
          />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/reports" element={<Reports />} />

          <Route
            path="/clients/edit-client/:clientId"
            element={<EditClient />}
          />
          <Route path="/clients/add" element={<AddClient />} />

          <Route path="/settings/:space" element={<Settings />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
