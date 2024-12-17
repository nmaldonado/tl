// frontend/src/ProductUpdates.js
import React, { useEffect, useState } from 'react';

function ProductUpdates() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Simula la llamada al web service para obtener productos
    fetch('http://localhost:5000/products')  // Reemplaza con el web service real
      .then(response => response.json())
      .then(data => setProducts(data));
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div>
      <h2>Actualizaciones de producto</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} onClick={() => handleProductClick(product)}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedProduct && (
        <div className="modal">
          <h3>{selectedProduct.name}</h3>
          <p>{selectedProduct.description}</p>
          <button onClick={() => setSelectedProduct(null)}>Cerrar</button>
        </div>
      )}
    </div>
  );
}

export default ProductUpdates;
