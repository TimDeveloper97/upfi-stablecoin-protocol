import { ethers } from "hardhat";

const UPFI = "0x43E7A150FABdBB613dA446b07DB42dcAa3a1ef1c";
const UPO = "0x0F3C47a687960eCBad9E969Ea483E5E8b4D22Fb1";
const USDC = "0xfe2c9efd1A63aA254ACaE60Bd4F37e657413f4E6";
const BTC = "0xB0104dfC501b0C0aAd7d394692a1c9Dbd5C72b4E"
const ETH = "0x627670a7f376E6f8B502Bce7D2bbbFEdAa7cCaa8";
const ROSE = "0xA5b83F3808b597FD030801007Bc975E1d227C054";

const TREASURY = "0x2715abDBD52ec08576a14764A51C22Aa21C8CC9d";
const POOL_CONTRACT_ADDRESS = "0x9cc449142243947D70933bA9e19F6100Ac54d29B";


async function deploy() {
  const Pool = await ethers.getContractFactory("Pool");
  const pool = await Pool.deploy(UPFI, USDC, TREASURY, ethers.utils.parseUnits("100000000", 18));

  await pool.deployed();

  console.log("pool deployed to:", pool.address);
}

async function addSource() {
  await addTokenShare()
  await setTokenSharePrice()
  await setPoolCeiling()
}

async function addTokenShare() {
  const [signer] = await ethers.getSigners();
  const MyContract = await ethers.getContractFactory("Pool");
  const contract = MyContract.attach(POOL_CONTRACT_ADDRESS);
  await contract.connect(signer).addTokenShare("BTC", BTC);
  await contract.connect(signer).addTokenShare("ETH", ETH);
  await contract.connect(signer).addTokenShare("ROSE", ROSE);
  await contract.connect(signer).addTokenShare("UPO", UPO);
}

async function setTokenSharePrice() {
  const [signer] = await ethers.getSigners();
  const MyContract = await ethers.getContractFactory("Pool");
  const contract = MyContract.attach(POOL_CONTRACT_ADDRESS);
  const BTC_USD = ethers.utils.parseUnits("27120", 6)
  const ETH_USD = ethers.utils.parseUnits("2012", 6)
  const ROSE_USD = ethers.utils.parseUnits("0.06", 6)
  const UPO_USD = ethers.utils.parseUnits("0.03", 6)

  await contract.connect(signer).setTokenSharePrice("BTC", BTC_USD)
  await contract.connect(signer).setTokenSharePrice("ETH", ETH_USD)
  await contract.connect(signer).setTokenSharePrice("ROSE", ROSE_USD)
  await contract.connect(signer).setTokenSharePrice("UPO", UPO_USD)
}

async function setPoolCeiling() {
  const [signer] = await ethers.getSigners();
  const MyContract = await ethers.getContractFactory("Pool");
  const contract = MyContract.attach(POOL_CONTRACT_ADDRESS);

  let result = await contract.connect(signer).setPoolCeiling(ethers.utils.parseUnits("100000000", 18));
  console.log("setPoolCeiling result: ", result);
}

async function info() {
  const MyContract = await ethers.getContractFactory("Pool");
  const contract = await MyContract.attach(POOL_CONTRACT_ADDRESS);

  const info = await contract.getTokenSharePrice('UPO');
  console.log("Pool Info: ", info);
}

addSource().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
