const { Chaincode } = require('../configs/fabric.config')
const stringify = require('json-stringify-deterministic')
const sortKey = require('sort-keys-recursive')

async function changeUserLink(userId){
    let contract = await Chaincode.getContract()

    let result = await contract.submitTransaction('ChangeStatusStudentIjazahLink', userId)
    return JSON.parse(result.toString())
}

async function createIjazahLowerEd(institutionId, ijazah){
    let contract = await Chaincode.getContract()
    let response = []
    for (let i = 1; i < ijazah.length; i++) {
        const el = ijazah[i];
        let nik = el[0]
        if (nik == ''){
            continue
        }
        let studNumber = el[1]
        let leadName = el[2]
        let gradDate = el[3]
        let today = getDateToday()
        let grade = {}
        for (let j = 4; j < el.length; j++) {
            const singleGrade = el[j];
            if (singleGrade != ''){
                grade[ijazah[0][j]] = singleGrade
            }
        }
        // console.log(nik, studNumber, leadName, grade)
        try {
            let res = await contract.submitTransaction('CreateIjazahLowerEducation', institutionId, nik, studNumber, gradDate, today, leadName, stringify(sortKey(grade)) )
            resObject = JSON.parse(res.toString())
            response.push({
                row : i,
                message : "Ijazah atasa nama " + resObject.StudentName + ", NIK : " + resObject.NIK + " berhasil dibuat dengan Nomor Ijazah : " + resObject.ID
            })
            // response.push(resObject)
        } catch (error) {
            let msg = error.toString().split("Error:")[2]
            response.push({
                row : i,
                message : msg,
                detail : error.toString()
            })
            // response.push(error.toString())
        }
    }
    return response
}

async function createIjazahPT(institutionId, ijazah){
    let contract = await Chaincode.getContract()
    let response = []
    if (ijazah[0].length !== 9){
        throw new Error("CSV Harus sesuai dengan format.")
    }
    for (let i = 1; i < ijazah.length; i++) {
        const el = ijazah[i];
        let nik = el[0]
        if (nik == ''){
            continue
        }
        let studNumber = el[1]
        let tingkat = el[2].toLowerCase()
        let programStudi = el[3].toLowerCase()
        let gelar = el[4].toLowerCase()
        let singkatanGelar = el[5]
        let gradDate = el[6]
        let leadName = el[7]
        let predikat = el[8].toLowerCase()
        // let IPK = el[8]
        let today = getDateToday()
        // let grade = {}
        // for (let j = 9; j < el.length; j++) {
        //     const singleGrade = el[j];
        //     let matkul = ijazah[0][j].split(";")[0]
        //     let credit = ijazah[0][j].split(";")[1]
        //     if (singleGrade != ''){
        //         grade[matkul] = {
        //             "credit" : credit,
        //             "value" : singleGrade
        //         }
        //     }
        // }
        // console.log(nik, studNumber, leadName, grade)
        try {
            let res = await contract.submitTransaction('CreateIjazahPT', institutionId, nik, studNumber, tingkat, programStudi, gelar, singkatanGelar, gradDate, today, leadName, predikat)
            resObject = JSON.parse(res.toString())
            response.push({
                row : i,
                message : "Ijazah atasa nama " + resObject.StudentName + ", NIK : " + resObject.NIK + " berhasil dibuat dengan Nomor Ijazah : " + resObject.ID
            })
            // response.push(resObject)
        } catch (error) {
            let msg = error.toString().split("Error:")[2]
            response.push({
                row : i,
                message : msg,
                detail : error.toString()
            })
            // response.push(error.toString())
        }
    }
    return response
}

async function getIjazahByUserCheckLink(id){
    let contract = await Chaincode.getContract()
    let result = await contract.evaluateTransaction('GetIjazahByUserCheckLink', id)
    return JSON.parse(result.toString())
}

async function getIjazahByUser(id){
    let contract = await Chaincode.getContract()
    let result = await contract.evaluateTransaction('GetIjazahByUser', id)
    return JSON.parse(result.toString())
}

async function verifyIjazahById(ijazahId){
    let result = {}
    try {
        let contract = await Chaincode.getContract()
        result = await contract.evaluateTransaction('VerifyIjazahById', ijazahId)
    } catch (err) {
        let msg = err.toString().split("Error:")[2]
        if (msg.includes("exist")){
            return {
                notVerified : true
            }
        } else {
            throw err
        }
    }
    return JSON.parse(result.toString())
}

async function getAllIjazah(){
    let contract = await Chaincode.getContract()
    let result = await contract.evaluateTransaction('GetAllIjazah')
    return JSON.parse(result.toString())
}

async function getIjazahByInstitution(institutionId){
    let contract = await Chaincode.getContract()
    let result = await contract.evaluateTransaction('GetIjazahByInstitution', institutionId)
    return JSON.parse(result.toString())
}

async function verifyIjazahContent(id, content){
    let contract = await Chaincode.getContract()
    let result = await contract.evaluateTransaction('VerifyIjazahContent',id, content)
    return JSON.parse(result.toString())
}

function getDateToday(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();

    return dd + '/' + mm + '/' + yyyy
}

module.exports = {
    changeUserLink,
    createIjazahLowerEd,
    createIjazahPT,
    getIjazahByUserCheckLink,
    verifyIjazahById, 
    getAllIjazah,
    getIjazahByInstitution,
    verifyIjazahContent,
    getIjazahByUser
}