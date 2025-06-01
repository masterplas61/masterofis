import React, { useEffect, useState } from "react";

function getAyYil(tarih) {
  if (!tarih) return "";
  const [yil, ay] = tarih.split("-"); // "2025-05-31" → ["2025","05","31"]
  return `${yil}-${ay}`;
}

export default function AylikOzetPage() {
  const [ayliklar, setAyliklar] = useState([]);

  useEffect(() => {
    const gelirler = JSON.parse(localStorage.getItem("gelirler") || "[]");
    const giderler = JSON.parse(localStorage.getItem("giderler") || "[]");

    // Aylık bazda topla
    const ozet = {};

    // Gelirler
    for (const g of gelirler) {
      const ay = getAyYil(g.tarih);
      if (!ozet[ay]) {
        ozet[ay] = {
          ay,
          toplamGelir: 0,
          toplamBrut: 0,
          toplamMasraf: 0,
          toplamGider: 0,
          toplamNet: 0
        };
      }
      ozet[ay].toplamGelir += Number(g.tutar || 0);
      ozet[ay].toplamBrut += Number(g.brutKar || 0);
      ozet[ay].toplamMasraf += Number(g.masraflar || 0);
      ozet[ay].toplamNet += Number(g.netKar || (g.brutKar || 0) - (g.masraflar || 0));
    }
    // Giderler
    for (const g of giderler) {
      const ay = getAyYil(g.tarih);
      if (!ozet[ay]) {
        ozet[ay] = {
          ay,
          toplamGelir: 0,
          toplamBrut: 0,
          toplamMasraf: 0,
          toplamGider: 0,
          toplamNet: 0
        };
      }
      ozet[ay].toplamGider += Number(g.tutar || 0);
      // İstenirse giderde brüt/masraf ayrımı yapılabilir, basit yapı için tümü toplamGider.
      ozet[ay].toplamNet -= Number(g.tutar || 0);
    }
    // Objeyi diziye çevir, yeniye göre sırala
    const ayliklar = Object.values(ozet)
      .sort((a, b) => a.ay < b.ay ? 1 : -1); // Yeni ay en üstte

    setAyliklar(ayliklar);
  }, []);

  function ayAd(ayYil) {
    if (!ayYil) return "-";
    const [yil, ay] = ayYil.split("-");
    const aylar = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
    return `${aylar[(Number(ay)-1)]} ${yil}`;
  }

  // Toplamlar (aydan bağımsız)
  const toplam = ayliklar.reduce((acc, a) => {
    acc.gelir += a.toplamGelir;
    acc.gider += a.toplamGider;
    acc.brut += a.toplamBrut;
    acc.masraf += a.toplamMasraf;
    acc.net += a.toplamNet;
    return acc;
  }, { gelir:0, gider:0, brut:0, masraf:0, net:0 });

  return (
    <div style={{ maxWidth: 900, margin: "auto", background: "#fff", padding: 24, borderRadius: 10 }}>
      <h2>Aylık Gelir/Gider Özeti</h2>
      <div style={{ overflowX: "auto" }}>
        <table border={1} cellPadding={8} style={{minWidth:800, borderCollapse:"collapse", fontSize:16, background:"#fafcff" }}>
          <thead style={{background:"#f0f6ff"}}>
            <tr>
              <th>Ay</th>
              <th>Toplam Gelir (₺)</th>
              <th>Toplam Gider (₺)</th>
              <th>Toplam Brüt Kar (₺)</th>
              <th>Toplam Masraf (₺)</th>
              <th>Toplam Net Kar (₺)</th>
            </tr>
          </thead>
          <tbody>
            {ayliklar.length === 0 && (
              <tr>
                <td colSpan={6}>Kayıt yok.</td>
              </tr>
            )}
            {ayliklar.map(a => (
              <tr key={a.ay}>
                <td>{ayAd(a.ay)}</td>
                <td>{a.toplamGelir.toLocaleString("tr-TR")}</td>
                <td>{a.toplamGider.toLocaleString("tr-TR")}</td>
                <td>{a.toplamBrut.toLocaleString("tr-TR")}</td>
                <td>{a.toplamMasraf.toLocaleString("tr-TR")}</td>
                <td style={{fontWeight:"bold", color:a.toplamNet>=0 ? "#197d19":"crimson"}}>
                  {a.toplamNet.toLocaleString("tr-TR")}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot style={{background:"#e7f6e7"}}>
            <tr>
              <th>Genel Toplam</th>
              <th>{toplam.gelir.toLocaleString("tr-TR")}</th>
              <th>{toplam.gider.toLocaleString("tr-TR")}</th>
              <th>{toplam.brut.toLocaleString("tr-TR")}</th>
              <th>{toplam.masraf.toLocaleString("tr-TR")}</th>
              <th style={{fontWeight:"bold", color:toplam.net>=0 ? "#197d19":"crimson"}}>
                {toplam.net.toLocaleString("tr-TR")}
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}