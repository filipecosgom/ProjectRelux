import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProductList.css";

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/filipe-proj4/rest/products/"
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="product-list">
      {products.map((product) => (
        <div className="product-card" key={product.id}>
          <img
            src={product.imagem}
            alt={product.title}
            className="product-image"
          />
          <h2>{product.title}</h2>
          <p>Price: {product.price} €</p>
          <p>Localização: {product.local}</p>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
