import { ethers } from "hardhat";
import Web3 from "web3";

const UPO_CONTRACT_ADDRESS = "0x0F3C47a687960eCBad9E969Ea483E5E8b4D22Fb1"
const ACCOUNT_TEST_ADDRESS = "0x435403426b45d74d5C251D7982504cfC9146E8d7"
const POOL_CONTRACT_ADDRESS = "0xF0892b3B18438B595dE94490d4Ce87FB0AC9647B"
const MY_ACCOUNT = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

async function main() {
  await setMinter();
  await mint();
  await airdrop();
}

async function deploy() {
  await deployerInfo()
  const Upo = await ethers.getContractFactory("Upo");
  const upo = await Upo.deploy("UPO testnet (UPFI Network)", "UPO");
  await upo.deployed();
  console.log("Upo deployed to:", upo.address);
}

async function initialize() {
  const MyContract = await ethers.getContractFactory("Upo");
  const contract = await MyContract.attach(UPO_CONTRACT_ADDRESS);
  await contract.initialize(ethers.utils.parseUnits("100", 18));
}

async function deployerInfo() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
}

async function mint() {
  const MyContract = await ethers.getContractFactory("Upo");
  const contract = await MyContract.attach(UPO_CONTRACT_ADDRESS);
  const recepient = '0x33F520281a7d453a5c0EaF0A47D1dB802bA4F1C2'
  console.log("poolBalance Before::", await contract.balanceOf(recepient))
  let status = await contract.mint(recepient, ethers.utils.parseUnits("1000000", 18));
  console.log("poolBalance After::", await contract.balanceOf(recepient))
}

async function setMinter() {
  const MyContract = await ethers.getContractFactory("Upo");
  const contract = await MyContract.attach(UPO_CONTRACT_ADDRESS);
  const minter_address = "0x064BB9AbFEa620D77c6c4428454cc036432b59e7" //same with deployer
  let status = await contract.setMinter(minter_address, ethers.utils.parseUnits("100000000", 18));
  console.log("set minter status", status)
}

async function airdrop() {
  const account = "0x435403426b45d74d5C251D7982504cfC9146E8d7"
  const MyContract = await ethers.getContractFactory("Upo");
  const contract = await MyContract.attach(UPO_CONTRACT_ADDRESS);
  await contract.airdrop(MY_ACCOUNT);
}

async function approve() {
  const [deployer] = await ethers.getSigners();
  const MyContract = await ethers.getContractFactory("Upo");
  const contract = await MyContract.attach(UPO_CONTRACT_ADDRESS);
  let result = await contract.connect(deployer).approve(POOL_CONTRACT_ADDRESS, ethers.utils.parseUnits("1000000", 18));
  console.log("Approve result: ", result)
}

airdrop().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
