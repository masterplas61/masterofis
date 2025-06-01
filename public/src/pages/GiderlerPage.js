import React, { useState, useEffect } from "react";

export default function GiderlerPage() {
  const [kisiler, setKisiler] = useState(["Kişi 1", "Kişi 2"]);
  const [giderler, setGiderler] = useState([]);
  const [yeni, setYeni] = useState({ kisi: "Kişi 1", tutar: "", aciklama: "", tarih: "" });
  const [yeniKisi, setYeniKisi] = useState("");
  const [duzenleIndex, setDuzenleIndex] = useState(null);
  const [duzenleKisi, setDuzenleKisi] = useState("");
  const [filtreKisi, setFiltreKisi] = useState("Tümü");
  const [giderDuzenleIndex, setGiderDuzenleIndex] = useState(null);
  const [giderDuzenleForm, setGiderDuzenleForm] = useState({ kisi: "", tutar: "", aciklama: "", tarih: "" });

  // Giderler ilk yüklemede localStorage'dan gelsin
  useEffect(() => {
    const kayitliGiderler = JSON.parse(localStorage.getItem("giderler") || "[]");
    setGiderler(kayitliGiderler);
  }, []);

  // Giderler değişince localStorage'a yaz
  useEffect(() => {
    localStorage.setItem("giderler", JSON.stringify(giderler));
  }, [giderler]);

  // Excel (CSV) olarak indir
  const giderleriIndir = () => {
    const basliklar = ["Kişi", "Tutar", "Açıklama", "Tarih"];
    const satirlar = giderler.map(g =>
      [
        `"${g.kisi}"`,
        `"${g.tutar}"`,
        `"${(g.aciklama || "").replace(/"/g, '""')}"`,
        `"${g.tarih}"`
      ].join(",")
    );
    const csv = [basliklar.join(","), ...satirlar].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "giderler.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Gider ekle
  const giderEkle = (e) => {
    e.preventDefault();
    if (!yeni.tutar || isNaN(Number(yeni.tutar)) || !yeni.kisi) return;
    setGiderler([
      ...giderler,
      {
        ...yeni,
        tutar: Number(yeni.tutar),
        tarih: yeni.tarih || new Date().toISOString().slice(0, 10),
      },
    ]);
    setYeni({ kisi: kisiler[0] || "", tutar: "", aciklama: "", tarih: "" });
  };

  // Gider düzenleme başlat
  const giderDuzenleBaslat = (index) => {
    setGiderDuzenleIndex(index);
    setGiderDuzenleForm({ ...giderler[index] });
  };

  // Gider düzenle kaydet
  const giderDuzenleKaydet = (e) => {
    e.preventDefault();
    if (
      !giderDuzenleForm.kisi ||
      !giderDuzenleForm.tutar ||
      isNaN(Number(giderDuzenleForm.tutar))
    ) return;
    const yeniGiderler = [...giderler];
    yeniGiderler[giderDuzenleIndex] = {
      ...giderDuzenleForm,
      tutar: Number(giderDuzenleForm.tutar),
    };
    setGiderler(yeniGiderler);
    setGiderDuzenleIndex(null);
    setGiderDuzenleForm({ kisi: "", tutar: "", aciklama: "", tarih: "" });
  };

  // Gider düzenle iptal
  const giderDuzenleIptal = () => {
    setGiderDuzenleIndex(null);
    setGiderDuzenleForm({ kisi: "", tutar: "", aciklama: "", tarih: "" });
  };

  // Gider sil fonksiyonu eklendi
  const giderSil = (index) => {
    if (!window.confirm("Bu gideri silmek istediğinize emin misiniz?")) return;
    const yeniGiderler = [...giderler];
    yeniGiderler.splice(index, 1);
    setGiderler(yeniGiderler);
  };

  // Kişi ekle
  const kisiEkle = (e) => {
    e.preventDefault();
    const isim = yeniKisi.trim();
    if (!isim || kisiler.includes(isim)) return;
    setKisiler([...kisiler, isim]);
    setYeniKisi("");
  };

  // Kişi sil
  const kisiSil = (index) => {
    const silinenKisi = kisiler[index];
    setKisiler(kisiler.filter((_, i) => i !== index));
    setGiderler(giderler.filter(g => g.kisi !== silinenKisi));
    if (yeni.kisi === silinenKisi) setYeni({ ...yeni, kisi: kisiler[0] || "" });
    if (duzenleIndex === index) {
      setDuzenleIndex(null);
      setDuzenleKisi("");
    }
    if (filtreKisi === silinenKisi) setFiltreKisi("Tümü");
  };

  // Kişi adını düzenlemeyi başlat
  const baslatKisiDuzenle = (index) => {
    setDuzenleIndex(index);
    setDuzenleKisi(kisiler[index]);
  };

  // Kişi düzenlemeyi kaydet
  const kisiDuzenleKaydet = (e) => {
    e.preventDefault();
    const isim = duzenleKisi.trim();
    if (!isim || kisiler.includes(isim)) {
      setDuzenleIndex(null);
      setDuzenleKisi("");
      return;
    }
    const eskiKisi = kisiler[duzenleIndex];
    const yeniKisiler = kisiler.map((k, i) => (i === duzenleIndex ? isim : k));
    setKisiler(yeniKisiler);
    // Giderlerde de ismi güncelle
    setGiderler(
      giderler.map(g => g.kisi === eskiKisi ? { ...g, kisi: isim } : g)
    );
    if (yeni.kisi === eskiKisi) setYeni({ ...yeni, kisi: isim });
    if (filtreKisi === eskiKisi) setFiltreKisi(isim);
    setDuzenleIndex(null);
    setDuzenleKisi("");
  };

  // Kişi düzenlemeyi iptal et
  const kisiDuzenleIptal = () => {
    setDuzenleIndex(null);
    setDuzenleKisi("");
  };

  // Kişi bazında toplam
  const toplamlar = kisiler.reduce((acc, kisi) => {
    acc[kisi] = giderler.filter(g => g.kisi === kisi).reduce((sum, g) => sum + g.tutar, 0);
    return acc;
  }, {});

  // Filtreye göre giderler
  const filtrelenmisGiderler = filtreKisi === "Tümü"
    ? giderler
    : giderler.filter(g => g.kisi === filtreKisi);

  return (
    <div>
      <h2>Gider Takibi</h2>

      {/* Kişi filtreleme */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontWeight: "bold", marginRight: 8 }}>Filtrele: </label>
        <select
          value={filtreKisi}
          onChange={e => setFiltreKisi(e.target.value)}
          style={{ fontSize: 16, padding: 6, minWidth: 160, marginRight: 18 }}
        >
          <option value="Tümü">Tümü</option>
          {kisiler.map(kisi => (
            <option key={kisi} value={kisi}>{kisi}</option>
          ))}
        </select>
      </div>

      {/* Kişi ekle/düzenle */}
      <div style={{ marginBottom: 24 }}>
        <form onSubmit={kisiEkle} style={{ display: "inline-flex", gap: 10, marginBottom: 10 }}>
          <input
            type="text"
            placeholder="Kişi adı ekle"
            value={yeniKisi}
            onChange={e => setYeniKisi(e.target.value)}
            style={{ fontSize: 16, padding: 8, minWidth: 160 }}
          />
          <button type="submit" style={{ fontSize: 16, padding: "8px 20px" }}>Kişi Ekle</button>
        </form>
        <div style={{ marginTop: 8, fontSize: 16 }}>
          {kisiler.length === 0 && <span>Kişi yok.</span>}
          {kisiler.map((kisi, i) =>
            duzenleIndex === i ? (
              <form
                key={i}
                onSubmit={kisiDuzenleKaydet}
                style={{ display: "inline-flex", gap: 5, marginRight: 12 }}
              >
                <input
                  type="text"
                  value={duzenleKisi}
                  onChange={e => setDuzenleKisi(e.target.value)}
                  style={{ fontSize: 16, padding: 4, minWidth: 100 }}
                  autoFocus
                  required
                />
                <button type="submit" style={{ fontSize: 16, padding: "2px 10px" }}>Kaydet</button>
                <button type="button" onClick={kisiDuzenleIptal} style={{ fontSize: 16, padding: "2px 10px" }}>İptal</button>
              </form>
            ) : (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", marginRight: 16 }}>
                <span
                  style={{
                    cursor: "pointer",
                    borderBottom: "1px dashed #888",
                    marginRight: 6,
                  }}
                  title="Düzenle"
                  onClick={() => baslatKisiDuzenle(i)}
                >
                  {kisi}
                </span>
                <button
                  style={{ fontSize: 14, padding: "2px 7px", marginLeft: 2 }}
                  onClick={() => kisiSil(i)}
                  title="Kişiyi sil"
                  disabled={kisiler.length < 2}
                >
                  ×
                </button>
              </span>
            )
          )}
        </div>
      </div>

      {/* Gider ekle */}
      <form onSubmit={giderEkle} style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
        <select
          value={yeni.kisi}
          onChange={e => setYeni({ ...yeni, kisi: e.target.value })}
          style={{ fontSize: 16, padding: 8, minWidth: 160 }}
        >
          {kisiler.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
        <input
          type="number"
          placeholder="Tutar (₺)"
          value={yeni.tutar}
          onChange={e => setYeni({ ...yeni, tutar: e.target.value })}
          style={{ fontSize: 16, padding: 8, minWidth: 150 }}
          required
        />
        <input
          type="text"
          placeholder="Açıklama"
          value={yeni.aciklama}
          onChange={e => setYeni({ ...yeni, aciklama: e.target.value })}
          style={{ fontSize: 16, padding: 8, minWidth: 300 }}
        />
        <input
          type="date"
          value={yeni.tarih}
          onChange={e => setYeni({ ...yeni, tarih: e.target.value })}
          style={{ fontSize: 16, padding: 8, minWidth: 180 }}
        />
        <button type="submit" style={{ fontSize: 16, padding: "8px 28px" }}>Ekle</button>
      </form>

      {/* Gider tablosu */}
      <table border={1} cellPadding={12} style={{ minWidth: 1150, fontSize: 17, borderCollapse: "collapse", background: "#fff" }}>
        <thead style={{ background: "#ffe082" }}>
          <tr>
            <th style={{ width: "17%" }}>Kişi</th>
            <th style={{ width: "18%" }}>Tutar (₺)</th>
            <th style={{ width: "40%" }}>Açıklama</th>
            <th style={{ width: "20%" }}>Tarih</th>
            <th style={{ width: "5%" }}>İşlem</th>
            <th style={{ width: "5%" }}>Sil</th>
          </tr>
        </thead>
        <tbody>
          {filtrelenmisGiderler.length === 0 && (
            <tr><td colSpan={6}>Henüz gider eklenmedi.</td></tr>
          )}
          {filtrelenmisGiderler.map((g, i) => {
            // Orijinal indexi bulalım (filtreliyse!)
            const realIndex = giderler.findIndex(
              (item) =>
                item.kisi === g.kisi &&
                item.tutar === g.tutar &&
                item.aciklama === g.aciklama &&
                item.tarih === g.tarih
            );
            if (giderDuzenleIndex === realIndex) {
              return (
                <tr key={i}>
                  <td>
                    <select
                      value={giderDuzenleForm.kisi}
                      onChange={e => setGiderDuzenleForm({ ...giderDuzenleForm, kisi: e.target.value })}
                      style={{ fontSize: 16, padding: 4, minWidth: 120 }}
                    >
                      {kisiler.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={giderDuzenleForm.tutar}
                      onChange={e => setGiderDuzenleForm({ ...giderDuzenleForm, tutar: e.target.value })}
                      style={{ fontSize: 16, padding: 4, minWidth: 100 }}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={giderDuzenleForm.aciklama}
                      onChange={e => setGiderDuzenleForm({ ...giderDuzenleForm, aciklama: e.target.value })}
                      style={{ fontSize: 16, padding: 4, minWidth: 200 }}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={giderDuzenleForm.tarih}
                      onChange={e => setGiderDuzenleForm({ ...giderDuzenleForm, tarih: e.target.value })}
                      style={{ fontSize: 16, padding: 4, minWidth: 120 }}
                    />
                  </td>
                  <td>
                    <button onClick={giderDuzenleKaydet} style={{ fontSize: 15, marginRight: 6 }}>Kaydet</button>
                    <button onClick={giderDuzenleIptal} style={{ fontSize: 15 }}>İptal</button>
                  </td>
                  <td>
                    <button onClick={() => giderSil(realIndex)} style={{ fontSize: 15, color:"crimson" }}>Sil</button>
                  </td>
                </tr>
              );
            }
            return (
              <tr key={i}>
                <td>{g.kisi}</td>
                <td>{g.tutar.toLocaleString("tr-TR", {minimumFractionDigits:2})}</td>
                <td>{g.aciklama}</td>
                <td>{g.tarih}</td>
                <td>
                  <button onClick={() => giderDuzenleBaslat(realIndex)} style={{ fontSize: 15 }}>
                    Düzenle
                  </button>
                </td>
                <td>
                  <button onClick={() => giderSil(realIndex)} style={{ fontSize: 15, color:"crimson" }}>Sil</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Excel İndir Butonu */}
      <button
        onClick={giderleriIndir}
        style={{ fontSize: 16, padding: "8px 18px", marginBottom: 18, marginTop: 36, marginRight: 16 }}
      >
        Excel (CSV) Olarak İndir
      </button>

      <h3 style={{ marginTop: 16 }}>Toplamlar</h3>
      <ul style={{ fontSize: 18 }}>
        {kisiler.map(kisi => (
          <li key={kisi}><b>{kisi}:</b> {toplamlar[kisi]?.toLocaleString("tr-TR", {minimumFractionDigits:2}) || "0.00"} ₺</li>
        ))}
        <li><b>Toplam:</b> {Object.values(toplamlar).reduce((a, b) => a + b, 0).toLocaleString("tr-TR", {minimumFractionDigits:2})} ₺</li>
      </ul>
    </div>
  );
}