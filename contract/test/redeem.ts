import { expect } from "chai";
import { ethers } from "hardhat";

describe("Redeem", function () {
  it("Should Redeem", async function () {
    const [signer] = await ethers.getSigners();

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

    const Pool = await ethers.getContractFactory("Pool");
    const pool = await Pool.deploy(
      UPFI,
      USDC,
      TREASURY,
      ethers.utils.parseUnits("100000000", 18)
    );

    await pool.deployed();
    
    const UPO_USD = ethers.utils.parseUnits("0.03", 6)

    await pool.connect(signer).addTokenShare("UPO", UPO);
    await pool.connect(signer).setTokenSharePrice("UPO", UPO_USD)

    await upo.setMinter(signer.address, ethers.utils.parseUnits("100000000", 18))
    await upo.mint(pool.address, ethers.utils.parseUnits("1000000", 18))
    await upo.mint(signer.address, ethers.utils.parseUnits("1000000", 18))

    await upfi.setMinter(pool.address, ethers.utils.parseUnits("100000000", 18))

    await usdc.setMinter(signer.address, ethers.utils.parseUnits("100000000", 18))
    await usdc.mint(pool.address, ethers.utils.parseUnits("1000000", 18))
    await usdc.mint(signer.address, ethers.utils.parseUnits("1000000", 18))

    //approve
    await upfi.connect(signer).approve(signer.address, ethers.utils.parseUnits("1000000000", 18));
    await usdc.connect(signer).approve(signer.address, ethers.utils.parseUnits("1000000000", 18));
    await upo.connect(signer).approve(signer.address, ethers.utils.parseUnits("1000000000", 18));

    await upfi.connect(signer).approve(pool.address, ethers.utils.parseUnits("1000000000", 18));
    await usdc.connect(signer).approve(pool.address, ethers.utils.parseUnits("1000000000", 18));
    await upo.connect(signer).approve(pool.address, ethers.utils.parseUnits("1000000000", 18));


    //mint to redeem afterward
    await pool
    .connect(signer)
    .mint(ethers.utils.parseUnits("10000", 18), ethers.utils.parseUnits("100000", 18), ethers.utils.parseUnits("25", 18), 'UPO');

    const _dollar_amount = ethers.utils.parseUnits("1000", 18);
    const _share_out_min = ethers.utils.parseUnits("991", 18);
    const _collateral_out_min = ethers.utils.parseUnits("173", 18);

    let result = await pool
      .connect(signer)
      .redeem(_dollar_amount, _collateral_out_min, _share_out_min, 'UPO');
    
    console.log("Redeem result: ", result)
  });
});
