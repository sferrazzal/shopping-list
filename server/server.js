require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());

//GET all items
app.get("/api/v1/items", async(req, res) => {
    try {
        const itemsResult = await db.query("SELECT * FROM items");
        const itemIdsArray = itemsResult.rows.map(x => x.id);
        const tagsResult = await db.query("SELECT item_id, tag_text FROM items_tags WHERE item_id = ANY ($1)", [itemIdsArray]);
        appendTagsToItems(itemsResult, tagsResult);
        res.status(200).json({
            status: "success",
            count: itemsResult.rows.length,
            data: {
                items: itemsResult.rows
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
        const listItemResults = await db.query(
            'SELECT item_id AS id, name FROM lists_items JOIN items ON items.id = lists_items.item_id WHERE lists_items.list_id = $1;',
            [req.params.id]
        );
        const listName = await db.query('SELECT title FROM lists WHERE id = $1', [req.params.id]);
        const itemIdsArray = listItemResults.rows.map(x => x.id);
        const tagsResult = await db.query("SELECT item_id, tag_text FROM items_tags WHERE item_id = ANY ($1)", [itemIdsArray]);
        appendTagsToItems(listItemResults, tagsResult);
        res.status(200).json({
            status: "success",
            count: listItemResults.rows.length,
            data: {
                name: listName,
                items: listItemResults.rows
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
});

// GET all tags
app.get("/api/v1/tags", async(req, res) => {
    try {
        const result = await db.query("SELECT item_id, tag_text FROM items_tags");
        res.status(200).json({
            status: "success",
            results: result.rows.length,
            data: {
                tags: result.rows
            }
        })
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
})

//POST a new item
app.post("/api/v1/items", async(req, res) => {
    try {
        const result = await db.query("INSERT INTO items (name) VALUES ($1)", [req.body.newItemName]);
        res.status(201).json({
            status: "success"
        });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// POST a new tag
app.post("/api/v1/tags", async (req, res) => {
    try {
        const rows = [];
        db.tx(async (client) => {
            for (const itemId of req.body.itemIds) {
                const result = await client.query('INSERT INTO items_tags (item_id, tag_text) VALUES ($1, $2) RETURNING item_id, tag_text', [itemId, req.body.tagName]);
                rows.push(result.rows[0]);
            }      
        });
        res.status(201).json({
            status: 'success',
            addedRecordCount: rows.length,
            data: rows
        });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

function appendTagsToItems(itemsResult, tagsResult) {
    for (const item of itemsResult.rows) {
        item.tags = [];
        for (const tag of tagsResult.rows) {
            if (tag.item_id === item.id) {
                item.tags.push(tag.tag_text);
            }
        }
    }
}

app.listen(PORT, () => {console.log(`Server is up and listening on port ${PORT}`)});