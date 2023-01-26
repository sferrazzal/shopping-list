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
        res.status(200).json({
            status: "success",
            count: result.rows.length,
            data: {
                items: result.rows
            }
        });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

//GET all lists
app.get("/api/v1/lists", async(req, res) => {
    try {
        const result = await db.query("SELECT * FROM lists");
        res.status(200).json({
            status: "success",
            count: result.rows.length,
            data: {
                lists: result.rows
            }
        });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

//GET info for a given list
app.get("/api/v1/lists/:id", async(req, res) => {
    try {
        const list_items = await db.query(
            'SELECT item_id AS id, name FROM lists_items JOIN items ON items.id = lists_items.item_id WHERE lists_items.list_id = $1;',
            [req.params.id]
        );
        const list_name = await db.query('SELECT title FROM lists WHERE id = $1', [req.params.id]);
        res.status(200).json({
            status: "success",
            count: list_items.rows.length,
            data: {
                name: list_name,
                items: list_items.rows
            }
        })
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

//GET all recipes
app.get("/api/v1/recipes", async(req, res) => {
    try {
        const recipes = await db.query("SELECT id, title FROM recipes");
        res.status(200).json({
            status: "success",
            count: recipes.rows.length,
            data: {
                recipes: recipes.rows
            }
        });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

//GET info for a given recipe
app.get("/api/v1/recipes/:id", async(req, res) => {
    try {
        const recipeItems = await db.query(
            `SELECT item_id AS id, name
            FROM recipes_items
            INNER JOIN items ON items.id = recipes_items.item_id
            WHERE recipes_items.recipe_id = $1;`,
            [req.params.id]
        );
        const recipeTitle = await db.query(
            `SELECT title FROM recipes WHERE id = $1`,
            [req.params.id]
        )
        res.status(200).json({
            status: "success",
            data: {
                title: recipeTitle.rows[0].title,
                items: recipeItems.rows
            }
        })
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

app.listen(PORT, () => {console.log(`Server is up and listening on port ${PORT}`)});