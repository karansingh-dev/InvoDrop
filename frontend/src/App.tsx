import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DashBoard from './pages/Dashboard';
import SignUp from './pages/SignUp';
import { Toaster } from "@/components/ui/sonner"
import VerifyCode from './pages/VerifyCode';

const App = () => {
  return (
    <>
      <Toaster richColors theme='light' position='top-right'/>

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/verify-code/:emailAddress" element={<VerifyCode />} />


      </Routes>
    </>
  );
};

export default App;