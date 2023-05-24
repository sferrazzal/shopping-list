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
                const itemsResult = await db.query("SELECT name FROM items WHERE LOWER(name) LIKE LOWER(($1))", [searchString + "%"]);
                res.status(200).json({
                    status: "success",
                    count: itemsResult.rows.length,
                    data: {
                        items: itemsResult.rows
                    }
                });
            } catch (e) {
                errorResponse(e, res);
            }
        }
    } else {
        try {
            const itemsResult = await db.query("SELECT id, name FROM items");
            const itemIdsArray = itemsResult.rows.map(x => x.id);
            const tagsResult = await db.query("SELECT item_id, tag_text FROM items_tags WHERE item_id = ANY ($1)", [itemIdsArray]);
            appendTagsToItems(itemsResult.rows, tagsResult.rows);
            res.status(200).json({
                status: "success",
                count: itemsResult.rows.length,
                data: {
                    items: itemsResult.rows
                }
            });
        } catch (e) {
            errorResponse(e, res);
        }
    }
});

const appendTagsToItems = (items, tags) => {
    for (const item of items) {
        item.tags = [];
        for (const tag of tags) {
            if (tag.item_id === item.id) {
                item.tags.push(tag.tag_text);
            }
        }
    }
}


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
                errorResponse(e);
            }
        } else {
            errorResponse(e, res);
        }
    }
});

// DELETE a set of items by id
app.post("/api/v1/items:deleteByIds", async(req, res) => {
    const error = await db.tx(async (client) => {
        for (const itemId of req.body.itemIds) {
            await client.query('DELETE FROM items WHERE id=$1', [itemId]);
        }
    });
    if (error) {
        errorResponse(e, res);
    } else {
        res.sendStatus(204);
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
        errorResponse(e, res);
    }
});

// GET info for a given list
app.get("/api/v1/lists/:listId", async(req, res) => {
    try {
        const title = await getTitleForList(req.params.listId);
        const recipes = await getRecipesForList(req.params.listId);
        const items = await getItemsInList(req.params.listId);
        const tags = await getTagsForItems(items);
        appendTagsToItems(items, tags);

        res.status(200).json({
            status: "success",
            itemCount: items.length,
            recipeCount: recipes.length,
            data: {
                title,
                items,
                recipes
            }
        })
    } catch (e) {
        errorResponse(e, res);
    }
});

const getTitleForList = async(listId) => {
    const listTitleResult = await db.query('SELECT title FROM lists WHERE id = $1', [listId]);
    return listTitleResult.rows[0].title;
}

const getItemsInList = async (listId) => {
    const results = await db.query(
        'SELECT item_id AS id, name, quantity FROM lists_items JOIN items ON items.id = lists_items.item_id WHERE lists_items.list_id = $1;',
        [listId]
    );

    return results.rows;
}

const getTagsForItems = async(items) => {
    const itemIdsArray = items.map(x => x.id);
    const tagsResult = await db.query("SELECT item_id, tag_text FROM items_tags WHERE item_id = ANY ($1)", [itemIdsArray]);
    return tagsResult.rows;
}

const getRecipesForList = async(listId) => {
    const client = await db.getClient();
    const recipeIdResults = await(db.query("SELECT recipe_id FROM lists_recipes WHERE list_id=$1", [listId]));
    const recipes = [];
    for (const row of recipeIdResults.rows) {
        const recipe = await getRecipe(client, row.recipe_id);
        recipes.push(recipe);
    }
    client.release();
    
    return recipes;
}

// Operations to add or modify list contents
app.post("/api/v1/lists/:listId", async(req, res) => {
    if (isAddItemRequest(req)) {
        await addItem(req, res);
        return;
    } else if (isAddRecipeRequest(req)) {
        await addRecipeToList(req, res);
        return;
    } else if (isRemoveRecipeRequest(req)) {
        await removeRecipeFromList(req, res);
        return;
    } else {
        errorResponse(getInvalidRequestError(req), res)
    }
});


const isAddItemRequest = (req) => {
    if (req.body.itemId) return true;
    return false;
}

