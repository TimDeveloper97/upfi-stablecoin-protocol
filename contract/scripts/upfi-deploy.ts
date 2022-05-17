import { ethers } from "hardhat";

const UPFI_CONTRACT_ADDRESS = "0x43E7A150FABdBB613dA446b07DB42dcAa3a1ef1c"
const POOL_CONTRACT_ADDRESS = "0x9cc449142243947D70933bA9e19F6100Ac54d29B"

async function main() {
  const accounts = await ethers.getSigners();
  const owner = accounts[0];
  const Upfi = await ethers.getContractFactory("Upfi", owner);
  const upfi = await Upfi.deploy("UPFI testnet (UPFI Network)", "UPFI");

  await upfi.deployed();

  console.log("Upfi deployed to:", upfi.address);
}

async function initialize() {
  const MyContract = await ethers.getContractFactory("Upo");
  const contract = await MyContract.attach(UPFI_CONTRACT_ADDRESS);
  await contract.initialize(ethers.utils.parseUnits("1000", 18));
}
async function setMinter() {
  const [deployer] = await ethers.getSigners();
  const MyContract = await ethers.getContractFactory("Upfi");
  const contract = await MyContract.attach(UPFI_CONTRACT_ADDRESS);
  let result = await contract.connect(deployer).setMinter(
    POOL_CONTRACT_ADDRESS,
    ethers.utils.parseUnits("1000000000", 18)
  );
  console.log("setMinter result: ", result)

  await getMinterInfo()
}
async function approve() {
  const [deployer] = await ethers.getSigners();
  const MyContract = await ethers.getContractFactory("Upfi");
  const contract = await MyContract.attach(UPFI_CONTRACT_ADDRESS);
  let result = await contract.connect(deployer).approve(POOL_CONTRACT_ADDRESS, ethers.utils.parseUnits("1000000", 18));
  console.log("Approve result: ", result)
}

async function getMinterInfo() {
  const [deployer] = await ethers.getSigners();
  const MyContract = await ethers.getContractFactory("Upfi");
  const contract = await MyContract.attach(UPFI_CONTRACT_ADDRESS);
  let result = await contract.getMinter(POOL_CONTRACT_ADDRESS);
  console.log("getMinterInfo result: ", result)
}


setMinter().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

