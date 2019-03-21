module.exports = function(req, res, next) {
    console.log('USER: ',req.user);
    if (!req.user.isAdmin) return res.status(403).send('Access denied.'); //403 Forbidden

    next();
}