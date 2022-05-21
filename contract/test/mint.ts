import { expect } from "chai";
import { ethers } from "hardhat";

describe("Mint", function () {
  it("Should Mint", async function () {
    const [signer, other] = await ethers.getSigners();

    const Upfi = await ethers.getContractFactory("Upfi");
    const upfi = await Upfi.deploy("Upfi coin", "UPFI");
    await upfi.deployed();

    const Usdc = await ethers.getContractFactory("Usdc");
    const usdc = await Usdc.deploy("Usdc coin", "USDC");
    await usdc.deployed();

    const Upo = await ethers.getContractFactory("Upo");
    const upo = await Upo.deploy("Upo coin", "UPO");
    await upo.deployed();

    const Treasury = await ethers.getContractFactory("Treasury");
    const treasury = await Treasury.deploy();
    await treasury.deployed();

    await treasury.setDollarAddress(upfi.address);
    await treasury.setShareAddress(usdc.address);

    const UPFI = upfi.address;
    const UPO = upo.address;
    const USDC = usdc.address;
    const TREASURY = treasury.address;

    const UPO_USD = ethers.utils.parseUnits("0.03", 6)

    const Pool = await ethers.getContractFactory("Pool");
    const pool = await Pool.deploy(
      UPFI,
      USDC,
      TREASURY,
      ethers.utils.parseUnits("100000000", 18)
    );

    await pool.deployed();

    await pool.connect(other).addTokenShare("UPO", UPO);
    await pool.connect(other).setTokenSharePrice("UPO", UPO_USD)

    await upo.setMinter(
      other.address,
      ethers.utils.parseUnits("100000000", 18)
    );
    await upo.mint(pool.address, ethers.utils.parseUnits("1000000", 18));
    await upo.mint(other.address, ethers.utils.parseUnits("1000000", 18));

    await upfi.setMinter(
      pool.address,
      ethers.utils.parseUnits("100000000", 18)
    );

    await usdc.setMinter(
      other.address,
      ethers.utils.parseUnits("100000000", 18)
    );
    await usdc.mint(pool.address, ethers.utils.parseUnits("1000000", 18));
    await usdc.mint(other.address, ethers.utils.parseUnits("1000000", 18));

    //approve
    // await upfi
    //   .connect(signer)
    //   .approve(signer.address, ethers.utils.parseUnits("1000000000", 18));
    // await usdc
    //   .connect(signer)
    //   .approve(signer.address, ethers.utils.parseUnits("1000000000", 18));
    // await upo
    //   .connect(signer)
    //   .approve(signer.address, ethers.utils.parseUnits("1000000000", 18));

    await upfi
      .connect(other)
      .approve(pool.address, ethers.utils.parseUnits("1000000000", 18));
    await usdc
      .connect(other)
      .approve(pool.address, ethers.utils.parseUnits("1000000000", 18));
    await upo
      .connect(other)
      .approve(pool.address, ethers.utils.parseUnits("1000000000", 18));

    const _collateral_amount = ethers.utils.parseUnits("100", 18);
    const _share_amount = ethers.utils.parseUnits("500", 18);
    const _dollar_out_min = ethers.utils.parseUnits("1", 18);
    const SYMBOL = "UPO"

    console.log("Upfi before: ", ethers.utils.formatEther(await upfi.balanceOf(signer.address)));
    console.log("USDC before: ", ethers.utils.formatEther(await usdc.balanceOf(signer.address)));
    console.log("UPO before: ", ethers.utils.formatEther(await upo.balanceOf(signer.address)));

    let result = await pool
      .connect(other)
      .mint(_collateral_amount, _share_amount, _dollar_out_min, SYMBOL);

    console.log("Mint result:: ", result)
    console.log("============")
    console.log("Upfi after: ", ethers.utils.formatEther(await upfi.balanceOf(signer.address)));
    console.log("USDC after: ", ethers.utils.formatEther(await usdc.balanceOf(signer.address)));
    console.log("UPO after: ", ethers.utils.formatEther(await upo.balanceOf(signer.address))); 
  
    let result2 = await pool
    .connect(other)
    .mint(_collateral_amount, _share_amount, _dollar_out_min, SYMBOL);

    console.log("Mint result 2: ", result2)
    console.log("Mint result:: ", result)
    console.log("============")
    console.log("Upfi after: ", ethers.utils.formatEther(await upfi.balanceOf(signer.address)));
    console.log("USDC after: ", ethers.utils.formatEther(await usdc.balanceOf(signer.address)));
    console.log("UPO after: ", ethers.utils.formatEther(await upo.balanceOf(signer.address))); 
  });
  
});