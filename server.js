const express = require('express');
const fs = require('fs');

//APP SETUP
const serverPort = 3000;
const app = express();
const server = app.listen(serverPort, () => {
	console.log("Server started on port " + serverPort)
});
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.static('build'));

app.get("/history", (req, res) => {
    fs.readFile('./history.json', 'utf8', (err, data) => {    
        res.set('Content-Type', 'application/json');
        res.send(data)
    })
})

app.get("/update", (req, res) => {
    fs.readFile('./update.json', 'utf8', (err, data) => {    
        res.set('Content-Type', 'application/json');
        res.send(data)
    })
})

