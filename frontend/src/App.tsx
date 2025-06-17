
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DashBoard from './pages/Dashboard';


const App = () => {
  return (
    <>

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashBoard />} />

      </Routes>
    </>
  );
};

export default App;