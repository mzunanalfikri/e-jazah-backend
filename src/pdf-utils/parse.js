const fs = require('fs');
const pdf = require('pdf-parse');
 
// let dataBuffer = fs.readFileSync('result.pdf');
const stringify = require('json-stringify-deterministic')
const sortKey = require('sort-keys-recursive')

const monthToNumber = {
    "Januari" : "01",
    "Februari" : "02",
    "Maret" : "03",
    "April" : "04",
    "Mei" : "05",
    "Juni" : "06",
    "Juli" : "07",
    "Agustus" : "08",
    "September" : "09",
    "Oktober" : "10",
    "November" : "11",
    "Desember" : "12",
}
// pdf(dataBuffer).then(function(data) {
 
//     // number of pages
//     // console.log(data.numpages);
//     // number of rendered pages
//     // console.log(data.numrender);
//     // PDF info
//     console.log(data.info);
//     // PDF metadata
//     // console.log(data.metadata); 
//     // PDF.js version
//     // check https://mozilla.github.io/pdf.js/getting_started/
//     // console.log(data.version);
//     // PDF text
//     // console.log("LALALAL:")
//     let content = data.text.trim().split('\n')
//     // let ijazah = parseIjazahPT(content)
//     let ijazah = parseIjazahEd(content)
//     console.log(ijazah)
// });

function readAndParsePDF(fileName){
    let buffer = fs.readFileSync(fileName)
    return new Promise((resolve, reject) => {
        pdf(buffer).then(data => {
            let content = data.text.trim().split('\n')
            let id = content[0]
            let level = content[0].split("-")[0]
            let ijazah
            if (level === "PT"){
                ijazah = parseIjazahPT(content)
            } else if (level === "SD" || level === "SMP" || level === "SMA"){
                ijazah = parseIjazahEd(content)
            } else {
                throw new Error("Invalid format")
            }
            let result = {
                info : data.info,
                ijazah: stringify(ijazah),
                id
            }
            resolve(result)
        }).catch(err => {
            reject(err)
        })
    })
}


function titleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

function parseIjazahEd(content){
    let mapTingkat = {
        "SEKOLAH MENENGAH PERTAMA" : "SMP",
        "SEKOLAH DASAR" : "SD",
        "SEKOLAH MENENGAH ATAS" : "SMA"
    }
    
    let issueDateData = content[10].split(", ")[1].split(" ")
    let issueDate = ("0" + issueDateData[0]).slice(-2) + "/" + monthToNumber[issueDateData[1]] + "/" + issueDateData[2]
    
    let gdData = content[9].split(" ")
    let gradDate = ("0" + gdData[0]).slice(-2) + "/" + monthToNumber[gdData[1]] + "/" + gdData[2]

    let birthData = content[6].split(", ")
    let birthPlace = birthData[0]
    let birthDateData = birthData[1].split(" ")
    let birthDate = ("0" + birthDateData[0]).slice(-2) + "/" + monthToNumber[birthDateData[1]] + "/" + birthDateData[2]

    let grade = {}
    for (let i = 14; i < content.length; i++) {
        let singleGrade = content[i].split(".")[1].split(" ")
        let nilai = singleGrade[singleGrade.length-1]
        let mapel = singleGrade.slice(0, singleGrade.length-1).join(" ")
        grade[mapel] = nilai
    }
    let ijazah = {
        ID : content[0],
        InstitutionName : content[2],
        Province : content[4],
        City : content[3],
        Level : mapTingkat[content[1]],
        StudentName : content[5],
        BirthPlace : birthPlace,
        BirthDate : birthDate,
        NIK : content[8],
        StudentNumber : content[7],
        GraduationDate : gradDate,
        IssueDate : issueDate,
        LeaderName : content[11],
        Grade : stringify(sortKey(grade)) //need to parse
    }
    return sortKey(ijazah)
}

function parseIjazahPT(content){
    let arr = content[9].split(" dengan Predikat ")
    let predikat = ""
    if (arr[1] != undefined){
        predikat = arr[1]
    }
    let arr2 = arr[0].split(" ")
    let gelar = arr2.slice(0,arr2.length-1).join(" ")
    let singkatanGelar = arr2[arr2.length-1].replace("(","").replace(")","")

    // parse birth date
    let arr3 = content[3].split(" ")
    let birthPlace = arr3.slice(3, arr3.length).join(" ")
    let birthDate = ("0" + arr3[0]).slice(-2) + "/" + monthToNumber[arr3[1]] + "/" + arr3[2]

    // graduation date
    let gd = content[8].split(" ")
    let gradDate = ("0" + gd[0]).slice(-2) + "/" + monthToNumber[gd[1]] + "/" + gd[2]

    // issueing
    let iDate = content[10].split(" ")
    let issueDate = ("0" + iDate[iDate.length - 3]).slice(-2) + "/" + monthToNumber[iDate[iDate.length - 2]] + "/" + iDate[iDate.length - 1]
    let region = iDate.slice(0, iDate.length-3).join(" ").split(", ")
    let institutionCity = region[0]
    let province = region[1]
    let ijazah = {
        ID : content[0],
        InstitutionName : titleCase(content[1]),
        Province : province,
        City : institutionCity,
        Level : content[0].split("-")[0],
        StudentName : content[2],
        BirthPlace : birthPlace,
        BirthDate : birthDate,
        NIK : content[4],
        Tingkat : content[6].toLowerCase(),
        StudentNumber : content[5],
        Prodi : content[7].toLowerCase(),
        Gelar : gelar.toLowerCase(),
        SingkatanGelar : singkatanGelar,
        GraduationDate : gradDate,
        IssueDate : issueDate,
        LeaderName : content[11],
        Predikat : predikat.toLowerCase()
    }
    return sortKey(ijazah)
}

// readAndParsePDF('result.pdf')
// readAndParsePDF('result2.pdf')

module.exports = {
    readAndParsePDF
}