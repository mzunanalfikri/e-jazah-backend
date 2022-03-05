const helper = require('../utils/helper.util')
const path = require('path')
const { Wallets, Gateway } = require('fabric-network')

const walletPath = path.join(__dirname, '..' , '..', 'init-wallet', 'wallet')

const channelName = 'main-channel'
const chaincodeName = 'basic'
const userId = 'backend-system'

class Chaincode {
    static contract = undefined

    constructor(){
    }

    static async getContract() {
        if (this.contract != undefined){
            return this.contract
        }
        console.log("test 1 2 3 1 2 3")
        const ccp = helper.buildCCPOrg1()
        const wallet = await helper.buildWallet(Wallets, walletPath)

        const gateway = new Gateway()

        await gateway.connect(ccp, {
            wallet,
            identity: userId,
            discovery: {enabled:true, asLocalhost: true}
        })

        const network = await gateway.getNetwork(channelName)

        this.contract = network.getContract(chaincodeName)

        return this.contract
    }
}

module.exports = {
    Chaincode
}