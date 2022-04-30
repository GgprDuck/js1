const express = require('express');
const router = express.Router();
let books = require('../books.js');
const isAuthorized = require('./../middleware/isAuthorized.js');
const Book = require("./../models/modelBook.js");
const { populate, update } = require('./../models/User.js');
const User = require('./../models/User.js');
const Category = require('./../models/category.js')



router.use(isAuthorized);

class Message{
    constructor(date,comment,id,author) {
        this.date = date;
        this.comment = comment;
        this.id = id;
        this.author = author;
    }
};

router.get("/all", async (req, res) => {
    const books = await Book.find();
    res.send(books);
})

router.get("/", async function (req, res) {
    if (req.query.authorId == undefined) {
        return res.status(200).send(books);
    }
    if (req.query.users == true) {
        let book = books.find(populate(req.query.authorId));
        res.status(200).send(book);
    }
    let book = await Book.find({ authorId: req.query.authorId });
    res.status(200).send(book);
});


router.post("/", async (req, res) => {
    let num = 0;
    let count = 0;
    const user = await User.findOne({ id: req.query.authorId });
    if (user) {
        const book = new Book({
            title: req.query.title,
            authorId: req.query.authorId,
            rate: req.query.rate,
        });
        await book.save();
        let avg = await Book.aggregate([{ $match: { $expr: { '$avg': '$rate' } } }]);
        avg.forEach(element => {
            num = element.rate + num;
            count++;
            num = num / count;
        });
        user.averageRating = num;
        await user.save();
        return res.status(200).send(book);
    }
    if (!user) {
        return res.status(404).send("User not found");
    }
});

router.post("/:id/comments", async (req, res) => {
    const book = await Book.findOne({ _id: req.params.id });
    const head = req.headers['authorization'];
    const user = await User.findOne({ tocken: head });
    if (!user) {
        return res.status(404).send("User not found");
    }
    if(!book){
        return res.status(404).send("Book not found");
    }
    console.log(user.id);
    let message = new Message(
        date = new Date(),
        req.query.text, 
        book._id,
        user.id,
    );
    book.coments[book.coments.length] = message;
    await book.save();
    return res.status(200).send(message); 
});

router.get("/:id/comments", async(req,res) =>{
    const book = await Book.findOne({ _id: req.params.id });
    let comment = [];
    book.coments.forEach((el,i)=>{
        comment[i] = el; 
        return comment;
    });
    res.status(200).send(comment);
});

router.post("/category" , async(req,res)=>{
    const category = new Category({
        category: req.query.category,
    });
    await category.save();
    res.status(201).send(category);
});

router.get("/category", async(req,res) =>{
    const category = await Category.find();
    console.log(category);
    res.status(200).send(category);
});

module.exports = router;