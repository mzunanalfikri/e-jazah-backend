/** helper functions */ 

const path = require("path")
const fs = require("fs") 

function buildCCPOrg1() { 
    const ccpPath = path.resolve(__dirname, '..', '..', 'e-jazah-fabric-network', 
    'organizations', 'peerOrganizations', 'org1.e-jazah.id', 
    'connection-org1.json'); 

    const fileExists = fs.existsSync(ccpPath); 
    if(!fileExists) { 
        throw new Error("Cannot find: ${ccpPath}"); 
    }

    const contents = fs.readFileSync(ccpPath, 'utf8'); 

    const ccp = JSON.parse(contents); 

    console.log(`Loaded network config from: ${ccpPath}`); 

    return ccp; 
}

async function buildWallet(Wallets, walletPath) { 
    let wallet; 

    if (walletPath) { 
        wallet = await Wallets.newFileSystemWallet(walletPath);     
        console.log(`Built wallet from ${walletPath}`); 
    } else { 
        wallet = await Wallets.newInMemoryWallet(); 
        console.log("Build in-memory wallet"); 
    }

    return wallet; 
}

function prettyJSONString(inputString) { 
    return JSON.stringify(JSON.parse(inputString), null, 2);
}

module.exports = {
    buildCCPOrg1,
    buildWallet,
    prettyJSONString
}