const addItem = async (req, res) => {
    try {
        const result = await db.query(
            'INSERT INTO lists_items (list_id, item_id, quantity) VALUES ($1, $2, 1)',
            [req.params.listId, req.body.itemId]
        );
        res.status(201).json({
            status: "success"
        });
    } catch (e) {
        // TODO: Replace this with conditional sql
        // Return failure message upon duplicate entry attempt
        if (e.code === '23505') {
            try {
                const existingItemResult = await db.query('SELECT id FROM items WHERE name=$1', [req.body.newItemName]);
                res.status(200).json({
                    status: "failure",
                    failureReason: "Item already in list"
                });
            } catch (e) {
                errorResponse(e, res);
            }
        } else {
            errorResponse(e, res);
        }
    }
}

const isAddRecipeRequest = (req) => {
    return (req.query.recipeOp === "add");
}

const addRecipeToList = async (req, res) => {
    const recipeAlreadyInList = await isRecipeInList(req.body.recipeId, req.params.listId);
    if (recipeAlreadyInList) {
        res.status(200).json({
            status: 'success',
            addedRecipe: null
        });
        return;
    }

    let addedRecipe = {};
    const error = await db.tx(async (client) => {
        addedRecipe = await addRecipe(client, req.params.listId, req.body.recipeId);
    });
    if (error) {
        errorResponse(error);
    } else {
        res.status(200).json({
            status: 'success',
            addedRecipe
        });
    }
}

const isRemoveRecipeRequest = (req) => {
    return (req.query.recipeOp === "remove");
}

const removeRecipeFromList = async (req, res) => {
    await failIfRecipeNotInList(req, res);
    await removeRecipe(req, res);
}

const failIfRecipeNotInList = async (req, res) => {
    const recipeInList = await isRecipeInList(req.body.recipeId, req.params.listId);
    if (!recipeInList) {
        errorResponse(getRecipeNotInListError(req), res);
    }
}

const removeRecipe = async(req, res) => {
    const error = await db.tx(async () => {
        await unlinkRecipeFromList(req.params.listId, req.body.recipeId);
        await removeItemsInRecipeFromList(req.params.listId, req.body.recipeId);
        res.status(200).json({ status: "success" });
    });

    if (error) {
        errorResponse(error, res);
    }
}

const unlinkRecipeFromList = async (listId, recipeId) => {
    await db.query("DELETE FROM lists_recipes WHERE list_id=$1 AND recipe_id=$2", [listId, recipeId]);
}

const removeItemsInRecipeFromList = async(listId, recipeId) => {
    const itemsToRemove = await getItemsInRecipe(recipeId);
    for (const item of itemsToRemove) {
        if (await removalQuantityExceedsListQuantity(item, listId)) {
            await removeItemFromList(item.id, listId);
        } else {
            await updateListQuantity(item.id, item.quantity);
        }
    }
}

const removalQuantityExceedsListQuantity = async (removalItem, listId) => {
    const itemListQuantity = await getItemListQuantity(removalItem.id, listId);
    return removalItem.quantity > itemListQuantity;
}

const getItemListQuantity = async(itemId, listId) => {
    const result = await db.query("SELECT quantity FROM lists_items WHERE item_id=$1 AND list_id=$2", [itemId, listId]);
    return result.rows[0].quantity;
}

const removeItemFromList = async (itemId, listId) => {
    await db.query("DELETE from lists_items WHERE item_id=$1 AND list_id=$2", [itemId, listId])
}

const updateListQuantity = async(itemId, quantity) => {
    await db.query("UPDATE lists_items SET quantity=$1 WHERE item_id=$2", [quantity, itemId])
}

function getInvalidRequestError(req) {
    const invalidRequestError = new Error("Invalid request");
    invalidRequestError.request = req;
    return invalidRequestError;
}

function getRecipeNotInListError(req) {
    const recipeNotInListError = new Error("Recipe not found in list");
    recipeNotInListError.recipeId = req.body.recipeId;
    recipeNotInListError.listId = req.params.listId;
    return recipeNotInListError;
}

