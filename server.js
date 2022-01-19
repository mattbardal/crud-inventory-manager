const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const db = require('./database.js');
const fs = require('fs');
const bodyParser = require('body-parser');
const converter = require('json-2-csv');

const server = http.createServer(app);
const port = process.env.PORT || 3000;

// The root endpoint 
app.use('/', express.static(path.join(__dirname, 'public')));

// For static file hosting (i.e, inventory.csv)
if (!fs.existsSync('data')){
    fs.mkdirSync('data');
}
app.use('/static', express.static(path.join(__dirname, 'data')));

// BodyParser setup for handling incoming requests bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* /api/items
 *
 * Queries database and returns all rows in a JSON form.
 */
app.get('/api/items', (req, res) => {
    let sql = 'SELECT * FROM item';

    db.all(sql, (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
        }
        res.json({
            "message":"success", 
            "data": rows
        });
    });
});

/* /api/items/:id
 *
 * Queries database finds a row for a specific ID 
 * and returns in a JSON form.
 */
app.get('/api/item/:id', (req, res) => {
    let sql = 'SELECT * FROM item WHERE id = ?';
    
    db.each(sql, req.params.id, (err, row) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "entry": row
        });
    });
});

/* /api/item/name/:name
 *
 * Queries database for all rows
 * and returns in a JSON form rows that match :name.
 */
app.get('/api/item/name/:name', (req, res) => {
    let sql = 'SELECT * FROM item';

    db.all(sql, (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }

        const matches = rows.filter(row => row.name.includes(req.params.name));
        if(matches.length > 0) {
            res.json({
                "message":"success", 
                "data": matches
            });
        } else {
            res.json({
                "message":"No matches found."
            }); 
        }
    });  
});

/* /api/csv
 *
 * Queries database for all rows and returns in a JSON form. 
 * 
 * Once in JSON form, it uses json2csv to create a csv file of the database entries
 * and responds to the user with the csv file to download.
 */
app.get('/api/csv', (req, res) => {
    let sql = 'SELECT * FROM item';

    db.all(sql, (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
        }

        converter.json2csv(rows, (err, csv) => {
            if (err) {
                throw err;
            }
            fs.writeFileSync('data/inventory.csv', csv); // write CSV to a file
        });

        res.redirect('/static/inventory.csv');
    });
});


/* /api/item/add
 *
 * Handles POST requests to add new items to the database.
 */
app.post('/api/item/add', (req, res) => {
    let errors = [];

    if(!req.body.name) {
        errors.push("No item name.");
    }

    if(!req.body.desc) {
        errors.push("No item description.");
    }

    if(!req.body.unit_price) {
        errors.push("No item price.");
    }

    if(!req.body.qty) {
        errors.push("No item quantity.");
    }

    if(errors.length > 0) {
        res.status(400).json({"error": errors.join(',')});
        return;
    }

    const entry = {
        name: req.body.name,
        desc: req.body.desc,
        unit_price: req.body.unit_price,
        qty: req.body.qty
    }

    let sql = 'INSERT INTO item (name, desc, unit_price, qty) VALUES (?, ?, ?, ?)';
    let parameters = [entry.name, entry.desc, entry.unit_price, entry.qty];

    db.run(sql, parameters, (err, result) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }

        res.json({
            "message": "New entry added successfully.",
            "entry_details": entry
        });
    });
});

/* /api/item/update/:id
 *
 * Handles PATCH requests to update previously added items
 * in the database.
 */
app.patch('/api/item/update/:id', (req, res) => {
    const updated_entry = {
        name: req.body.name,
        desc: req.body.desc,
        unit_price: req.body.unit_price,
        qty: req.body.qty
    }

    db.run('UPDATE item SET name = ?, desc = ?, unit_price = ?, qty = ? WHERE id = ?',
        [updated_entry.name, updated_entry.desc, updated_entry.unit_price, updated_entry.qty, req.params.id],
        (err, result) => {
            if(err) {
                res.status(400).json({"error": res.message});
            } else {
                res.json({
                    "message": "Item successfully updated in the database.",
                    "entry_details": updated_entry
                });
            }
        }
    );
});

/* /api/item/delete/:id
 *
 * Handles DELETE requests to remove previously added items
 * from the database.
 */
app.delete('/api/item/delete/:id', (req, res) => {
    db.run('DELETE FROM item WHERE id = ?', req.params.id, 
        (err, result) => {
            if(err) {
                res.status(400).json({"error": res.message});   
            } else {
                res.json({"message": "Item successfully removed from database."});
            }
        }
    );
});


server.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});