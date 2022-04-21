const fs = require('fs')
const PDFdoc = require('pdfkit')
const getStream = require('get-stream')
// const ijazahTemplate = require('./sr')
const arial = "./src/pdf-utils/arial.ttf"
const arialBold = "./src/pdf-utils/arial-bold.ttf"
const ijazahLowerEdTemplate = "./src/pdf-utils/ijazah.png"
const ijazahTabel = "./src/pdf-utils/ijazah-tabel.png"
const ijazahPTTemplate = "./src/pdf-utils/ijazah-pt.png"

function dateToString(date){
    let dateArr = date.split("/")
    let day =  parseInt(dateArr[0], 10)
    let month = parseInt(dateArr[1], 10)
    let year = dateArr[2]

    let monthMap = ['Januari', 'Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']

    return day + " " + monthMap[month-1] +  " " + year

}

function titleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }


async function createIjazahPDFPT(ijazah){
    const doc = new PDFdoc({
        size: "A4",
        layout: "lanscape"
    })
    // doc.pipe(fs.createWriteStream(`result2.pdf`));
    doc.image(ijazahPTTemplate, 0, 0, { width: 842, height: 595 });

    doc.font(arial).fontSize(13).text(ijazah.ID, 110, 33, {align:'left'})
    doc.font('Times-Bold').fontSize(30).text(ijazah.InstitutionName.toUpperCase(), 72, 64, {
        align:'center'
    })

    doc.font(arialBold).fontSize(16).text(ijazah.StudentName, 72, 132, {align:'center'})
    doc.font(arial)
    doc.fontSize(16).text(dateToString(ijazah.BirthDate), 72, 160, {align:'center'})
    doc.fontSize(16).text(" " + ijazah.BirthPlace, 550, 160, {align:'left'})
    doc.fontSize(16).text(ijazah.NIK, 500, 188, {align:'left'})
    doc.fontSize(16).text(ijazah.StudentNumber, 490, 216, {align:'left'})
    doc.fontSize(16).text(titleCase(ijazah.Tingkat), 636, 248, {align:'left'})
    doc.fontSize(16).text(titleCase(ijazah.Prodi), 72, 300, {align:'center'})
    doc.fontSize(16).text(dateToString(ijazah.GraduationDate), 430, 328, {align:'left'})
    let gelar = titleCase(ijazah.Gelar) + " (" + ijazah.SingkatanGelar + ") "
    if (ijazah.Predikat != ""){
        gelar = gelar + "dengan Predikat " + titleCase(ijazah.Predikat)
    }
    doc.fontSize(16).text(gelar, 72, 384, {align:'center'})
    doc.fontSize(16).text(ijazah.City + ", " + ijazah.Province + " ", -80, 440, {align:'center'})
    doc.fontSize(16).text(dateToString(ijazah.IssueDate), 470, 440, {align:'center'})
    doc.fontSize(16).text(ijazah.LeaderName, 72, 520, {align:'center', height:595})

    doc.end()

    const pdfStream = await getStream.buffer(doc)
    return pdfStream
}

async function createIjazahPDFLowerEd(ijazah){
    const doc = new PDFdoc({
        size: "A4",
        layout: "portrait"
    })

    let mapLevel = {
        "SD" : "SEKOLAH DASAR",
        "SMP" : "SEKOLAH MENENGAH PERTAMA",
        "SMA" : "SEKOLAH MENENGAH ATAS"
    }
    // doc.pipe(fs.createWriteStream(`result.pdf`));

    doc.image(ijazahLowerEdTemplate, 0, 0, { height: 842, width: 595 });
    
    doc.font(arial).fontSize(13).text(ijazah.ID, 120, 37, { align:'left' })   
    doc.font(arialBold).fontSize(20).text(mapLevel[ijazah.Level], 68, 188, {
        align:'center'
    })

    doc.font(arial)
    
    doc.fontSize(16).text(ijazah.InstitutionName, 68, 298, { align:'center' })
    doc.fontSize(16).text(ijazah.City, 180, 328, { align:'center' })
    doc.fontSize(16).text(ijazah.Province,-35, 358, { align:'center' })
    doc.fontSize(16).text(ijazah.StudentName,245, 388, { align:'left' })
    doc.fontSize(16).text(ijazah.BirthPlace + ", " + dateToString(ijazah.BirthDate),245, 418, { align:'left' })
    doc.fontSize(16).text(ijazah.StudentNumber,245, 448, { align:'left' })
    doc.fontSize(16).text(ijazah.NIK,245, 478, { align:'left' })

    doc.fontSize(16).text(dateToString(ijazah.GraduationDate),235, 568, { align:'center' })
    doc.fontSize(16).text(ijazah.City + ", " + dateToString(ijazah.IssueDate), 310, 685, { align:'left' })
    doc.fontSize(16).text(ijazah.LeaderName, 310, 745, { align:'left' })

    // create tabel nilai
    doc.addPage()
    doc.image(ijazahTabel, 0, 0, { height: 842, width: 595 });
    // header
    doc.font(arialBold).fontSize(16).text("No", 85,135, {align:'left'})
    doc.font(arialBold).fontSize(16).text("Mata Pelajaran", 185,135, {align:'left'})
    doc.font(arialBold).fontSize(16).text("Nilai", 430,135, {align:'left'})

    // isi
    doc.font(arial)
    let grade = JSON.parse(ijazah.Grade)
    let mapel = Object.keys(grade)

    let y = 170
    for (let i = 0; i < mapel.length; i++) {
        doc.fontSize(16).text((i+1) + ".", 85, y, {align:'left'})
        doc.fontSize(16).text(mapel[i], 130, y, {align:'left'})
        doc.fontSize(16).text(" " + grade[mapel[i]], 440, y, {align:'left'})
        y += 35
    }

    doc.end()
    const pdfStream = await getStream.buffer(doc)
    return pdfStream
}

module.exports = {
    createIjazahPDFLowerEd,
    createIjazahPDFPT
}
