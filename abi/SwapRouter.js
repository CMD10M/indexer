const SwapRouterABI = [ 
    {
            "inputs": [
              {
                "components": [
                  {
                    "internalType": "bytes",
                    "name": "path",
                    "type": "bytes"
                  },
                  {
                    "internalType": "address",
                    "name": "recipient",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "deadline",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "amountIn",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "amountOutMinimum",
                    "type": "uint256"
                  }
                ],
                "internalType": "struct ISwapRouter.ExactInputParams",
                "name": "params",
                "type": "tuple"
              }
            ],
            "name": "exactInput",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "amountOut",
                "type": "uint256"
              }
            ],
            "stateMutability": "payable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "tokenIn",
                    "type": "address"
                  },
                  {
                    "internalType": "address",
                    "name": "tokenOut",
                    "type": "address"
                  },
                  {
                    "internalType": "uint24",
                    "name": "fee",
                    "type": "uint24"
                  },
                  {
                    "internalType": "address",
                    "name": "recipient",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "deadline",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "amountIn",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "amountOutMinimum",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint160",
                    "name": "sqrtPriceLimitX96",
                    "type": "uint160"
                  }
                ],
                "internalType": "struct ISwapRouter.ExactInputSingleParams",
                "name": "params",
                "type": "tuple"
              }
            ],
            "name": "exactInputSingle",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "amountOut",
                "type": "uint256"
              }
            ],
            "stateMutability": "payable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "components": [
                  {
                    "internalType": "bytes",
                    "name": "path",
                    "type": "bytes"
                  },
                  {
                    "internalType": "address",
                    "name": "recipient",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "deadline",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "amountOut",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "amountInMaximum",
                    "type": "uint256"
                  }
                ],
                "internalType": "struct ISwapRouter.ExactOutputParams",
                "name": "params",
                "type": "tuple"
              }
            ],
            "name": "exactOutput",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "amountIn",
                "type": "uint256"
              }
            ],
            "stateMutability": "payable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "tokenIn",
                    "type": "address"
                  },
                  {
                    "internalType": "address",
                    "name": "tokenOut",
                    "type": "address"
                  },
                  {
                    "internalType": "uint24",
                    "name": "fee",
                    "type": "uint24"
                  },
                  {
                    "internalType": "address",
                    "name": "recipient",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "deadline",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "amountOut",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "amountInMaximum",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint160",
                    "name": "sqrtPriceLimitX96",
                    "type": "uint160"
                  }
                ],
                "internalType": "struct ISwapRouter.ExactOutputSingleParams",
                "name": "params",
                "type": "tuple"
              }
            ],
            "name": "exactOutputSingle",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "amountIn",
                "type": "uint256"
              }
            ],
            "stateMutability": "payable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "int256",
                "name": "amount0Delta",
                "type": "int256"
              },
              {
                "internalType": "int256",
                "name": "amount1Delta",
                "type": "int256"
              },
              {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
              }
            ],
            "name": "uniswapV3SwapCallback",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        
      
    ];
export default SwapRouterABI