import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/navbar/Footer";
import Login from "./pages/Login";
import Logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    // Envolvendo o aplicativo com o BrowserRouter para gerenciar as rotas
    <Router>
      <div className="App">
        <Navbar />
        {/* Definindo as rotas do aplicativo */}
        <Routes>
          <Route
            path="/"
            element={
              <header className="App-body">
                <img src={Logo} className="App-logo" alt="logo" />
                <p>
                  Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href="https://reactjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn React
                </a>
              </header>
            }
          />

          {/* Rota para a página de login */}
          <Route path="/login" element={<Login />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
