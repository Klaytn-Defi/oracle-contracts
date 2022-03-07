// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

const waitForTx = async (tx) => await tx.wait(1);

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
  
  const eth = await Aggregator.deploy("ETH", 18)
  const klay = await Aggregator.deploy("KLAY", 18)
  const usd = await Aggregator.deploy("USD", 18)
  const dai = await Aggregator.deploy("DAI", 18)
  const btc = await Aggregator.deploy("BTC", 18)

  await eth.deployed()
  console.log(eth.deployTransaction.hash)
  await klay.deployed()
  console.log(klay.deployTransaction.hash)
  await usd.deployed()
  console.log(usd.deployTransaction.hash)
  await dai.deployed()
  console.log(dai.deployTransaction.hash)
  await btc.deployed()
  console.log(btc.deployTransaction.hash)
  
  const controller = await Controller.deploy([
    eth.address,
    klay.address,
    btc.address,
    usd.address,
    dai.address
  ]);

  await controller.deployed()
  console.log(controller.deployTransaction.hash)

  await waitForTx(await eth.setController(controller.address))
  console.log("eth set")
  await waitForTx(await klay.setController(controller.address))
  console.log("klay set")
  await waitForTx(await usd.setController(controller.address))
  console.log("usdc set")
  await waitForTx(await dai.setController(controller.address))
  console.log("dai set")
  await waitForTx(await btc.setController(controller.address))
  console.log("btc set")

  console.log("Controller:", controller.address);
  console.log("ETH:", eth.address);
  console.log("KLAY:", klay.address);
  console.log("BTC:", btc.address);
  console.log("USD:", usd.address);
  console.log("DAI:", dai.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
