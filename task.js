const express = require('express');
const app = express();
const auth = require("./routers/auth");
const book = require('./routers/book.js');
const rUsers = require('./routers/rUsers.js');
const isAuthorized = require('./middleware/isAuthorized.js');
const mongoose = require("mongoose");


app.use("/auth", auth);

app.use("/books", book);

app.use("/users", rUsers);

app.get("/user", isAuthorized, function (req, res) {
    res.status(200).send(req.user);
});


mongoose 
    .connect("mongodb://localhost:27017", { useNewUrlParser: true })
    .then(() => {
        app.listen(5000, function () {
            console.log("Server is running");
        })
    })
    .catch(()=>{
        console.log("Error");
    })
