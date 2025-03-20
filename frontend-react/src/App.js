import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/navbar/Footer";
import Breadcrumbs from "./components/navbar/Breadcrumbs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/product/ProductDetails";
import CategoryProducts from "./components/category/CategoryProducts";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Breadcrumbs />
                <ProductList />
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route
            path="/product/:id"
            element={
              <>
                <Breadcrumbs />
                <ProductDetails />
              </>
            }
          />
          <Route
            path="/category/:categoryId"
            element={
              <>
                <Breadcrumbs />
                <CategoryProducts />
              </>
            }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
