##Steps to set up DCA bot

1) Install the dependencies 

2) Copy the env.example file and fill in information 

3) Determine which tokens you would like to swap

4) Change pool address and weth address to any swap pool you'd like in lines 14 - 18. Get contracts here--> https://info.uniswap.org/#/pools 

5) Grab pool ABI's for any tokens you would like to swap in lines 21 - 24

6) Load wallet with balance of existing coins.

7) Change price data from chainlink data feed to any you'd like --> https://docs.chain.link/data-feeds/price-feeds/addresses 

8) Change lines 36 - 38 to any weighted percentage you'd like for the DCA

9) Change lines 41 - 50 to determine token price for the weighted DCA 
