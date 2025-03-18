import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/navbar/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Logo from "./logo.svg";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/product/ProductDetails";
import "./App.css";

function App() {
  return (
    // Envolvendo o aplicativo com o BrowserRouter para gerenciar as rotas
    <Router>
      <div className="App">
        <Navbar />
        {/* Definindo as rotas do aplicativo */}
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
