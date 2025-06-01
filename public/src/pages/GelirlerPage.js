import React, { useState, useEffect } from "react";

export default function GelirlerPage() {
  const [gelirler, setGelirler] = useState([]);
  const [kimden, setKimden] = useState("");
  const [faturaNo, setFaturaNo] = useState("");
  const [tutar, setTutar] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [tarih, setTarih] = useState("");
  const [brutKar, setBrutKar] = useState("");
  const [masraflar, setMasraflar] = useState("");
  const [filtre, setFiltre] = useState("");
  const [duzenleIndex, setDuzenleIndex] = useState(null);
  const [duzenleForm, setDuzenleForm] = useState({
    kimden: "",
    faturaNo: "",
    tutar: "",
    aciklama: "",
    tarih: "",
    brutKar: "",
    masraflar: "",
  });

  // İlk yüklemede gelirleri localStorage'dan yükle
  useEffect(() => {
    const kayitliGelirler = JSON.parse(localStorage.getItem("gelirler") || "[]");
    setGelirler(kayitliGelirler);
  }, []);

  // Gelir ekle
  const gelirEkle = (e) => {
    e.preventDefault();
    if (!tutar || !tarih || !kimden || !faturaNo || !brutKar) return;
    const yeniGelir = {
      tutar: Number(tutar),
      kimden,
      faturaNo,
      aciklama,
      tarih,
      brutKar: Number(brutKar),
      masraflar: Number(masraflar) || 0,
      netKar: Number(brutKar) - (Number(masraflar) || 0),
      id: Date.now()
    };
    const kayitliGelirler = JSON.parse(localStorage.getItem("gelirler") || "[]");
    const yeniGelirler = [...kayitliGelirler, yeniGelir];
    setGelirler(yeniGelirler);
    localStorage.setItem("gelirler", JSON.stringify(yeniGelirler));
    setKimden("");
    setFaturaNo("");
    setTutar("");
    setAciklama("");
    setTarih("");
    setBrutKar("");
    setMasraflar("");
  };

  // Gelir sil
  const gelirSil = (id) => {
    if (!window.confirm("Bu geliri silmek istediğinize emin misiniz?")) return;
    const yeniGelirler = gelirler.filter(g => g.id !== id);
    setGelirler(yeniGelirler);
    localStorage.setItem("gelirler", JSON.stringify(yeniGelirler));
  };

  // Düzenlemeyi başlat
  const baslatDuzenle = (index) => {
    setDuzenleIndex(index);
    const g = gelirler[index];
    setDuzenleForm({
      kimden: g.kimden,
      faturaNo: g.faturaNo,
      tutar: g.tutar,
      aciklama: g.aciklama,
      tarih: g.tarih,
      brutKar: g.brutKar,
      masraflar: g.masraflar,
    });
  };

  // Düzenlemeyi kaydet
  const duzenlemeyiKaydet = (e) => {
    e.preventDefault();
    if (
      !duzenleForm.tutar ||
      !duzenleForm.tarih ||
      !duzenleForm.kimden ||
      !duzenleForm.faturaNo ||
      !duzenleForm.brutKar
    )
      return;
    const yeniGelirler = [...gelirler];
    yeniGelirler[duzenleIndex] = {
      ...yeniGelirler[duzenleIndex],
      kimden: duzenleForm.kimden,
      faturaNo: duzenleForm.faturaNo,
      tutar: Number(duzenleForm.tutar),
      aciklama: duzenleForm.aciklama,
      tarih: duzenleForm.tarih,
      brutKar: Number(duzenleForm.brutKar),
      masraflar: Number(duzenleForm.masraflar) || 0,
      netKar: Number(duzenleForm.brutKar) - (Number(duzenleForm.masraflar) || 0),
    };
    setGelirler(yeniGelirler);
    setDuzenleIndex(null);
    setDuzenleForm({
      kimden: "",
      faturaNo: "",
      tutar: "",
      aciklama: "",
      tarih: "",
      brutKar: "",
      masraflar: "",
    });
    localStorage.setItem("gelirler", JSON.stringify(yeniGelirler));
  };

  // Düzenlemeyi iptal et
  const duzenlemeyiIptalEt = () => {
    setDuzenleIndex(null);
    setDuzenleForm({
      kimden: "",
      faturaNo: "",
      tutar: "",
      aciklama: "",
      tarih: "",
      brutKar: "",
      masraflar: "",
    });
  };

  // Filtreli gelirler
  const filtrelenmisGelirler = gelirler.filter(
    g =>
      (!filtre ||
        (g.aciklama && g.aciklama.toLowerCase().includes(filtre.toLowerCase())) ||
        (g.kimden && g.kimden.toLowerCase().includes(filtre.toLowerCase())) ||
        (g.faturaNo && g.faturaNo.toLowerCase().includes(filtre.toLowerCase()))
      )
  );

  // Toplamlar
  const toplamGelir = filtrelenmisGelirler.reduce((sum, g) => sum + Number(g.tutar || 0), 0);
  const toplamBrut = filtrelenmisGelirler.reduce((sum, g) => sum + Number(g.brutKar || 0), 0);
  const toplamMasraf = filtrelenmisGelirler.reduce((sum, g) => sum + Number(g.masraflar || 0), 0);
  const toplamNet = filtrelenmisGelirler.reduce((sum, g) => sum + Number(g.netKar || ((g.brutKar || 0) - (g.masraflar || 0))), 0);

  return (
    <div style={{ maxWidth: 1200, margin: "auto", background: "#fff", padding: 24, borderRadius: 10 }}>
      <h2>Gelirler</h2>
      <form onSubmit={gelirEkle} style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Kimden"
          value={kimden}
          onChange={e => setKimden(e.target.value)}
          style={{ width: 120, fontSize: 16, padding: 8 }}
          required
        />
        <input
          type="text"
          placeholder="Fatura No"
          value={faturaNo}
          onChange={e => setFaturaNo(e.target.value)}
          style={{ width: 100, fontSize: 16, padding: 8 }}
          required
        />
        <input
          type="number"
          placeholder="Tutar (₺)"
          value={tutar}
          onChange={e => setTutar(e.target.value)}
          style={{ width: 110, fontSize: 16, padding: 8 }}
          required
        />
        <input
          type="text"
          placeholder="Açıklama"
          value={aciklama}
          onChange={e => setAciklama(e.target.value)}
          style={{ width: 160, fontSize: 16, padding: 8 }}
        />
        <input
          type="date"
          value={tarih}
          onChange={e => setTarih(e.target.value)}
          style={{ width: 120, fontSize: 16, padding: 8 }}
          required
        />
        <input
          type="number"
          placeholder="Brüt Kar (₺)"
          value={brutKar}
          onChange={e => setBrutKar(e.target.value)}
          style={{ width: 110, fontSize: 16, padding: 8 }}
          required
        />
        <input
          type="number"
          placeholder="Masraflar (₺)"
          value={masraflar}
          onChange={e => setMasraflar(e.target.value)}
          style={{ width: 110, fontSize: 16, padding: 8 }}
        />
        <button type="submit" style={{ fontSize: 16, padding: "8px 18px" }}>Gelir Ekle</button>
      </form>
      <div style={{ marginBottom: 14 }}>
        <input
          type="text"
          placeholder="Açıklama, fatura no veya kimden ile filtrele..."
          value={filtre}
          onChange={e => setFiltre(e.target.value)}
          style={{ padding: 8, width: 300, fontSize: 16 }}
        />
      </div>
      <div style={{ marginBottom: 10, fontWeight: "bold", fontSize: 18, display: "flex", gap: 28 }}>
        <span>Toplam Gelir: ₺{toplamGelir.toLocaleString("tr-TR")}</span>
        <span>Toplam Brüt Kar: ₺{toplamBrut.toLocaleString("tr-TR")}</span>
        <span>Toplam Masraf: ₺{toplamMasraf.toLocaleString("tr-TR")}</span>
        <span>Toplam Net Kar: ₺{toplamNet.toLocaleString("tr-TR")}</span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table border={1} cellPadding={8} style={{
          minWidth: 1100, borderCollapse: "collapse", fontSize: 16, background: "#fafcff"
        }}>
          <thead style={{ background: "#e0f7fa" }}>
            <tr>
              <th>Kimden</th>
              <th>Fatura No</th>
              <th>Tutar (₺)</th>
              <th>Açıklama</th>
              <th>Tarih</th>
              <th>Brüt Kar (₺)</th>
              <th>Masraflar (₺)</th>
              <th>Net Kar (₺)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtrelenmisGelirler.length === 0 && (
              <tr>
                <td colSpan={9}>Kayıt yok.</td>
              </tr>
            )}
            {filtrelenmisGelirler.map((g, i) => (
              duzenleIndex === i ? (
                <tr key={g.id}>
                  <td>
                    <input
                      type="text"
                      value={duzenleForm.kimden}
                      onChange={e => setDuzenleForm({ ...duzenleForm, kimden: e.target.value })}
                      style={{ width: "95%", fontSize: 15, padding: 4 }}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={duzenleForm.faturaNo}
                      onChange={e => setDuzenleForm({ ...duzenleForm, faturaNo: e.target.value })}
                      style={{ width: "95%", fontSize: 15, padding: 4 }}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={duzenleForm.tutar}
                      onChange={e => setDuzenleForm({ ...duzenleForm, tutar: e.target.value })}
                      style={{ width: "95%", fontSize: 15, padding: 4 }}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={duzenleForm.aciklama}
                      onChange={e => setDuzenleForm({ ...duzenleForm, aciklama: e.target.value })}
                      style={{ width: "95%", fontSize: 15, padding: 4 }}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={duzenleForm.tarih}
                      onChange={e => setDuzenleForm({ ...duzenleForm, tarih: e.target.value })}
                      style={{ width: "95%", fontSize: 15, padding: 4 }}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={duzenleForm.brutKar}
                      onChange={e => setDuzenleForm({ ...duzenleForm, brutKar: e.target.value })}
                      style={{ width: "95%", fontSize: 15, padding: 4 }}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={duzenleForm.masraflar}
                      onChange={e => setDuzenleForm({ ...duzenleForm, masraflar: e.target.value })}
                      style={{ width: "95%", fontSize: 15, padding: 4 }}
                    />
                  </td>
                  <td style={{ fontWeight: "bold", color: "#197d19" }}>
                    {(Number(duzenleForm.brutKar || 0) - Number(duzenleForm.masraflar || 0)).toLocaleString("tr-TR")}
                  </td>
                  <td>
                    <button onClick={duzenlemeyiKaydet} style={{ fontSize: 15, marginRight: 8 }}>Kaydet</button>
                    <button onClick={duzenlemeyiIptalEt} style={{ fontSize: 15 }}>İptal</button>
                  </td>
                </tr>
              ) : (
                <tr key={g.id}>
                  <td>{g.kimden}</td>
                  <td>{g.faturaNo}</td>
                  <td>{Number(g.tutar || 0).toLocaleString("tr-TR")}</td>
                  <td>{g.aciklama || "-"}</td>
                  <td>{g.tarih}</td>
                  <td>{Number(g.brutKar || 0).toLocaleString("tr-TR")}</td>
                  <td>{Number(g.masraflar || 0).toLocaleString("tr-TR")}</td>
                  <td style={{ fontWeight: "bold", color: "#197d19" }}>
                    {Number(g.netKar || ((g.brutKar || 0) - (g.masraflar || 0))).toLocaleString("tr-TR")}
                  </td>
                  <td>
                    <button
                      onClick={() => baslatDuzenle(i)}
                      style={{
                        background: "#0b8",
                        color: "#fff",
                        border: "none",
                        borderRadius: 5,
                        padding: "6px 12px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        fontSize: 15,
                        marginRight: 6
                      }}
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => gelirSil(g.id)}
                      style={{
                        background: "#e74c3c",
                        color: "#fff",
                        border: "none",
                        borderRadius: 5,
                        padding: "6px 12px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        fontSize: 15
                      }}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}