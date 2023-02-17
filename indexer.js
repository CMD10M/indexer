import NFTABI from "./abi/NFTABI.js";
import { getProvider } from "./utils.js";
import { ethers, BigNumber, utils } from "ethers";
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { Buffer } from "buffer";

const provider = getProvider();
const port = 32889;
const contractAddress = "0x6c00f8966f37Ac08B4F9D9A6CA895a268f70239b"
const contract = new ethers.Contract(contractAddress, NFTABI, provider);


console.log("🌎 starting webserver...")

const app = express();

let counter=0

app.use(cors());

app.get('/minteditems', async (req, res) => {

    const currentBlock = await provider.getBlockNumber()

    const filter = contract.filters.Transfer(null, null);

    //console.log("getting live events start with lastBlockTracked-10",startRange," and going to currentBlock-10 ",endRange)
    let newEvents = await contract.queryFilter(filter, 0, currentBlock);
    
    let tokenId = (newEvents.length);
    console.log("Number of Minted Items are", tokenId);

    //figure out how to get tokenid based on events. But you want to get all events and new events. old teoken URI's and new token URI's?
     const tokenURI = await contract.tokenURI(tokenId);
     const jsonManifestString = atob(tokenURI.substring(29));
     const jsonManifest = JSON.parse(jsonManifestString);
             res.json(jsonManifest);
         });
    ;

if (fs.existsSync("server.key") && fs.existsSync("server.cert")) {
    https
        .createServer(
            {
                key: fs.readFileSync("server.key"),
                cert: fs.readFileSync("server.cert"),
            },
            app
        )
        .listen(port, () => {
            console.log("HTTPS Listening: "+port);
        });
} else {
    var server = app.listen(port, "0.0.0.0", function () {
        console.log("HTTP Listening on port:", server.address().port);
    });
}


console.log("🎛   http://localhost:"+port+"/")

