require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());

// GET items
app.get("/api/v1/items", async(req, res) => {
    if (req.query.name) {
        const [op, searchString] = req.query.name.split(".");
        if (op === "sw") {
            try {
                const itemsResult = await db.query("SELECT name FROM items WHERE name LIKE ($1)", [searchString + "%"]);
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
        }
    } else {
        try {
            const itemsResult = await db.query("SELECT id, name FROM items");
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
    }
});

// POST a new item
app.post("/api/v1/items", async(req, res) => {
    try {
        const result = await db.query("INSERT INTO items (name) VALUES ($1) RETURNING name, id", [req.body.newItemName]);
        res.status(201).json({
            status: "success",
            item: result.rows[0]
        });
    } catch (e) {
        // Return existing item upon duplicate entry attempt
        if (e.code === '23505') {
            try {
                const existingItemResult = await db.query('SELECT name, id FROM items WHERE name=$1', [req.body.newItemName])
                res.status(200).json({
                    status: "success",
                    item: existingItemResult.rows[0]
                })
            } catch (e) {
                console.log(e);
                res.sendStatus(500);
            }
        } else {
            console.log(e);
            res.sendStatus(500);
        }
    }
});

// DELETE a set of items by id
app.post("/api/v1/items:deleteByIds", async(req, res) => {
    try {
        db.tx(async (client) => {
            try {
                for (const itemId of req.body.itemIds) {
                    await client.query('DELETE FROM items WHERE id=$1', [itemId]);
                }
            } catch (e) {
                console.log(e);
                res.sendStatus(500);
            }
        });
        res.sendStatus(204);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// GET all lists
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

// GET info for a given list
app.get("/api/v1/lists/:listId", async(req, res) => {
    try {
        const listItemResults = await db.query(
            'SELECT item_id AS id, name, quantity FROM lists_items JOIN items ON items.id = lists_items.item_id WHERE lists_items.list_id = $1;',
            [req.params.listId]
        );
        const listName = await db.query('SELECT title FROM lists WHERE id = $1', [req.params.listId]);
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

// POST item(s) to a list
app.post("/api/v1/lists/:listId", async(req, res) => {
    if (req.body.itemId) {
        try {
            const result = await db.query(
                'INSERT INTO lists_items (list_id, item_id, quantity) VALUES ($1, $2, 1)',
                [req.params.listId, req.body.itemId]
            );
            res.status(201).json({
                status: "success"
            })
        } catch (e) {
            // TODO: Replace this with conditional sql?
            // Return failure message upon duplicate entry attempt
            if (e.code === '23505') {
                try {
                    const existingItemResult = await db.query('SELECT id FROM items WHERE name=$1', [req.body.newItemName])
                    res.status(200).json({
                        status: "failure",
                        failureReason: "Item already in list"
                    })
                } catch (e) {
                    console.log(e);
                    res.sendStatus(500);
                }
            } else {
                console.log(e);
                res.sendStatus(500);
            }
        }
    } else if (req.body.recipeId) {
        const itemsInRecipeResult = await db.query("SELECT item_id FROM recipes_items WHERE recipe_id=$1", [req.body.recipeId]);
        try {
            const updatedItems = [];
            for (const row of itemsInRecipeResult.rows) {
                const updateListItemQuantitiesResult = await db.query(
                    `INSERT INTO lists_items (list_id, item_id, quantity) 
                    VALUES ($1, $2, 1) 
                    ON CONFLICT ON CONSTRAINT lists_items_pkey 
                    DO UPDATE SET quantity = lists_items.quantity + 1
                    RETURNING item_id, quantity`,
                    [req.params.listId, row.item_id]
                );
                updatedItems.push({
                    itemId: updateListItemQuantitiesResult.rows[0].item_id,
                    quantity: updateListItemQuantitiesResult.rows[0].quantity
                })
            }
            res.status(200).json({
                status: 'success',
                updatedItemCount: updatedItems.length,
                updatedItems: updatedItems
            });
        } catch (e) {
            console.log(e);
            res.sendStatus(500);
        }
    }
})

// PATCH info for an item in a given list
app.patch("/api/v1/lists/:listId", async(req, res) => {
    try {
        const result = await db.query(
            'UPDATE lists_items SET quantity=$1 WHERE item_id=$2 AND list_id=$3 RETURNING *',
            [req.body.quantity, req.body.itemId, req.params.listId]
        );
        res.status(200).json({
            status: "success",
            data: {
                
            }
        })
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// GET recipes
app.get("/api/v1/recipes", async(req, res) => {
    if (req.query.title) {
        const [op, searchString] = req.query.title.split(".");
        if (op === "sw") {
            try {
                const recipesResult = await db.query("SELECT title, id FROM recipes WHERE title LIKE ($1)", [searchString + "%"]);
                res.status(200).json({
                    status: "success",
                    count: recipesResult.rows.length,
                    data: {
                        recipes: recipesResult.rows
                    }
                });
            } catch (e) {
                console.log(e);
                res.sendStatus(500);
            }
        }
    } else {
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
    }
});

// GET info for a given recipe
app.get("/api/v1/recipes/:recipeId", async(req, res) => {
    try {
        const recipeItems = await db.query(
            `SELECT item_id AS id, name
            FROM recipes_items
            INNER JOIN items ON items.id = recipes_items.item_id
            WHERE recipes_items.recipe_id = $1;`,
            [req.params.recipeId]
        );
        const recipeTitle = await db.query(
            `SELECT title FROM recipes WHERE id = $1`,
            [req.params.recipeId]
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

// POST a new tag
app.post("/api/v1/tags", async (req, res) => {
    try {
        const rows = [];
        let duplicateCount = 0;
        for (const itemId of req.body.itemIds) {
            try {
                const result = await db.query('INSERT INTO items_tags (item_id, tag_text) VALUES ($1, $2) RETURNING item_id, tag_text', [itemId, req.body.tagName]);
                rows.push(result.rows[0]);
            } catch (e) {
                // Increment duplicate count upon duplicate entry attempt
                if (e.code === '23505') {
                    duplicateCount++;
                } else {
                    console.log(e);
                }
            }
        }      
        res.status(201).json({
            status: 'success',
            addedRecordCount: rows.length,
            duplicateCount: duplicateCount,
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