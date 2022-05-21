import { ethers } from "hardhat";

const UPFI = "0x43E7A150FABdBB613dA446b07DB42dcAa3a1ef1c";
const UPO = "0x0F3C47a687960eCBad9E969Ea483E5E8b4D22Fb1";
const USDC = "0xfe2c9efd1A63aA254ACaE60Bd4F37e657413f4E6";
const POOL_CONTRACT_ADDRESS = "0xF0892b3B18438B595dE94490d4Ce87FB0AC9647B"
const MY_ACCOUNT = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

async function approve() {
  const [deployer, other] = await ethers.getSigners();
  const Upfi = await ethers.getContractFactory("Upfi");
  const upfi = Upfi.attach(UPFI);
  let result = await upfi.connect(other).approve(POOL_CONTRACT_ADDRESS, ethers.utils.parseUnits("1000000", 18));
  console.log("Upfi result: ", result)


  const Usdc = await ethers.getContractFactory("Usdc");
  const usdc = Usdc.attach(USDC);
  let result1 = await usdc.connect(other).approve(POOL_CONTRACT_ADDRESS, ethers.utils.parseUnits("1000000", 18));
  console.log("Usdc result: ", result1)

  const Upo = await ethers.getContractFactory("Upo");
  const upo = Upo.attach(UPO);
  let result2 = await upo.connect(other).approve(POOL_CONTRACT_ADDRESS, ethers.utils.parseUnits("1000000", 18));
  console.log("Upo result: ", result2)
}

approve().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

