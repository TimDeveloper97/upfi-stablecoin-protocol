import { ethers } from "hardhat";
const TREASURY_CONTRACT_ADDRESS = "0x2715abDBD52ec08576a14764A51C22Aa21C8CC9d"
const UPFI = "0x43E7A150FABdBB613dA446b07DB42dcAa3a1ef1c";
const UPO = "0x0F3C47a687960eCBad9E969Ea483E5E8b4D22Fb1";
const USDC = "0xfe2c9efd1A63aA254ACaE60Bd4F37e657413f4E6";

async function deploy() {
  const Treasury = await ethers.getContractFactory("Treasury");
  const treasury = await Treasury.deploy()

  await treasury.deployed();
  console.log("Treasury deployed to:", treasury.address);
}

async function info() {
  const MyContract = await ethers.getContractFactory("Treasury");
  const contract = await MyContract.attach(TREASURY_CONTRACT_ADDRESS);

  const info = await contract.info();
  console.log("Treasury Info: ", info);
}


async function setDolarAndShareAddress() {
  const MyContract = await ethers.getContractFactory("Treasury");
  const contract = await MyContract.attach(TREASURY_CONTRACT_ADDRESS);

  const dolarAddressResult = await contract.setDollarAddress(UPFI);
  console.log("dolarAddressResult: ", dolarAddressResult);

  const shareAddressResult = await contract.setShareAddress(USDC);
  console.log("shareAddressResult: ", shareAddressResult);
}

setDolarAndShareAddress().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
