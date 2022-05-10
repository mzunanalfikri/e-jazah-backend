const { Chaincode } = require('../configs/fabric.config')
const jwt = require('jsonwebtoken')
const pki = require('../utils/pki.util')
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
        token : accessToken,
        role : resultObject.Role,
        id : resultObject.ID
    }
}

async function registerInstitution(authUser,email, name, level, city, province){
    let contract = await Chaincode.getContract()
    const { privateKey, publicKey } = pki.generateKeyPair()

    let result = await contract.submitTransaction('CreateInstitution', authUser, email, name, level, city, province, privateKey, publicKey)
    return JSON.parse(result.toString())
}

async function registerStudent(authUser,nik, name, birthPlace, birthDate){
    let contract = await Chaincode.getContract()

    let result = await contract.submitTransaction('CreateStudent', authUser, nik, name, birthPlace, birthDate)
    return JSON.parse(result.toString())
}

async function getUserProfile(userId){
    let contract = await Chaincode.getContract()

    let result = await contract.evaluateTransaction("GetUserProfile", userId)
    return JSON.parse(result.toString())
}

async function changeUserPassword(userId, oldPassword, userPassword){
    let contract = await Chaincode.getContract()

    let result = await contract.submitTransaction('UpdateUserPassword', userId, oldPassword, userPassword)
    // return "hai hai"
    return JSON.parse(result.toString())
}

module.exports = {
    checkUserCredential,
    registerInstitution,
    registerStudent,
    getUserProfile,
    changeUserPassword
}