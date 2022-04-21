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
        let file = req.file
        let result = await pdfUtilParse.readAndParsePDF(file.path)

        if (result.info.Producer !== "PDFKit"){
            res.send("Ijazah Tidak Valid")
        } else if (result.info.ModDate){
            res.send("Ijazah Tidak Valid")
        }
        let decision = await ijazahService.verifyIjazahContent(result.id, result.ijazah)
        if (decision) {
            res.send("Ijazah Valid")
        } else {
            res.send("Ijazah Tidak Valid")
        }
        res.send(decision)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createIjazahPDF,
    verifyIjazah
}