// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

const waitForTx = async (tx) => await tx.wait(1);

const KLAP_TOKEN = "0x7BD5Ad63ED737BFe75f2Ab4a043865Cf857756f1"

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Aggregator = await hre.ethers.getContractFactory("LocalAggregator");
  const Controller = await hre.ethers.getContractFactory("OracleController");
  const AaveOracle = await hre.ethers.getContractFactory("AaveOracle");
  const ERC20 = await hre.ethers.getContractFactory("MintableERC20");
  const WKLAY = await hre.ethers.getContractFactory("WKLAY");
  
  const ethToken = await ERC20.deploy("Wrapped Ethereum", "WETH", 18);
  const daiToken = await ERC20.deploy("Dai", "DAI", 18);
  const usdcToken = await ERC20.deploy("USDC", "USDC", 6);
  const usdtToken = await ERC20.deploy("USDT", "USD Tether", 6);
  const btcToken = await ERC20.deploy("Wrapped Bitcoin", "WBTC", 8);
  const klayToken = await WKLAY.deploy();

  const eth = await Aggregator.deploy("WETH", 18)
  console.log(eth.deployTransaction.hash)
  const klay = await Aggregator.deploy("WKLAY", 18)
  console.log(klay.deployTransaction.hash)
  const usdc = await Aggregator.deploy("USDC", 6)
  console.log(usdc.deployTransaction.hash)
  const usdt = await Aggregator.deploy("USDT", 6)
  console.log(usdc.deployTransaction.hash)
  const dai = await Aggregator.deploy("DAI", 18)
  console.log(dai.deployTransaction.hash)
  const btc = await Aggregator.deploy("WBTC", 8)
  console.log(btc.deployTransaction.hash)
  const klap = await Aggregator.deploy("KLAP", 18)
  console.log(klap.deployTransaction.hash)

  await eth.deployed()
  await klay.deployed()
  await usdc.deployed()
  await usdt.deployed()
  await dai.deployed()
  await btc.deployed()
  await klap.deployed()
  
  const controller = await Controller.deploy([
    eth.address,
    klay.address,
    btc.address,
    usdt.address,
    usdc.address,
    dai.address,
    klap.address
  ]);


  await controller.deployed()
  console.log(controller.deployTransaction.hash)

  await waitForTx(await eth.setController(controller.address))
  console.log("eth set")
  await waitForTx(await klay.setController(controller.address))
  console.log("klay set")
  await waitForTx(await usdc.setController(controller.address))
  console.log("usdc set")
  await waitForTx(await usdt.setController(controller.address))
  console.log("usdt set")
  await waitForTx(await dai.setController(controller.address))
  console.log("dai set")
  await waitForTx(await btc.setController(controller.address))
  console.log("btc set")
  await waitForTx(await klap.setController(controller.address))
  console.log("klap set")

  const aaveOracle = await AaveOracle.deploy(
    [
      ethToken.address, 
      daiToken.address, 
      usdcToken.address, 
      usdtToken.address,
      btcToken.address, 
      klayToken.address, 
      KLAP_TOKEN
    ], 
    [
      eth.address, 
      dai.address, 
      usdc.address, 
      usdtToken.address,
      btc.address, 
      klay.address, 
      klap.address
    ], 
    klay.address
  )
  
  await aaveOracle.deployed()

  await waitForTx(await controller.setOracleData([1,1,1,1,1,1,1]))

  console.log("Controller:", controller.address);
  console.log("AAVE Oracle:", aaveOracle.address);
  console.log("ETH Aggregator:", eth.address);
  console.log("KLAY Aggregator:", klay.address);
  console.log("BTC Aggregator:", btc.address);
  console.log("USDC Aggregator:", usdc.address);
  console.log("USDT Aggregator:", usdt.address);
  console.log("DAI Aggregator:", dai.address);
  console.log("KLAP Aggregator:", klap.address);
  
  console.log("ETH Token:", ethToken.address);
  console.log("KLAY Token:", klayToken.address);
  console.log("BTC Token:", btcToken.address);
  console.log("USDC Token:", usdcToken.address);
  console.log("USDT Token:", usdtToken.address);
  console.log("DAI Token:", daiToken.address);
  console.log("KLAP Token:", KLAP_TOKEN);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
