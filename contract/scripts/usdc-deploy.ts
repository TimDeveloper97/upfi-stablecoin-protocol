import { access } from "fs";
import { ethers } from "hardhat";
const USDC_CONTRACT_ADDRESS = "0xfe2c9efd1A63aA254ACaE60Bd4F37e657413f4E6"
const POOL_CONTRACT_ADDRESS = "0xF0892b3B18438B595dE94490d4Ce87FB0AC9647B"
const MY_ACCOUNT = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

async function main() {
  await initialize()
  await airdrop()
  
}

async function deploy() {
  const Usdc = await ethers.getContractFactory("Usdc");
  const usdc = await Usdc.deploy("USDC testnet (UPFI Network)", "USDC");

  await usdc.deployed();

  console.log("Usdc deployed to:", usdc.address);
}

async function setMinter() {
  const [deployer] = await ethers.getSigners();
  const MyContract = await ethers.getContractFactory("Usdc");
  const contract = await MyContract.attach(USDC_CONTRACT_ADDRESS);
  let status = await contract.setMinter(deployer.address, ethers.utils.parseUnits("100000000", 18));
  console.log("set minter status", status)
}

async function mint() {
  const MyContract = await ethers.getContractFactory("Usdc");
  const contract = await MyContract.attach(USDC_CONTRACT_ADDRESS);
  const recepient = '0x33F520281a7d453a5c0EaF0A47D1dB802bA4F1C2'
  console.log("poolBalance Before::", await contract.balanceOf(recepient))
  let status = await contract.mint(recepient, ethers.utils.parseUnits("1000000", 18));
  console.log("poolBalance After::", await contract.balanceOf(recepient))
}

async function initialize() {
  const MyContract = await ethers.getContractFactory("Usdc");
  const contract = await MyContract.attach(USDC_CONTRACT_ADDRESS);
  await contract.initialize(ethers.utils.parseUnits("100", 18));
}

async function airdrop() {
  const account = "0x435403426b45d74d5C251D7982504cfC9146E8d7"
  const MyContract = await ethers.getContractFactory("Usdc");
  const contract = await MyContract.attach(USDC_CONTRACT_ADDRESS);
  await contract.airdrop(MY_ACCOUNT);
}

async function approve() {
  const [deployer] = await ethers.getSigners();
  const MyContract = await ethers.getContractFactory("Usdc");
  const contract = await MyContract.attach(USDC_CONTRACT_ADDRESS);
  let result = await contract.connect(deployer).approve(POOL_CONTRACT_ADDRESS, ethers.utils.parseUnits("1000000", 18));
  console.log("Approve result: ", result)
}

airdrop().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
