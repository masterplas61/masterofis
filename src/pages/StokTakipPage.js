import React, { useState } from "react";

export default function StokTakipPage() {
  const [stoklar, setStoklar] = useState([
    { isim: "HDPE Levha", adet: 10, aciklama: "Açılış stoğu" },
    { isim: "PP Levha", adet: 8, aciklama: "Geçen aydan kalan" },
  ]);
  const [yeniIsim, setYeniIsim] = useState("");
  const [yeniAdet, setYeniAdet] = useState("");
  const [yeniAciklama, setYeniAciklama] = useState("");
  const [log, setLog] = useState([]);
  const [filtre, setFiltre] = useState("");

  // Malzeme ekle
  const malzemeEkle = (e) => {
    e.preventDefault();
    if (!yeniIsim || !yeniAdet || isNaN(Number(yeniAdet))) return;

    setStoklar([
      ...stoklar,
      { isim: yeniIsim, adet: Number(yeniAdet), aciklama: yeniAciklama }
    ]);
    setLog([
      ...log,
      {
        zaman: new Date().toLocaleString(),
        mesaj: `Ekleme - "${yeniIsim}" adlı malzemeden ${yeniAdet} adet eklendi. Açıklama: "${yeniAciklama}".`,
      },
    ]);
    setYeniIsim("");
    setYeniAdet("");
    setYeniAciklama("");
  };

  // Malzeme tüket
  const tuket = (index) => {
    const miktar = prompt("Kaç adet tüketeceksiniz?");
    const miktarNum = Number(miktar);

    if (
      !miktar ||
      isNaN(miktarNum) ||
      miktarNum <= 0 ||
      miktarNum > stoklar[index].adet
    ) {
      alert("Geçersiz miktar!");
      return;
    }

    const sebep = prompt("Tüketim sebebi/gerekçesi nedir? (örn: proje, satış, fire, arıza...)");
    if (!sebep || sebep.trim().length === 0) {
      alert("Sebep/gerekçe girilmeden tüketim yapılamaz!");
      return;
    }

    const yeniStoklar = [...stoklar];
    yeniStoklar[index].adet -= miktarNum;

    setStoklar(yeniStoklar);
    setLog([
      ...log,
      {
        zaman: new Date().toLocaleString(),
        mesaj: `Tüketim - "${yeniStoklar[index].isim}" adlı malzemeden ${miktarNum} adet "${sebep}" için tüketildi.`,
      },
    ]);
  };

  // Filtrelenmiş stoklar
  const filtrelenmisStoklar = stoklar.filter((row) =>
    row.isim.toLowerCase().includes(filtre.toLowerCase())
  );

  return (
    <div>
      <h2>Stok Takibi</h2>

      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Malzeme ara..."
          value={filtre}
          onChange={e => setFiltre(e.target.value)}
          style={{ padding: 8, width: 250, marginRight: 12, fontSize: 16 }}
        />
      </div>

      <form onSubmit={malzemeEkle} style={{ marginBottom: 24, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Malzeme İsmi"
          value={yeniIsim}
          onChange={(e) => setYeniIsim(e.target.value)}
          style={{ flex: 2, minWidth: 200, fontSize: 16, padding: 8 }}
        />
        <input
          type="number"
          placeholder="Adet"
          value={yeniAdet}
          onChange={(e) => setYeniAdet(e.target.value)}
          style={{ flex: 1, minWidth: 100, fontSize: 16, padding: 8 }}
        />
        <input
          type="text"
          placeholder="Açıklama"
          value={yeniAciklama}
          onChange={(e) => setYeniAciklama(e.target.value)}
          style={{ flex: 3, minWidth: 250, fontSize: 16, padding: 8 }}
        />
        <button type="submit" style={{ fontSize: 16, padding: "8px 20px" }}>Ekle</button>
      </form>

      <div style={{overflowX: "auto"}}>
        <table border={1} cellPadding={10} style={{
          minWidth: 700,
          borderCollapse: "collapse",
          fontSize: 17,
          background: "#fff"
        }}>
          <thead style={{ background: "#e3f2fd" }}>
            <tr>
              <th style={{width: "30%"}}>Malzeme İsmi</th>
              <th style={{width: "15%"}}>Adet</th>
              <th style={{width: "40%"}}>Açıklama</th>
              <th style={{width: "15%"}}>Tüket</th>
            </tr>
          </thead>
          <tbody>
            {filtrelenmisStoklar.length === 0 && (
              <tr>
                <td colSpan={4}>Kriterlere uygun stok bulunamadı.</td>
              </tr>
            )}
            {filtrelenmisStoklar.map((row, i) => (
              <tr key={i}>
                <td>{row.isim}</td>
                <td>{row.adet}</td>
                <td>{row.aciklama || "-"}</td>
                <td>
                  <button
                    disabled={row.adet === 0}
                    onClick={() => tuket(stoklar.indexOf(row))}
                    style={{
                      background: "#ffa726",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      padding: "6px 16px",
                      fontSize: 16,
                      cursor: row.adet === 0 ? "not-allowed" : "pointer"
                    }}
                  >
                    Tüket
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 style={{ marginTop: 40 }}>İşlem Geçmişi</h3>
      <ul style={{ fontSize: 16 }}>
        {log.length === 0 && <li>Henüz işlem yapılmadı.</li>}
        {log
          .slice()
          .reverse()
          .map((item, idx) => (
            <li key={idx}>
              <span style={{ color: "#888" }}>{item.zaman} - </span>
              {item.mesaj}
            </li>
          ))}
      </ul>
    </div>
  );
}