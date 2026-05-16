
const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

let ads = [];

// REKLAM EKLE
app.post("/add", (req,res)=>{
    ads.push(req.body);
    fs.writeFileSync("ads.json", JSON.stringify(ads));
    res.send("eklendi");
});

// REKLAMLARI GETİR
app.get("/ads",(req,res)=>{
    res.json(ads);
});

app.listen(3000,()=>{
    console.log("server çalışıyor");
});