const isRecipeInList = async (recipeId, listId) => {
    const existingEntriesResult = await db.query("SELECT 1 from lists_recipes WHERE recipe_id=$1 AND list_id=$2", [recipeId, listId]);
    if (existingEntriesResult.rowCount > 0) return true;
    return false;
}

const addRecipe = async (client, listId, recipeId) => {
    await (linkListToRecipe(client, listId, recipeId));
    const recipe = await getRecipe(client, recipeId);
    for (const item of recipe.items) {
        await addItemOrUpdateListQuantity(client, listId, item.id, item.quantity);
    }
    return recipe;
}

const linkListToRecipe = async(client, listId, recipeId) => {
    await client.query('INSERT INTO lists_recipes(list_id, recipe_id) VALUES($1, $2)', [listId, recipeId]);
}

const getRecipe = async (client, recipeId) => {
    const items = await getItemsInRecipe(recipeId);
    const title = await getRecipeTitleFor(recipeId, client);

    return {
        id: recipeId,
        title,
        items
    }
}

const getItemsInRecipe = async (recipeId) => {
    const client = await db.getClient();
    const itemDetailsResult = await client.query('SELECT item_id AS "id", quantity FROM recipes_items WHERE recipe_id=$1', [recipeId]);

    for (const item of itemDetailsResult.rows) {
        const itemNameResult = await client.query("SELECT name FROM items WHERE id=($1)", [item.id]);
        item.name = itemNameResult.rows[0].name;
    }

    client.release();
    return itemDetailsResult.rows;
}

const getRecipeTitleFor = async (recipeId, client) => {
    const recipeNameResult = await (client.query('SELECT title FROM recipes WHERE id=$1', [recipeId]));
    return recipeNameResult.rows[0].title;
}

const addItemOrUpdateListQuantity = async (client, listId, itemId, quantity) => {
    await client.query(
        `INSERT INTO lists_items (list_id, item_id, quantity) 
        VALUES ($1, $2, 1) 
        ON CONFLICT ON CONSTRAINT lists_items_pkey 
        DO UPDATE SET quantity = lists_items.quantity + $3
        RETURNING item_id, quantity`,
        [listId, itemId, quantity]
    );
}

// PATCH items in a given list
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
        errorResponse(e, res);
    }
});

// GET recipes
app.get("/api/v1/recipes", async(req, res) => {
    if (req.query.title) {
        const [op, searchString] = req.query.title.split(".");
        if (op === "sw") {
            try {
                const recipesResult = await db.query("SELECT title, id FROM recipes WHERE LOWER(title) LIKE LOWER(($1))", [searchString.toLowerCase() + "%"]);
                res.status(200).json({
                    status: "success",
                    count: recipesResult.rows.length,
                    data: {
                        recipes: recipesResult.rows
                    }
                });
            } catch (e) {
                errorResponse(e, res);
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
            errorResponse(e, res);
        }
    }
});

// GET info for a given recipe
app.get("/api/v1/recipes/:recipeId", async(req, res) => {
    try {
        const recipeItems = await db.query(
            `SELECT item_id AS id, name, quantity
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
        errorResponse(e, res);
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
        errorResponse(e, res);
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
                // TODO Replace with sql
                // Increment duplicate count upon duplicate entry attempt
                if (e.code === '23505') {
                    duplicateCount++;
                } else {
                    throw(e);
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
        errorResponse(e, res);
    }
});

// DELETE a tag
app.post('/api/v1/tags:delete', async(req, res) => {
    let deletedTagCount = 0;
    const error = await db.tx(async (client) => {
        for (const itemId of req.body.itemIds) {
            const result = await client.query('DELETE FROM items_tags WHERE item_id = $1 AND tag_text = $2', [itemId, req.body.tagName]);
            deletedTagCount += result.rowCount;
        }
    });
    if (error) {
        errorResponse(error);
    } else {
        res.status(200).json({
            status: 'success',
            deletedTagCount
        });
    }
});

const errorResponse = (error, res) => {
    console.log(error);
    res.sendStatus(500);
}

app.listen(PORT, () => {console.log(`Server is up and listening on port ${PORT}`)});