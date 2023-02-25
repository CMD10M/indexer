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

app.get('/allitems', async (req, res) => {

    const totalTokens = await contract.totalSupply();
    let tokenURIs = [];
    for (let i = 0; i < totalTokens; i++) {
      const tokenId = await contract.tokenByIndex(i);
      const tokenURI = await contract.tokenURI(tokenId);
      const match = tokenURI.match(/^data:application\/json;base64,(.+)$/);
      if (match) {
        const jsonManifestString = atob(match[1]);
        const parsedTokenURI = JSON.parse(jsonManifestString);
        tokenURIs.push(parsedTokenURI);
      }
    }
    res.json(tokenURIs);

});


var server = app.listen(port, "0.0.0.0");



console.log("🎛   http://localhost:"+port+"/")
