const user = require('../services/user.service')

async function login(req, res, next){
    try {
        console.log(req.body)
        let result = await user.checkUserCredential(req.body.id, req.body.password)
        res.json(result)
    } catch (error) {
        error.statusCode = 401
        console.error(`[Error] error while login :`, error.message)
        next(error)
    }
}

async function register(req, res, next){

}

async function testing(req, res, next){
    try {
        res.json(req.user)
    } catch (error) {
        console.error(`[Error] error while login :`, error.message)
        next(error)
    }
}

module.exports = {
    login,
    register,
    testing
}