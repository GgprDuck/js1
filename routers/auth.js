const express = require('express');
const isAuthorized = require('../middleware/isAuthorized.js');
const router = express.Router();
const User = require("./../models/User.js");


router.get("/posts", async (req, res) => {
	const users = await User.find();
	res.send(users);
});


function generateTocken() {
    const text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

router.post("/sign-up", async (req,res) =>{
    const user = new User({
        login:req.query.login,
        password: req.query.password,
        tocken: "",
        averageRating: "",
    });
    await user.save();
    res.status(201).send(user);
});


router.post("/sign-in",async function(req,res){
    const tocken = generateTocken();
    const user = await User.findOne({ login: req.query.login , password: req.query.password });
    if (user) {
        user.tocken = tocken;
        await user.save();
        return res.status(201).send(user.tocken);
    }
    res.status(401).send("Login failed"); 
});

 router.post("/logout",isAuthorized, async(req,res) =>{
    const head = req.headers['authorization'];
    try {
		const post = await User.findOne({ tocken: head });
		if (post) {
			post.tocken = "";
		}
		await post.save()
		res.send(post)
	} catch {
		res.status(404);
		res.send({ error: "Post doesn't exist!" })
	}
 });

module.exports = router;