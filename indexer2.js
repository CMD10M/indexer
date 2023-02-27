import NFTABI from "./abi/NFTABI.js";
import { getProvider } from "./utils.js";
import { ethers, BigNumber, utils } from "ethers";
import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "fs";
import { Buffer } from "buffer";

const provider = getProvider();
const port = 32889;
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const startBlock = 1;

let lastBlockTracked = 0;

const fileCachingForLocalDebugging = false;

let tokensOfAddress = {};

let tokens = {};

const TOKENCACHING = true;
const directory = "./tokens";

let lastKnownBlock = 0;

console.log("🌎 starting webserver...");

const app = express();

app.use(cors());

app.get("/all", (req, res) => {
  let page = 1;
  if (req.query.page) {
    page = req.query.page;
  }
  console.log("page: ", page);

  let perPage = 10;
  if (req.query.perPage) {
    perPage = req.query.perPage;
  }
  console.log("perPage: ", perPage);

  const length = Object.keys(tokens).length;
  console.log("length: ", length);

  const tokensMetadata = [];
  let startIndex = length - perPage * (page - 1);
  console.log("startIndex: ", startIndex);
  for (
    let tokenIndex = startIndex;
    tokenIndex > startIndex - perPage && tokenIndex > 0;
    tokenIndex--
  ) {
    tokensMetadata.push({ id: tokenIndex, ...tokens[tokenIndex] });
  }
  res.json(tokensMetadata);
});

app.get("/all/:address", (req, res) => {
    const address = req.params.address;
    const tokensMetadata = [];
    for (const tokenId in tokens) {
        const token = tokens[tokenId];
        if(token.owner.toLowerCase() === address.toLowerCase()) {
            tokensMetadata.push({ id: tokenId, ...tokens[tokenId] });
        }
    }
    res.json(tokensMetadata);
  });

app.get("/balloon/:tokenId", (req, res) => {
    const tokenId = req.params.tokenId;
    const balloon = tokens[tokenId];
    res.json(balloon);
  });


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
      console.log("HTTPS Listening: " + port);
    });
} else {
  var server = app.listen(port, "0.0.0.0", function () {
    console.log("HTTP Listening on port:", server.address().port);
  });
}

console.log("🎛   http://localhost:" + port + "/");

const loadTokienUri = async (tokenId) => {
  if (TOKENCACHING) {
    let possibleToken;
    try {
      possibleToken = fs.readFileSync("./tokens/" + tokenId + ".json");
      if (possibleToken) {
        return JSON.parse(possibleToken);
      }
    } catch (e) {
      //console.log("cache miss")
    }
  }
  console.log("📡 looking up token ", tokenId);
  const base64Encoded = await contract.tokenURI(tokenId);
  const decodedString = Buffer.from(
    base64Encoded.replace("data:application/json;base64,", ""),
    "base64"
  ).toString();
  fs.writeFileSync("./tokens/" + tokenId + ".json", decodedString);
  const tokenObject = JSON.parse(decodedString);
  return tokenObject;
};

const removeTokenFromAddress = async (address, tokenId) => {
  for (let tokenIndex in tokensOfAddress[address]) {
    if (tokensOfAddress[address][tokenIndex] === tokenId) {
      tokensOfAddress[address].splice(tokenIndex, 1);
    }
  }
};

const tokenExistsForAddress = async (address, tokenId) => {
  for (let tokenIndex in tokensOfAddress[address]) {
    if (tokensOfAddress[address][tokenIndex] === tokenId) {
      return true;
    }
  }
  return false;
};

const processTx = async (tx) => {
  let to = tx.args[1].toLowerCase();
  if (!tokensOfAddress[to]) {
    tokensOfAddress[to] = [];
  }
  let tokenId;
  if (BigNumber.isBigNumber(tx.args[2])) {
    tokenId = tx.args[2].toNumber();
  } else {
    tokenId = BigNumber.from(tx.args[2].hex).toNumber();
  }
  //console.log("tokenId", tokenId)
  if (!(await tokenExistsForAddress(to, tokenId))) {
    tokensOfAddress[to].push(tokenId);
  }

  let from = tx.args[0].toLowerCase();
  removeTokenFromAddress(from, tokenId);

  // console.log("checking for tokenUri of tokenId ",tokenId)

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  if (!tokens[tokenId]) {
    tokens[tokenId] = await loadTokienUri(tokenId);
  }
};

console.log("⚙️ loading all balloons events...");

// Instantiate the contract instance

const contract = new ethers.Contract(contractAddress, NFTABI, provider);

let liveFilter = {
  address: contractAddress,
  topics: [utils.id("Transfer(address,address,uint256)")],
};

console.log("📡 Set up to watch for future transfer events...");
provider.on(liveFilter, (event) => {
  console.log("🛰 🛰 🛰 Transfer event: ", event);

  let tx = event;

  fs.writeFileSync("./tx.json", JSON.stringify(tx));

  console.log("from", utils.defaultAbiCoder.decode(["address"], tx.topics[1]));
  console.log("to", utils.defaultAbiCoder.decode(["address"], tx.topics[2]));
  console.log("id", utils.defaultAbiCoder.decode(["uint256"], tx.topics[3]));

  let txObj = {
    args: [
      utils.defaultAbiCoder.decode(["address"], tx.topics[1])[0],
      utils.defaultAbiCoder.decode(["address"], tx.topics[2])[0],
      utils.defaultAbiCoder.decode(["uint256"], tx.topics[3])[0],
    ],
  };
  console.log("txObj", txObj);

  processTx(txObj);
});

// Getting all past events
console.log("📡 Getting all past transfer events...");
const filter = contract.filters.Transfer(null, null);

const currentBlock = await provider.getBlockNumber();
console.log("current block", currentBlock);
lastKnownBlock = currentBlock;

let allEvents;
if (fileCachingForLocalDebugging) {
  try {
    const stringOfEvents = fs.readFileSync("cache.json", "utf8");
    allEvents = JSON.parse(stringOfEvents);
  } catch (e) {}
}

if (!allEvents) {
  console.log("can't read cache querying RPC...");
  // Set up event filter to get all Transfer events
  // Get all past Transfer events
  console.log("Getting all past events", currentBlock);
  lastBlockTracked = currentBlock;
  allEvents = await contract.queryFilter(filter, startBlock, currentBlock);

  console.log("caching", allEvents.length, " events...");
  fs.writeFileSync("./cache.json", JSON.stringify(allEvents));
}

console.log("loaded ", allEvents.length, "events");

for (const event of allEvents) {
  await processTx(event);
}
