const jwt = require("jsonwebtoken")
const { JWT_SECRET }= require("../config")

function authMiddleware (req, res, next) {
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        res.status(403).json({
            message: "Invalid/Missing Token"
        })
    }

    const token = authHeader.split(" ")[1]

    try{
        const decodedToken = jwt.verify(token, JWT_SECRET)

        req.userId = decodedToken.userId

        next()
    } catch(err){
        return res.status(403).json({
            message: "Invalid Token"
        })
    }
}

module.exports = {
    authMiddleware
}