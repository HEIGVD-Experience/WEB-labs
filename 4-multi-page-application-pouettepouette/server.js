import express from 'express';
import sqlite3 from "sqlite3";

const app = express();

// Configure express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Connect to the database
const db = new sqlite3.Database("./dictons.sqlite");

// GET /
// Displays a random dicton in HTML.
// Example: <q>random dicton</q>
app.get("/", (req, res) => {
    db.get("SELECT * FROM dictons ORDER BY RANDOM() LIMIT 1", (err, row) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.send(`<q>${row.dicton}</q>`);
    });
});


// GET /list
// Displays all the dictons ordered by id in HTML
// Example: <ul><li><a href="/1">dicton 1</a></li></ul>
app.get("/list", (req, res) => {
    db.all("SELECT * FROM dictons ORDER BY id", (err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.send(`<ul>${rows.map(row => `<li><a href="/${row.id}">${row.dicton}</a></li>`).join("")}</ul>`);
    });
});


// GET /create
// Displays a HTML form for creating new dictons with POST requests.
// Example: <form method=POST><input type='text' name='dicton'></input><button>Nouveau dicton</button></form>
app.get("/create", (req, res) => {
    res.send("<form method=POST><input type='text' name='dicton'></input><button>Nouveau dicton</button></form>");
});


// POST /create
// Inserts a new dicton in the database and redirect the user to its url
// Example: 301 /list
app.post("/create", (req, res) => {
    db.run("INSERT INTO dictons (dicton) VALUES (?)", req.body.dicton, function (err) {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.redirect(301, `/${this.lastID}`);
    });
});


// GET /:id
// Returns a dicton by its id.
// Example: <q>dicton 1</q>
app.get("/:id", (req, res) => {
    db.get("SELECT * FROM dictons WHERE id = ?", req.params.id, (err, row) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        if (!row) {
            return res.status(404).send("Dicton not found");
        }
        res.send(`<q>${row.dicton}</q>`);
    });
});


export default app;