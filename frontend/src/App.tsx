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

const queryClient = new QueryClient()


const App = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster richColors theme='light' position='top-right' />

        <Routes>

        //Open Routes
          <Route path="/" element={<Home />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/verify-code/:emailAddress" element={<VerifyCode />} />
          <Route path="/login" element={<Login />} />



        //Protected Routes
          <Route element={<ProtectedRoutes />}>

            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/clients" element={<Clients />} />

          </Route>



        </Routes>
      </QueryClientProvider>
    </>
  );
};

export default App;