import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/navbar/Footer";
import Breadcrumbs from "./components/navbar/Breadcrumbs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import UserList from "./pages/UserList";
import AdminPanel from "./pages/AdminPanel";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/product/ProductDetails";
import CategoryProducts from "./components/category/CategoryProducts";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Chat from "./pages/Chat";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { userStore } from "./stores/UserStore";
import SessionManager from "./components/SessionManager"; // Ajuste o caminho conforme necessário

function App() {
  const { username } = userStore(); // Obtém o username do usuário logado da store

  return (
    <Router>
      <SessionManager>
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
            <Route
              path="/profile/:username"
              element={
                <>
                  <Breadcrumbs />
                  <UserProfile />
                </>
              }
            />
            <Route path="/admin" element={<AdminPanel />} />
            <Route
              path="/users"
              element={
                <>
                  <Breadcrumbs />
                  <UserList />
                </>
              }
            />
            <Route
              path="/profile/:username"
              element={
                <>
                  <Breadcrumbs />
                  <Profile />
                </>
              }
            />
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
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/chat" element={<Chat loggedInUser={username} />} />
            <Route
              path="/chat/:username"
              element={<Chat loggedInUser={username} />}
            />
          </Routes>
          <Footer />
          <ToastContainer theme="dark" />
        </div>
      </SessionManager>
    </Router>
  );
}

export default App;
