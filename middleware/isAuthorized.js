const User = require("./../models/User.js");

module.exports = async function isAuthorized(req, res, next) {
    let head = req.headers['authorization'];
    let user = await User.findOne({ tocken: head });
    if (user) {
        req.user = user;
        return next();
    }
    res.status(401).send("Wrong tocken");
}
