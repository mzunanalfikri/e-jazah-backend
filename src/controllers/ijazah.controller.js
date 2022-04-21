const ijazah = require('../services/ijazah.service')
const user = require('../services/user.service')
const { readCsv } = require('../utils/readcsv.util')
const stringify = require('json-stringify-deterministic')
const sortKey = require('sort-keys-recursive')

async function dummy(req, res, next){
    res.json('testing')
}

async function setIjazahLink(req, res, next){
    try {
        let id = req.user.userId.toString()
        let result = await ijazah.changeUserLink(id)
        res.send(result)
    } catch (error) {
        next(error)
    }
}

async function createIjazah(req, res, next){
    try {
        let id = req.user.userId.toString()
        let userObj = await user.getUserProfile(id)
        let file = req.file
        let csvFile = await readCsv(file.path)
        let response = {}
        if (userObj.Level == "PT"){
            console.log("PT")
            response = await ijazah.createIjazahPT(id, csvFile)
        } else {
            console.log("Lower ED")
            response = await ijazah.createIjazahLowerEd(id, csvFile)
        }
        res.send(response)
    } catch (error) {
        next(error)
    }
}

async function getIjazahByUserCheckLink(req, res, next){
    try {
        let id = req.params.nik.toString()
        console.log("ID check link :", id)
        let response = await ijazah.getIjazahByUserCheckLink(id)
        res.send(response)
    } catch (error) {
        next(error)
    }
}

async function getIjazahByUser(req, res, next){
    try {
        let id = req.user.userId.toString()
        console.log("ID :", id)
        let response = await ijazah.getIjazahByUser(id)
        res.send(response)
    } catch (error) {
        next(error)
    }
}

async function verifyIjazahById(req, res,next){
    try {
        let ijazahId = req.body.ijazahId
        let response = await ijazah.verifyIjazahById(ijazahId)
        res.send(response)
    } catch (error) {
        next(error)
    }
}

async function getAllIjazah(req, res, next){
    try {
        let response = await ijazah.getAllIjazah()
        res.send(response)
    } catch (error) {
        next(error)
    }
}


async function getIjazahByInstitution(req, res, next){
    try {
        let id = req.user.userId.toString()
        let response = await ijazah.getIjazahByInstitution(id)
        console.log(response)
        res.send(response)
    } catch (error) {
        next(error)
    }
}

async function verifyIjazahContent(req, res, next){
    try {
        let content = req.body
        delete content.Signature
        delete content.InstitutionEmail
        delete content.docType
        let id = req.body.ID.toString()
        let response = await ijazah.verifyIjazahContent(id, stringify(sortKey(content)))
        res.send(response)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    dummy,
    setIjazahLink,
    createIjazah,
    getIjazahByUserCheckLink,
    verifyIjazahById,
    getAllIjazah,
    getIjazahByInstitution,
    verifyIjazahContent,
    getIjazahByUser
}