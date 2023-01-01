import UniswapABI from "./abi/UniswapV3Pool.js";
import ERC20ABI from "./abi/ERC20ABI.js";
import SwapRouterABI from "./abi/SwapRouter.js"
import { getProvider, getSigner } from "./utils.js";
import { ethers, BigNumber } from "ethers";
import ABI from "./abi/priceABI.js"
import 'dotenv/config';

//change getSigner and getProvider to "True" to switch to mainnet
const goerliSigner = getSigner();
const goerliProvider = getProvider();

//Change pool address and weth address to whatever swap pool you'd like. Get contracts here--> https://info.uniswap.org/#/pools 
const poolAddress = "0x4d1892f15B03db24b55E73F9801826a56d6f0755" 
const myWalletAddress = process.env.WALLET_ADDRESS;
const ChainlinkContractAddress = "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
const swapRouterAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564'
const wethaddress = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'

//Grab ABI's for whatever tokens you want to swap
const swapRouterContract = new ethers.Contract(swapRouterAddress, SwapRouterABI, goerliProvider)
const poolContract = new ethers.Contract(poolAddress, UniswapABI, goerliProvider)
const ethPriceContract = new ethers.Contract(ChainlinkContractAddress , ABI , goerliProvider)
const wethContract = new ethers.Contract(wethaddress, ERC20ABI, goerliSigner);

const ETHdata = (await ethPriceContract.latestRoundData()).toString();
const CurrentETHPrice = parseInt(ETHdata.split(",")[1])/100000000;
console.log("Current ETH price is", CurrentETHPrice, "USD");

//My balance of token exchanging
const myBalance = await wethContract.balanceOf(myWalletAddress);
const myBalanceformat = ethers.utils.formatEther(myBalance); 
console.log("I have", myBalanceformat, "WETH");


const fivepercentBalance = parseInt((myBalance.div(BigNumber.from(20))).toString());
const tenpercentBalance = parseInt((myBalance.div(BigNumber.from(10))).toString());
const twentypercentBalance = parseInt((myBalance.div(BigNumber.from(5))).toString());

//Weighted DCA based on live ETH Price
let amountIn;
if (CurrentETHPrice >= 1000 && CurrentETHPrice <= 1200) {
  amountIn = fivepercentBalance;
} else if (CurrentETHPrice >= 800 && CurrentETHPrice <= 1000) {
  amountIn = tenpercentBalance;
}  else if (CurrentETHPrice < 800) {
  amountIn = twentypercentBalance;
}  else {
  amountIn = 0;
}
console.log("Based on the current ETH price, I will buy", ethers.utils.formatEther(amountIn), "UNI");

//Uniswap approval to access funds in wallet
const approvalAmount = (amountIn * 100000).toString()
const approvalResponse = await wethContract.connect(goerliSigner).approve(swapRouterAddress, '1000000000000000000')

const params = { 
    tokenIn: poolContract.token1(),
    tokenOut: poolContract.token0(),
    fee: poolContract.fee(),
    recipient: myWalletAddress,
    deadline: Math.floor(Date.now() / 1000) + (60 * 10),
    amountIn: amountIn.toString(),
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
}

//Transaction if price is right
if (amountIn == 0) {
  console.log("TX Aborted");
} else {
  const transaction = await swapRouterContract.connect(goerliSigner).exactInputSingle(params,
    {gasLimit: ethers.utils.hexlify(1000000)}
    );
  console.log("TX Sent", transaction.hash);
}