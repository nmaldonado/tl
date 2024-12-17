// frontend/src/GetProduct.js
import React, { useEffect, useState } from 'react';

function GetProduct() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Llamada para obtener categorías
    fetch('http://localhost:5000/categories')  // Reemplaza con el web service real
      .then(response => response.json())
      .then(data => setCategories(data));
  }, []);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);

    // Llamada para obtener productos de la categoría seleccionada
    fetch(`http://localhost:5000/products?category=${category}`)  // Reemplaza con el web service real
      .then(response => response.json())
      .then(data => setProducts(data));
  };

  return (
    <div>
      <h2>Obtener producto</h2>
      <select value={selectedCategory} onChange={handleCategoryChange}>
        <option value="">Seleccione una categoría</option>
        {categories.map(category => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>

      <ul>
        {products.map(product => (
          <li key={product.id} onClick={() => setSelectedProduct(product)}>
            {product.name}
          </li>
        ))}
      </ul>

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

export default GetProduct;
