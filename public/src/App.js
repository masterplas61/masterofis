import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import HesaplamaPage from "./pages/HesaplamaPage";
import GelirlerPage from "./pages/GelirlerPage";
import GiderlerPage from "./pages/GiderlerPage";
import ProjelerPage from "./pages/ProjelerPage";
import StokTakipPage from "./pages/StokTakipPage";
import AylikOzetPage from "./pages/AylikOzetPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";

function PrivateRoute({ isAuthenticated, children }) {
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("isAuthenticated")
  );

  const handleLogin = (username, password) => {
    if (username === "masterplast" && password === "Tucson6177.") {
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        <Route
          path="/login"
          element={
            <LoginPage
              isAuthenticated={isAuthenticated}
              onLogin={handleLogin}
            />
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/hesaplama"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <HesaplamaPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/gelirler"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <GelirlerPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/giderler"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <GiderlerPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/projeler"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <ProjelerPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/stok-takip"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <StokTakipPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/aylik-ozet"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <AylikOzetPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}