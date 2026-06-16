const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "bank"
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected...");
});

// BLOOD TYPES
app.get("/blood-types", (req, res) => {
    db.query("SELECT * FROM blood_type", (err, result) => {
        if (err) return res.send("Error ❌");
        res.json(result);
    });
});

// ADD DONOR
app.post("/add-donor", (req, res) => {
    const { name, contact_number, blood_group } = req.body;

    db.query(
        "INSERT INTO donor (name, contact_number, blood_group) VALUES (?, ?, ?)",
        [name, contact_number, blood_group],
        (err) => {
            if (err) return res.send("Error ❌");
            res.send("Donor added ✅");
        }
    );
});

// GET DONORS
app.get("/donors", (req, res) => {
    db.query("SELECT * FROM donor", (err, result) => {
        if (err) return res.send("Error ❌");
        res.json(result);
    });
});

// ADD RECIPIENT
app.post("/add-recipient", (req, res) => {
    const { name, contact_number, blood_group } = req.body;

    db.query(
        "INSERT INTO recipient (name, contact_number, blood_group) VALUES (?, ?, ?)",
        [name, contact_number, blood_group],
        (err) => {
            if (err) return res.send("Error ❌");
            res.send("Recipient added ✅");
        }
    );
});

// GET RECIPIENTS
app.get("/recipients", (req, res) => {
    db.query("SELECT * FROM recipient", (err, result) => {
        if (err) return res.send("Error ❌");
        res.json(result);
    });
});

// CHECK BLOOD
app.get("/blood/:group", (req, res) => {
    const group = req.params.group;

    const sql = `
        SELECT 
        (SELECT COUNT(*) FROM donor WHERE blood_group = ?) 
        -
        (SELECT COUNT(*) FROM recipient WHERE blood_group = ?) 
        AS units
    `;

    db.query(sql, [group, group], (err, result) => {
        if (err) return res.send("Error ❌");

        let units = result[0].units;
        if (units < 0) units = 0;

        res.json({ units });
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000 🚀");
});