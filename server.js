
const express = require('express');
const path = require('path');
const fs = require("fs");
const util = require("util");
const app = express();
const PORT = 8080;
const asyncReadFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const { v4: uuidv4 } = require('uuid');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));


app.get("/api/notes", (req, res) => {
    asyncReadFile("./db/db.json", "utf8").then((result) => {
        const parsedNotes = JSON.parse(result)
        res.json(parsedNotes)
    });
})

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4();
    console.log(newNote);
    asyncReadFile("./db/db.json", "utf8").then((result) => {
        const parsedNotes = JSON.parse(result)
        parsedNotes.push(newNote);
        writeFile("./db/db.json", JSON.stringify(parsedNotes, null, "\t")).then(() => {
            res.json(parsedNotes);
        })
    });

});

app.delete('/api/notes/:id', (req, res) => {

    const chosen = req.params.id;
    console.log(res);
    console.log(chosen);

    asyncReadFile("./db/db.json", "utf8").then((result) => {
        const parsedNotes = JSON.parse(result)
        const filteredNotes = parsedNotes.filter(val => val.id !== chosen);
        writeFile("./db/db.json", JSON.stringify(filteredNotes, null, "\t")).then(() => {
            res.json(filteredNotes);
        })
    });

});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
