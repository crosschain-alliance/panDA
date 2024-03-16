import { config as dotenvConfig } from "dotenv"
import { resolve } from "path"
import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "@nomicfoundation/hardhat-ethers"
import "@nomicfoundation/hardhat-verify"

import "./task"

const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || "./.env"
dotenvConfig({ path: resolve(__dirname, dotenvConfigPath) })

const privateKey: string | undefined = process.env.PRIVATE_KEY
if (!privateKey) {
  throw new Error("Please set your PRIVATE_KEY in a .env file")
}

const config: HardhatUserConfig = {
  networks: {
    arbitrumSepolia: {
      accounts: [privateKey as string],
      chainId: 421614,
      url: process.env.ARBITRUM_SEPOLIA_JSON_RPC_URL,
      gasPrice: 1e9,
    },
  },
  etherscan: {
    apiKey: {},
  },
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    src: "./contracts",
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.24",
    settings: {
      evmVersion: "paris",
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 10000,
      },
    },
  },
  sourcify: {
    enabled: false,
  },
}

export default config
