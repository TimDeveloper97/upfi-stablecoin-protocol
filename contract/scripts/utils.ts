import { ethers, BigNumber, BigNumberish } from 'ethers';
import { Signer } from 'ethers';
import AllBigNumber from 'bignumber.js';
import { ethers as ethers_hardhat, network } from 'hardhat';
import fs from 'fs';
import inquirer from 'inquirer';

export function ethFromBigNumber(val: BigNumber) {
  return ethers.utils.formatEther(val);
}

export function eth(val: number) {
  return ethers.utils.parseEther(`${val}`);
}

export async function waitCallContract(task: Promise<any>) {
  let result = await task;
  result = result && result.wait && (await result.wait());
  return {
    type: result.type,
    status: result.status,
    gasUsed: result.gasUsed,
    blockHash: result.blockHash,
    transactionHash: result.transactionHash,
  };
}

export async function sleep(minisecond: number) {
  return new Promise<void>((resolve: () => void, reject: () => void) => {
    setTimeout(function () {
      resolve();
    }, minisecond);
  });
}

export async function saveDeploymentInfo(info: any, filename: string) {
  filename = filename + '.json';
  if (!filename) {
    console.log(`!file name`);
    return;
  }
  const exists = await fileExists(filename);
  if (exists) {
    const overwrite = await confirmOverwrite(filename);
    if (!overwrite) {
      return false;
    }
  }

  console.log(`Writing deployment info to ${filename}`);
  const content = JSON.stringify(info, null, 2);
  fs.writeFileSync(filename, content, { encoding: 'utf-8' });
  return true;
}

export async function loadDeploymentInfo(deployInfo: any) {
  const content = fs.readFileSync(deployInfo, { encoding: 'utf8' });
  deployInfo = JSON.parse(content);
  return deployInfo;
}

async function fileExists(path: string) {
  try {
    fs.accessSync(path);
    return true;
  } catch (e) {
    return false;
  }
}

async function confirmOverwrite(filename: string) {
  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'overwrite',
      message: `File ${filename} exists. Overwrite it?`,
      default: false,
    },
  ]);
  return answers.overwrite;
}

export async function deployContract(owner: Signer, contractName: string, ...args: any[]) {
  const contract = await ethers_hardhat.getContractFactory(contractName, owner);
  console.log(`${contractName}: deploy args:`, args);
  const deployer = args.length === 0 ? await contract.deploy() : await contract.deploy(...args);
  await deployer.deployed();
  console.log(`Deployed contract: ${contractName} address= ${deployer.address}, tx: ${deployer.deployTransaction.hash}`);
  console.log(`--------------------------------------------`);
  const saveInfo = {
    network: network.name,
    contract: {
      ...args,
      name: contractName,
      address: deployer.address,
      abi: deployer.interface.format(),
    },
  };
  contractName = network.name + '_info/' + contractName;
  if (network.name !== 'hardhat') {
    await saveDeploymentInfo(saveInfo, contractName);
  }
  return deployer;
}

export function toWei(n: BigNumberish): BigNumber {
  return expandDecimals(n, 18);
}

export function fromWei(n: BigNumberish): string {
  return collapseDecimals(n, 18);
}

export function expandDecimals(n: BigNumberish, decimals = 18): BigNumber {
  return BigNumber.from(new AllBigNumber(n.toString()).multipliedBy(new AllBigNumber(10).pow(decimals)).toFixed());
}

export function expandDecimalsString(n: BigNumberish, decimals = 18): string {
  return new AllBigNumber(n.toString()).multipliedBy(new AllBigNumber(10).pow(decimals)).toFixed();
}

export function collapseDecimals(n: BigNumberish, decimals = 18): string {
  return new AllBigNumber(n.toString()).div(new AllBigNumber(10).pow(decimals)).toFixed();
}

export async function getBalance(ethers: any, address: string): Promise<any> {
  return ethers.provider.getBalance(address);
}
