const { Chaincode } = require('../configs/fabric.config')
const jwt = require('jsonwebtoken')
const dotenv =require('dotenv')
dotenv.config()

async function checkUserCredential(userId, password){
    let contract = await Chaincode.getContract()

    let result = await contract.evaluateTransaction("CheckUserCredential", userId, password)
    let resultObject = JSON.parse(result.toString())

    let accessToken = jwt.sign({
        userId : resultObject.ID,
        role : resultObject.Role
    }, process.env.TOKEN_SECRET, {expiresIn:'10000s'})

    return {
        token : accessToken
    }
}

async function registerInstitution(){

}

async function registerUser(){

}

module.exports = {
    checkUserCredential,
    registerInstitution,
    registerUser
}