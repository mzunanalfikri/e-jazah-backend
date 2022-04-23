const pdfUtilCreate = require('../pdf-utils/create')
const pdfUtilParse = require('../pdf-utils/parse')
const ijazahService = require('../services/ijazah.service')

async function createIjazahPDF(req, res, next){
    try {
        let ijazah = req.query
        if (!ijazah.Level){
            res.status = 400
            res.send("Wrong body")
        } 
        let pdfStream
        
        if (ijazah.Level === "PT"){
            pdfStream = await pdfUtilCreate.createIjazahPDFPT(ijazah)
        } else {
            pdfStream = await pdfUtilCreate.createIjazahPDFLowerEd(ijazah)
        }
        res.writeHead(200, {
            'Content-Length' : Buffer.byteLength(pdfStream),
            'Content-Type' : 'application/pdf',
            'Content-disposition': 'attachment;filename=ijazah.pdf',
        }).end(pdfStream)
    } catch (err) {
        next(err)
    }
}

async function verifyIjazah(req, res, next){
    try {
        // res.setHeader("Content-Type", "application/json")
        let file = req.file
        let result = await pdfUtilParse.readAndParsePDF(file.path)

        if (result.info.Producer !== "PDFKit"){
            res.send({notVerified:true})
        } else if (result.info.ModDate){
            res.send({notVerified:true})
        }
        let decision = await ijazahService.verifyIjazahContent(result.id, result.ijazah)
        if (decision) {
            console.log("Return Trueeee")
            let ijazah = JSON.parse(result.ijazah)
            console.log(ijazah)
            res.send({
                Name: ijazah.StudentName,
                Level : ijazah.Level,
                InstitutionName : ijazah.InstitutionName
            })
        } else {
            res.send({notVerified:true})
        }
        // res.send(decision)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createIjazahPDF,
    verifyIjazah
}