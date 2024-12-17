import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Link } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();

function Index() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Menú Principal</h1>
      <ul className="space-y-4">
        <li>
          <Link
            to="/product-updates"
            className="block px-6 py-3 text-lg font-semibold text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600 transition duration-300 text-center"
          >
            Actualizaciones de producto
          </Link>
        </li>
        <li>
          <Link
            to="/get-product"
            className="block px-6 py-3 text-lg font-semibold text-white bg-green-500 rounded-lg shadow hover:bg-green-600 transition duration-300 text-center"
          >
            Obtener producto
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Index;
