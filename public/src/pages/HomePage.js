import React, { useState } from "react";
import logo from "../masterplast-logo.png"; // Logoyu projenin src/ klasörüne kaydedin ve yolu kontrol edin

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Burada giriş kontrolü eklenebilir (örn: backend, local kontrol)
    if (username && password) {
      alert(`Hoşgeldin ${username}!`);
      // Giriş başarılı ise yönlendirme veya başka işlem eklenebilir
    } else {
      alert("Kullanıcı adı ve şifre giriniz.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f7f7f7",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          boxShadow: "0 6px 32px rgba(0,0,0,0.12)",
          padding: 40,
          width: 340,
          textAlign: "center",
        }}
      >
        <img
          src={logo}
          alt="Masterplast Logo"
          style={{ width: 160, marginBottom: 24 }}
        />
        <h2 style={{ margin: "12px 0 28px 0", color: "#ff6600", fontWeight: 700 }}>
          Hoşgeldiniz
        </h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Kullanıcı Adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              margin: "12px 0",
              borderRadius: 6,
              border: "1px solid #ddd",
              fontSize: 16,
            }}
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              margin: "12px 0",
              borderRadius: 6,
              border: "1px solid #ddd",
              fontSize: 16,
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              background: "#ff6600",
              color: "white",
              border: "none",
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
              marginTop: 12,
            }}
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}