// import { expect } from "chai";
// import { ethers } from "hardhat";

// describe("Pool", function () {
//   it("Should return exact price after change", async function () {
//     const [signer] = await ethers.getSigners();

//     const Upfi = await ethers.getContractFactory("Upfi");
//     const upfi = await Upfi.deploy("Upfi coin", "UPFI");
//     await upfi.deployed();

//     const Usdc = await ethers.getContractFactory("Usdc");
//     const usdc = await Usdc.deploy("Usdc coin", "USDC");
//     await usdc.deployed();

//     const Upo = await ethers.getContractFactory("Upo");
//     const upo = await Upo.deploy("Upo coin", "UPO");
//     await upo.deployed();

//     const Treasury = await ethers.getContractFactory("Treasury");
//     const treasury = await Treasury.deploy();
//     await treasury.deployed();

//     const UPFI = upfi.address;
//     const UPO = upo.address;
//     const USDC = usdc.address;
//     const TREASURY = treasury.address;

//     const Pool = await ethers.getContractFactory("Pool");
//     const pool = await Pool.deploy(
//       UPFI,
//       USDC,
//       TREASURY,
//       ethers.utils.parseUnits("100000000", 18)
//     );

//     await pool.deployed();

//     await pool.connect(signer).addTokenShare("UPO", upo.address)

//     const BTC_USD = ethers.utils.parseUnits("27120", 18)
//     const ETH_USD = ethers.utils.parseUnits("1812", 18)
//     const ROSE_USD = ethers.utils.parseUnits("0.012", 18)
//     const UPO_USD = ethers.utils.parseUnits("0.003", 18)

//     await pool.connect(signer).setTokenSharePrice("BTC", BTC_USD)
//     await pool.connect(signer).setTokenSharePrice("ETH", ETH_USD)
//     await pool.connect(signer).setTokenSharePrice("ROSE", ROSE_USD)
//     await pool.connect(signer).setTokenSharePrice("UPO", UPO_USD)

//     const btcPrice = ethers.utils.formatEther(await pool.getTokenSharePrice("BTC"));
//     const ethPrice = ethers.utils.formatEther(await pool.getTokenSharePrice("ETH"));
//     const rosePrice = ethers.utils.formatEther(await pool.getTokenSharePrice("ROSE"));
//     const upoPrice = ethers.utils.formatEther(await pool.getTokenSharePrice("UPO"));
//     console.log("btcPrice", btcPrice)
//     console.log("ethPrice", ethPrice)
//     console.log("rosePrice", rosePrice)
//     console.log("upoPrice", upoPrice)

//   });
// });
