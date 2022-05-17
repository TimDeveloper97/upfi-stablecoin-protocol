import { ethers } from "hardhat";

const UPFI = "0x43E7A150FABdBB613dA446b07DB42dcAa3a1ef1c";
const UPO = "0x0F3C47a687960eCBad9E969Ea483E5E8b4D22Fb1";
const USDC = "0xfe2c9efd1A63aA254ACaE60Bd4F37e657413f4E6";
const TREASURY = "0x2715abDBD52ec08576a14764A51C22Aa21C8CC9d";
const POOL_CONTRACT_ADDRESS = "0xF0892b3B18438B595dE94490d4Ce87FB0AC9647B";
const STDREFERENCE_EMERALD = "0xdE2022A8aB68AE86B0CD3Ba5EFa10AaB859d0293";
const BAND_CONTRACT_ADDRESS = "0x03F917e8ba1cF7D2779ac9ce460851331B092CCA";

async function deploy() {
  const Band = await ethers.getContractFactory("BandOracle");
  const band = await Band.deploy(STDREFERENCE_EMERALD);

  await band.deployed();

  console.log("Band deployed to:", band.address);
}

async function info() {
  const MyContract = await ethers.getContractFactory("BandOracle");
  const contract = await MyContract.attach(BAND_CONTRACT_ADDRESS);

  console.log("BTC/USD", await contract.getPrice("BTC", "USD"));
  console.log("ETH/USD", await contract.getPrice("ETH", "USD"));
  console.log("ROSE/USD", await contract.getPrice("ROSE", "USD"));

}

info().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
