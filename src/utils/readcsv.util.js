const { parse } = require('csv-parse')
const fs = require('fs')

function readCsv(fileName){
    let result = []
    return new Promise((resolve, reject) => {
        fs.createReadStream(fileName)
        .pipe(parse({delimiter:";"}))
        .on('data', (row) => {
            result.push(row)
        })
        .on('end', () => {
            resolve(result)
        })
        .on('error', reject)
    })
}

module.exports = {
    readCsv
}