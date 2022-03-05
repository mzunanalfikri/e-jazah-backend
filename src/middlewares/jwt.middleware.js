const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// get config vars
dotenv.config();

function authenticateAdmin(req, res, next ){

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null){
        res.sendStatus(401)
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {

        if (err){
            res.sendStatus(403)
        }

        if (user.role != "admin"){
            res.sendStatus(403)
        }
        req.user = user

        next()
    } )
}

function authenticateStudent(req, res, next ){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null){
        res.sendStatus(401)
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {

        if (err){
            res.sendStatus(403)
        }

        if (user.role != "student"){
            res.sendStatus(403)
        }
        req.user = user

        next()
    } )
}

function authenticateInstitution(req, res, next ){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null){
        res.sendStatus(401)
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err){
            res.sendStatus(403)
        }

        if (user.role != "institution"){
            res.sendStatus(403)
        }
        req.user = user

        next()
    } )
}

module.exports = {
    authenticateAdmin,
    authenticateInstitution,
    authenticateStudent
}