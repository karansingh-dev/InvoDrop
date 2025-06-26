import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DashBoard from './pages/Dashboard';
import SignUp from './pages/SignUp';
import { Toaster } from "@/components/ui/sonner"
import VerifyCode from './pages/VerifyCode';
import Login from './pages/Login';
import ProtectedRoutes from './utils/ProtectedRoute';
import Clients from './pages/Clients';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import AddClient from './pages/AddClient';
import ManageRoutes from './utils/ManageRoutes';
import Invoices from './pages/Invoices';
import Pdf from './utils/Pdf';
import SideBar from './components/custom/Sidebar';
import Header from './components/custom/Header';


const queryClient = new QueryClient()


const App = () => {




  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster richColors theme='light' position='top-right' />
        <div className="bg-slate-50 min-h-screen flex">
          <SideBar />
          <div className="flex flex-col w-full">
            <Header />


            <Routes>

        //Open Routes

              <Route path="/pdf/download/:invoiceId" element={<Pdf />} />
              <Route path="/verify-code/:emailAddress" element={<VerifyCode />} />


              <Route element={<ManageRoutes />}>

                <Route path="/" element={<Home />} />

                <Route path="/sign-up" element={<SignUp />} />

                <Route path="/login" element={<Login />} />


              </Route>



        //Protected Routes
              <Route element={<ProtectedRoutes />}>

                <Route path="/dashboard" element={<DashBoard />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/clients/add" element={<AddClient />} />

              </Route>



            </Routes>
          </div>
        </div>
      </QueryClientProvider>
    </>
  );
};

export default App;