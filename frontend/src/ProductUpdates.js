import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import DOMPurify from "dompurify";
import dayjs from "dayjs";
import { FiInfo } from "react-icons/fi";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";



const ProductUpdates = () => {
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [perPage, setPerPage] = useState(25);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const getFileName = () => {
    return dayjs().format("DD_MM_YYYY") + ".csv";
  };

  useEffect(() => {
    const fetchCSVData = async () => {
      const filename = getFileName();
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5000/csv/${filename}`);
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

    fetchCSVData();

    const handleEscape = (e) => {
      if (e.key === "Escape") setSelectedProduct(null);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handlePageClick = (data) => {
    setPageNumber(data.selected);
  };

  const handleProductDetail = (product) => {
    setSelectedProduct(product);
  };

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortOrder("asc");
    }
  };

  const getSortedData = () => {
    if (!sortColumn) return csvData;

    return [...csvData].sort((a, b) => {
      const valA = a[sortColumn] || "";
      const valB = b[sortColumn] || "";
      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });
  };

  const extractImageLinks = (urls) => {
    if (!urls) return [];
    return urls.split(/[\s,;]+/).map((url) => url.replace(/^"|"$/g, ""));
  };

  const displayedData = getSortedData().slice(
    pageNumber * perPage,
    (pageNumber + 1) * perPage
  );

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold text-center text-gray-800">
        Actualizaciones de Producto
      </h1>

      {loading && <p className="loading-message">Cargando productos...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="table-container">
        <table className="table border-collapse border border-gray-300 w-full">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Imagen</th>
              {["ID", "Marca", "Titulo", "Stock"].map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  className="border border-gray-300 p-2 cursor-pointer"
                >
                  {col} {sortColumn === col ? (sortOrder === "asc" ? "▲" : "▼") : "⇅"}
                </th>
              ))}
              <th className="border border-gray-300 p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {displayedData.length > 0 ? (
              displayedData.map((product) => {
                const imageLinks = extractImageLinks(product.Image_URLs);
                const icoUrl = imageLinks.find((url) =>
                  url.toLowerCase().includes("ico")
                );
                const jpgUrl = imageLinks.find((url) =>
                  url.toLowerCase().includes(".jpg")
                );
                const finalUrl = icoUrl || jpgUrl;

                return (
                  <tr key={product.ID}>
                    <td className="border border-gray-300 p-2">
                      {finalUrl ? (
                        <img
                          src={finalUrl}
                          alt="icono"
                          className="w-16 h-16 object-contain mx-auto"
                        />
                      ) : (
                        <span className="text-gray-400">Sin imagen</span>
                      )}
                    </td>
                    <td className="border border-gray-300 p-2">{product.ID}</td>
                    <td className="border border-gray-300 p-2">{product.Marca}</td>
                    <td className="border border-gray-300 p-2">{product.Titulo}</td>
                    <td className="border border-gray-300 p-2">{product.Stock}</td>
                    <td className="border border-gray-300 p-2 text-center">
                      <button
                        className="button bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                        onClick={() => handleProductDetail(product)}
                        aria-label="Ver detalle"
                      >
                        <FiInfo className="w-6 h-6" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center text-gray-500 border p-2"
                >
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
          activeClassName="font-bold"
        />
      </div>

      {selectedProduct && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/2 max-h-[80vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setSelectedProduct(null)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">Detalles del Producto</h2>

            <div className="space-y-2">
              {Object.entries(selectedProduct).map(([key, value]) => {
                if (key === "Image_URLs" || key === "Body") return null; // No mostrar Image_URLs como texto
                return (
                  <p key={key} className="text-sm">
                    <strong>{key}:</strong> {value || "N/A"}
                  </p>
                );
              })}
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Descripción</h3>
              <div
                className="body-content"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(selectedProduct.Body || ""),
                }}
              />
            </div>

            <style>
              {`
                .body-content img {
                  display: inline-block; /* Coloca las imágenes en línea */
                  margin: 4px; /* Espacio entre las imágenes */
                  width: auto; 
                  max-width: 100px; 
                  
                  object-fit: contain; /* Mantener proporciones */
                  vertical-align: middle;
                }
              `}
            </style>


            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Galería de Imágenes</h3>
              <div className="flex flex-wrap gap-4">
                {extractImageLinks(selectedProduct.Image_URLs).map((img, index) => (
                  <Zoom key={index}>
                    <img
                      src={img}
                      alt={`Imagen ${index + 1}`}
                      className="w-24 h-24 object-cover rounded shadow"
                    />
                  </Zoom>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ProductUpdates;
