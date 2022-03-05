const { Chaincode } = require('../configs/fabric.config')

async function getUserByID(id){
    let contract = await Chaincode.getContract()

    let result = await contract.evaluateTransaction("GetUserById", id)

    return JSON.parse(result.toString())
}

module.exports = {
    getUserByID
}