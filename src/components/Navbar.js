import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ isAuthenticated, onLogout }) {
  return (
    <nav style={{ background: "#f1f1f1", padding: 12, marginBottom: 24 }}>
      {isAuthenticated && (
        <>
          <Link to="/" style={{ margin: 10 }}>Ana Sayfa</Link>
          <Link to="/hesaplama" style={{ margin: 10 }}>Hesaplama</Link>
          <Link to="/gelirler" style={{ margin: 10 }}>Gelirler</Link>
          <Link to="/giderler" style={{ margin: 10 }}>Giderler</Link>
          <Link to="/projeler" style={{ margin: 10 }}>Projeler</Link>
          <Link to="/stok-takip" style={{ margin: 10 }}>Stok Takip</Link>
          <Link to="/aylik-ozet" style={{ margin: 10 }}>Aylık Özet</Link>
          <button
            style={{
              marginLeft: 20,
              background: "#ff6600",
              color: "white",
              border: "none",
              borderRadius: 5,
              padding: "8px 16px",
              cursor: "pointer",
            }}
            onClick={onLogout}
          >
            Çıkış Yap
          </button>
        </>
      )}
      {!isAuthenticated && (
        <Link to="/login" style={{ margin: 10 }}>Giriş</Link>
      )}
    </nav>
  );
}