import { ethers } from "hardhat";

const BTC_CONTRACT_ADDRESS = "0xB0104dfC501b0C0aAd7d394692a1c9Dbd5C72b4E"

const ACCOUNT_TEST_ADDRESS = "0x435403426b45d74d5C251D7982504cfC9146E8d7"
const POOL_CONTRACT_ADDRESS = "0xF0892b3B18438B595dE94490d4Ce87FB0AC9647B"
async function main() {
  await setMinter();
  await mint();
  await airdrop();
}

async function deploy() {
  await deployerInfo()
  const Btc = await ethers.getContractFactory("Btc");
  const btc = await Btc.deploy("BTC testnet (UPFI Network)", "BTC");
  await btc.deployed();
  console.log("Btc deployed to:", btc.address);
}

async function initialize() {
  const MyContract = await ethers.getContractFactory("Btc");
  const contract = await MyContract.attach(BTC_CONTRACT_ADDRESS);
  await contract.initialize(ethers.utils.parseUnits("100", 18));
}

async function deployerInfo() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
}

async function mint() {
  const MyContract = await ethers.getContractFactory("Btc");
  const contract = await MyContract.attach(BTC_CONTRACT_ADDRESS);
  const recepient = ACCOUNT_TEST_ADDRESS
  console.log("poolBalance Before::", await contract.balanceOf(recepient))
  let status = await contract.mint(recepient, ethers.utils.parseUnits("1000000", 18));
  console.log("poolBalance After::", await contract.balanceOf(recepient))
}

async function setMinter() {
  const MyContract = await ethers.getContractFactory("Btc");
  const contract = await MyContract.attach(BTC_CONTRACT_ADDRESS);
  const minter_address = "0x064BB9AbFEa620D77c6c4428454cc036432b59e7" //same with deployer
  let status = await contract.setMinter(minter_address, ethers.utils.parseUnits("100000000", 18));
  console.log("set minter status", status)
}

async function airdrop() {
  const account = "0x435403426b45d74d5C251D7982504cfC9146E8d7"
  const MyContract = await ethers.getContractFactory("Btc");
  const contract = await MyContract.attach(BTC_CONTRACT_ADDRESS);
  await contract.airdrop(account);
}

async function approve() {
  const [deployer] = await ethers.getSigners();
  const MyContract = await ethers.getContractFactory("Btc");
  const contract = await MyContract.attach(BTC_CONTRACT_ADDRESS);
  let result = await contract.connect(deployer).approve(POOL_CONTRACT_ADDRESS, ethers.utils.parseUnits("1000000", 18));
  console.log("Approve result: ", result)
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
