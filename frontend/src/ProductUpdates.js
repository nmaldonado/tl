import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";

const ProductUpdates = () => {
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [perPage, setPerPage] = useState(5);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchCSVData();
  }, []);

  const fetchCSVData = async () => {
    setLoading(true);
    setError(null);
    try {
      const filename = "17_12_2024.csv"; // Cambia esta lógica según la fecha
      const response = await fetch(`/csv/${filename}`);
      if (!response.ok) {
        throw new Error("Archivo no encontrado");
      }
      const data = await response.json();
      setCsvData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageClick = (data) => {
    setPageNumber(data.selected);
  };

  const handleProductDetail = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold text-center text-gray-800">Actualizaciones de Producto</h1>

      {loading && <p className="loading-message">Cargando productos...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Marca</th>
              <th>Titulo</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Advertencia de Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {csvData.length > 0 ? (
              csvData
                .slice(pageNumber * perPage, (pageNumber + 1) * perPage)
                .map((product) => (
                  <tr key={product.ID}>
                    <td>{product.ID}</td>
                    <td>{product.Marca}</td>
                    <td>{product.Titulo}</td>
                    <td>{product.Categoria}</td>
                    <td>{product.Stock}</td>
                    <td>{product.Advertencia_Stock}</td>
                    <td>
                      <button
                        className="button"
                        onClick={() => handleProductDetail(product)}
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-gray-500">
                  No hay productos para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <ReactPaginate
          pageCount={Math.ceil(csvData.length / perPage)}
          pageRangeDisplayed={5}
          marginPagesDisplayed={2}
          onPageChange={handlePageClick}
          containerClassName="pagination flex justify-center mt-4 space-x-2"
          pageClassName="page-item"
          pageLinkClassName="page-link px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          previousClassName="page-item"
          previousLinkClassName="page-link px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          nextClassName="page-item"
          nextLinkClassName="page-link px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabledClassName="disabled"
        />
      </div>

      {selectedProduct && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Detalles del Producto</h2>
              <button
                className="modal-close-button"
                onClick={() => setSelectedProduct(null)}
              >
                X
              </button>
            </div>
            <div className="modal-body">
              <p><strong>ID:</strong> {selectedProduct.ID}</p>
              <p><strong>Marca:</strong> {selectedProduct.Marca}</p>
              <p><strong>Titulo:</strong> {selectedProduct.Titulo}</p>
              <p><strong>Categoría:</strong> {selectedProduct.Categoria}</p>
              <p><strong>Stock:</strong> {selectedProduct.Stock}</p>
              <p><strong>Advertencia de Stock:</strong> {selectedProduct.Advertencia_Stock}</p>
              <p><strong>Descripción:</strong> {selectedProduct.Descripcion}</p>
              <p><strong>Detalles:</strong> {selectedProduct.Body}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductUpdates;
