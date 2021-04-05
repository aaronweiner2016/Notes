
const express = require('express');
const path = require('path');
const fs = require("fs");
const util = require("util");
const app = express();
const PORT = 8080;
const asyncReadFile = util.promisify(fs.readFile);

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
const notesArr = [];
app.post('/api/notes', (req, res) => {

    const newPerson = req.body;
    console.log(newPerson);
    notesArr.push(newPerson);

    res.json(newPerson);
});

app.delete('/api/notes/:id', (req, res) => {

    const chosen = req.params.id;

    // console.log(chosen);


    // for (let i = 0; i < current.length; i++) {
    //     if (chosen === current[i].routeName) {
    //         return res.json(current[i]);
    //     }
    // }

    // return res.json(false);
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
