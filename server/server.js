require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());

//GET all items
app.get("/api/v1/items", async(req, res) => {
    try {
        const result = await db.query("SELECT * FROM items");
        console.log(result);
        res.status(200).json({
            status: "success",
            items: result.rows.length,
            data: {
                items: result.rows
            }
        });
    } catch (e) {
        console.log(e);
    }
})

app.listen(PORT, () => {console.log(`Server is up and listening on port ${PORT}`)});