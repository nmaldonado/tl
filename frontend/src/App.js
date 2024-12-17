import logo from './logo.svg';
import './App.css';
import Login from './login';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Index from './index';
import ProductUpdates from './ProductUpdates';
import GetProduct from './GetProduct';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/welcome" element={<Index />} />
        <Route path="/product-updates" element={<ProductUpdates />} />
        <Route path="/get-product" element={<GetProduct />} />
        <Route path="*" element={<Navigate to="/" />} /> {/* Redirecciona a login si no está autenticado */}
      </Routes>
    </Router>
  );
}

export default App;
