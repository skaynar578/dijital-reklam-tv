const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

// 📂 KATEGORİLER
const categories = [
    "araba","teknoloji","trend","yerel","muzik",
    "mobilya","aksesuar","giyim","taki","canta",
    "servis","dekorasyon","tamir","nakliye",
    "uretim","market","kisisel","spor"
];

// 📁 ADS KLASÖRÜ + JSON DOSYALARI OTOMATİK OLUŞTUR
function initFolders(){

    if(!fs.existsSync("ads")){
        fs.mkdirSync("ads");
    }

    categories.forEach(cat=>{
        let path = `ads/${cat}.json`;

        if(!fs.existsSync(path)){
            fs.writeFileSync(path, "[]");
        }
    });

    console.log("✅ Tüm kategori dosyaları hazır");
}

initFolders();

// 📥 DOSYA OKU
function loadCategory(cat){
    let path = `ads/${cat}.json`;

    if(!fs.existsSync(path)){
        fs.writeFileSync(path, "[]");
    }

    return JSON.parse(fs.readFileSync(path));
}

// 💾 DOSYA YAZ
function saveCategory(cat, data){
    fs.writeFileSync(`ads/${cat}.json`, JSON.stringify(data, null, 2));
}

// 💰 FİYAT HESAP
function calculatePrice(category, duration){

    let base = 170;

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
        muzik: 2,
        spor: 2
    };

    let price = base * (multipliers[category] || 1);

    if(duration === "haftalik") price *= 4;
    if(duration === "aylik") price *= 30;

    return Math.round(price);
}

// 📥 REKLAM EKLE
app.post("/add", (req, res) => {

    let cat = req.body.category;

    let price = calculatePrice(cat, req.body.duration);

    let ads = loadCategory(cat);

    let newAd = {
        id: Date.now(),
        title: req.body.title,
        category: cat,
        videoUrl: req.body.videoUrl,
        duration: req.body.duration,
        price: price,
        createdAt: new Date()
    };

    ads.push(newAd);

    saveCategory(cat, ads);

    res.json({
        message: "✔ Reklam eklendi",
        ad: newAd
    });
});

// 📤 TÜM REKLAMLAR
app.get("/ads", (req, res) => {

    let all = [];

    categories.forEach(cat=>{
        let data = loadCategory(cat);
        all = all.concat(data);
    });

    res.json(all);
});

// 📂 KATEGORİYE GÖRE
app.get("/ads/:category", (req, res) => {
    let data = loadCategory(req.params.category);
    res.json(data);
});

// 📊 KATEGORİ LİSTESİ
app.get("/categories", (req, res) => {
    res.json(categories);
});

// 🚀 SERVER START
app.listen(3000, () => {
    console.log("🔥 DİJİTAL REKLAM TV PRO SERVER AKTİF");
});
