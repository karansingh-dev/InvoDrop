import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DashBoard from './pages/Dashboard';
import SignUp from './pages/SignUp';


const App = () => {
  return (
    <>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/sign-up" element={<SignUp />} />


      </Routes>
    </>
  );
};

export default App;