const user = require('../services/user.service')
const fs = require('fs')
const { parse } = require('csv-parse')
const { readCsv } = require('../utils/readcsv.util')

async function login(req, res, next){
    try {
        let result = await user.checkUserCredential(req.body.id, req.body.password)
        res.json(result)
    } catch (error) {
        error.statusCode = 401
        console.error(`[Error] error while login :`, error.message)
        next(error)
    }
}

async function registerInstitution(req, res, next){
    try {
        const file = req.file
    
        let csvFile = await readCsv(file.path)
        let response = []
        
        for (let i = 1; i < csvFile.length; i++) {
            const el = csvFile[i];
            let result = {}
            if (el.length != 5){
                response.push({
                    "message" : "Not sufficient row",
                    "detail" : "CSV must contain email, name, level, city, province"
                })
                continue
            }
            try {
                result = await user.registerInstitution(req.user.userId, el[0], el[1], el[2], el[3], el[4])
            } catch (error) {
                response.push({
                    "message" : "error when input",
                    "detail" : error.toString()
                })
                continue
            }
            response.push(result)
        }
        res.send(response)
    } catch (error) {
        res.send({
            message : "error when parsing",
            ...error
        })
    }
}

async function registerStudent(req, res, next){
    try {
        const file = req.file
    
        let csvFile = await readCsv(file.path)
        let response = []
        
        for (let i = 1; i < csvFile.length; i++) {
            const el = csvFile[i];
            let result = {}
            if (el.length != 4){
                response.push({
                    "message" : "Not sufficient row",
                    "detail" : "CSV must contain nik, name, birthdate, birthPlace"
                })
                continue
            }
            try {
                result = await user.registerStudent(req.user.userId, el[0], el[1], el[2], el[3])
            } catch (error) {
                response.push({
                    "message" : "error when input",
                    "detail" : error.toString()
                })
                continue
            }
            response.push(result)
        }
        res.send(response)
    } catch (error) {
        res.send({
            message : "error when parsing",
            ...error
        })
    }
}

async function getUserProfile(req, res, next){
    try {
        let id = req.user.userId.toString()
        let userDetail = await user.getUserProfile(id)
        res.send(userDetail)
    } catch (error) {
        next(error)
    }
}

async function changePassword(req, res, next){
    try {
        let password = req.body.password
        let id = req.user.userId.toString()
        if (password == undefined){
            res.statusCode = 402
            res.send({
                message: "must contain password param"
            })
        }
        let result = await user.changeUserPassword(id, password)
        res.send(result)
    } catch (error) {
        next(error)
    }
}

async function dummy(req, res, next){
    res.json("dummy")
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
    registerInstitution,
    registerStudent,
    getUserProfile,
    changePassword,
    testing,
    dummy
}