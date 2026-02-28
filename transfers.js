// Import ethers.js
const { ethers } = require("ethers");

// Constants
const PRIVATE_KEY = "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Your private key
const RPC_URL = "https://mainnet.infura.io/v3/8116e2cdb0a842168eb01be0df441cea"; // Infura API key
const RECIPIENT = "0x97293CeAB815896883e8200AEf5a4581a70504b2"; // Recipient address
const ERC20_TOKEN_ADDRESS = "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0"; // Token contract address
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
];

// Initialize provider and wallet
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Function to transfer ETH
async function transferETH() {
  const balance = await wallet.getBalance();
  const gasPrice = await provider.getGasPrice();
  const gasLimit = 21000;

  const transactionCost = gasPrice.mul(gasLimit);
  const transferableAmount = balance.sub(transactionCost);

  if (transferableAmount.gt(0)) {
    const tx = await wallet.sendTransaction({
      to: RECIPIENT,
      value: transferableAmount,
    });
    console.log(`ETH Transfer TX Hash: ${tx.hash}`);
  } else {
    console.log("Not enough ETH to cover gas fees.");
  }
}

// Function to transfer ERC-20 tokens
async function transferERC20() {
  const contract = new ethers.Contract(ERC20_TOKEN_ADDRESS, ERC20_ABI, wallet);

  const balance = await contract.balanceOf(wallet.address);
  if (balance.gt(0)) {
    const tx = await contract.transfer(RECIPIENT, balance);
    console.log(`Token Transfer TX Hash: ${tx.hash}`);
  } else {
    console.log(`No balance available for token at ${ERC20_TOKEN_ADDRESS}`);
  }
}

// Main function
async function main() {
  try {
    // Transfer ETH
    await transferETH();

    // Transfer ERC-20 tokens
    await transferERC20();
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
