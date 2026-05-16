const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

let ads = [];

// 📦 VERİYİ DOSYADAN YÜKLE
if (fs.existsSync("ads.json")) {
    ads = JSON.parse(fs.readFileSync("ads.json"));
}

/*
REKLAM MODELİ:
{
  id,
  title,
  category,
  videoUrl,
  duration,
  price,
  createdAt
}
*/

// 💰 FİYAT HESAPLAMA SİSTEMİ
function calculatePrice(category, duration){

    let base = 170; // günlük başlangıç

    let multipliers = {
        araba: 3,
        teknoloji: 2.5,
        mobilya: 2,
        tekstil: 2,
        aksesuar: 1.8,
        bijuteri: 1.8,
        canta: 1.8,
        teknik: 2.2,
        dekorasyon: 2,
        tamir: 2,
        tasimacilik: 2.5,
        uretim: 2.3,
        market: 1.5,
        kisisel: 1.5,
        muzik: 2
    };

    let price = base * (multipliers[category] || 1);

    if(duration === "haftalik") price *= 4;
    if(duration === "aylik") price *= 30;

    return Math.round(price);
}

// 📥 REKLAM EKLE
app.post("/add", (req, res) => {

    let price = calculatePrice(req.body.category, req.body.duration);

    let newAd = {
        id: Date.now(),
        title: req.body.title,
        category: req.body.category,
        videoUrl: req.body.videoUrl,
        duration: req.body.duration,
        price: price,
        createdAt: new Date()
    };

    ads.push(newAd);

    fs.writeFileSync("ads.json", JSON.stringify(ads, null, 2));

    res.json({
        message: "✔ Reklam eklendi",
        ad: newAd
    });
});

// 📤 TÜM REKLAMLAR
app.get("/ads", (req, res) => {
    res.json(ads);
});

// 📂 KATEGORİ FİLTRE
app.get("/ads/:category", (req, res) => {
    let filtered = ads.filter(a => a.category === req.params.category);
    res.json(filtered);
});

// 📊 KATEGORİ LİSTESİ
app.get("/categories", (req, res) => {
    let cats = [...new Set(ads.map(a => a.category))];
    res.json(cats);
});

// 🚀 SERVER START
app.listen(3000, () => {
    console.log("🔥 DİJİTAL REKLAM TV PRO SERVER AKTİF");
});
