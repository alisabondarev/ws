
const httpStatus = require("http-status-codes");
const fs = require("fs");
const path = require("path");

const defaultOptions = {

    errorStatusCode: httpStatus.TOO_MANY_REQUESTS,
    errorMessage: "Too Many Requests",
    inMemory: true,
    maxNumOfRequests: 1,
    windowMs: 15 * 1000, // fifteen seconds,
    clearingRate: 5, // how ofter to clear unused ips
    folderDir: "./",
    fileName: "ipHash.json"
}

const initiateIpHash = () => {
    
    return {
        numOfRequests: 1,
        initialTime: Date.now()
    };
}

const getFileInFolder = (folderDir, fileName) => {
    try
    {
        let folder = path.join(__dirname, folderDir);
        return fileName ? path.join(folder, fileName) : folder;
    }
    catch(err)
    {
        return fileName ? path.join(__dirname, fileName) : __dirname;
    }
}

const readIPHashFromFile = (folderDir, fileName) =>
{
    let ipHash = {};

    try { 
        const jsonFile = getFileInFolder(folderDir, fileName);

        const ipHashString = fs.readFileSync(jsonFile);

        ipHash = JSON.parse(ipHashString);
    }
    catch {
    }

    return ipHash;
} 

const saveIPHashFromFile = (folderDir, fileName, ipHash) =>
{
    try {
        
        const ipHashString = JSON.stringify(ipHash);

        const jsonFile = getFileInFolder(folderDir, fileName);

        fs.writeFileSync(jsonFile, ipHashString);
    }
    catch(err) {
    }
}

const rateLimiter = (options = {}) =>
{
    options = Object.assign(defaultOptions, options);
    let ipHash = {};

    const middleware = async (req, res, next) =>
    {
        const { ip, path } = req;

        const pathWithIP = `${path}-${ip}`;

        // Check if we store ipHash in memory or in file
        if (!options.inMemory)
        {
            ipHash = readIPHashFromFile(options.folderDir, options.fileName);
        }

        // if never requested before from this ip
        if (!ipHash[pathWithIP]) {
            // initiate ip record with one request
            ipHash[pathWithIP] = initiateIpHash();
        }
        else {

            if (Date.now() - ipHash[pathWithIP].initialTime < options.windowMs)
            {
                // inciment by one request
                ipHash[pathWithIP].numOfRequests += 1;
            }
            // if time has elapsed from the last request, start over
            else {
                ipHash[pathWithIP] = initiateIpHash();
            }
        }

        // if max requests number is not yet reached 
        let isContinueWithNext = ipHash[pathWithIP].numOfRequests <= options.maxNumOfRequests;

        if (!options.inMemory) {
            saveIPHashFromFile(options.folderDir, options.fileName, ipHash);
            ipHash = {};
        }
        
        if (isContinueWithNext) {
            // continue
            return next();
        }
        // through an error if max number of requests is reached
        else {
            return res.status(options.errorStatusCode).send(options.errorMessage);
        }        
    }

    // clear IPs that didn't request data for a while
    setInterval(() => {

        // Check if we store ipHash in memory or in file
        if (!options.inMemory)
        {
             // extract ipHash from file
             ipHash = readIPHashFromFile(options.folderDir, options.fileName);
        }

        const ipsToRemove = [];

        Object.keys(ipHash).forEach(ip => {

            // if time has elapsed above the ms window
            if (Date.now() - ipHash[ip].initialTime > options.windowMs)
            {
                ipsToRemove.push(ip);
            }            
        });

        ipsToRemove.forEach(ip => {
            delete ipHash[ip];
        })

        if (!options.inMemory) {
            saveIPHashFromFile(options.folderDir, options.fileName, ipHash);
            ipHash = {};
        }

    }, options.windowMs * options.clearingRate);

    return middleware;
}

module.exports = rateLimiter;