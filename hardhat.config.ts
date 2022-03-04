import { HardhatUserConfig } from 'hardhat/types';
import {
  NETWORKS_RPC_URL,
  NETWORKS_DEFAULT_GAS,
} from './helper-hardhat-config';
import { eAvalancheNetwork, eEthereumNetwork, eKlaytnNetwork, eNetwork, ePolygonNetwork, eXDaiNetwork } from './helpers/types';

require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

//const SKIP_LOAD = process.env.SKIP_LOAD === 'true';
const DEFAULT_BLOCK_GAS_LIMIT = 8000000;
const DEFAULT_GAS_MUL = 5;
const HARDFORK = 'istanbul';
//const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY || '';
const MNEMONIC_PATH = "m/44'/60'/0'/0";
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
//const UNLIMITED_BYTECODE_SIZE = process.env.UNLIMITED_BYTECODE_SIZE === 'true';

const getCommonNetworkConfig = (networkName: eNetwork, networkId: number) => ({
  url: NETWORKS_RPC_URL[networkName],
  hardfork: HARDFORK,
  blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
  gasMultiplier: DEFAULT_GAS_MUL,
  gasPrice: NETWORKS_DEFAULT_GAS[networkName],
  chainId: networkId,
  accounts: [PRIVATE_KEY]
});

const buidlerConfig: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.7.6',
        settings: {
          optimizer: { enabled: true, runs: 200 }
        },
      }
    ]
  },
  mocha: {
    timeout: 0,
  },
  networks: {
    kovan: getCommonNetworkConfig(eEthereumNetwork.kovan, 42),
    ropsten: getCommonNetworkConfig(eEthereumNetwork.ropsten, 3),
    main: getCommonNetworkConfig(eEthereumNetwork.main, 1),
    tenderly: getCommonNetworkConfig(eEthereumNetwork.tenderly, 3030),
    matic: getCommonNetworkConfig(ePolygonNetwork.matic, 137),
    mumbai: getCommonNetworkConfig(ePolygonNetwork.mumbai, 80001),
    xdai: getCommonNetworkConfig(eXDaiNetwork.xdai, 100),
    avalanche: getCommonNetworkConfig(eAvalancheNetwork.avalanche, 43114),
    fuji: getCommonNetworkConfig(eAvalancheNetwork.fuji, 43113),
    klaytn: getCommonNetworkConfig(eKlaytnNetwork.cypress, 8217),
    klaytn_testnet: getCommonNetworkConfig(eKlaytnNetwork.baobab, 1001),
    ganache: {
      url: 'http://ganache:8545',
      accounts: {
        mnemonic: 'fox sight canyon orphan hotel grow hedgehog build bless august weather swarm',
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
      },
    },
  },
};

export default buidlerConfig;
