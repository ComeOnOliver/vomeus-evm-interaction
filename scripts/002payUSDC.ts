import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

async function main() {
    const contractAddress = process.env.VOMEUS_RECEIVER_ADDRESS;

    if (!contractAddress) {
        console.error("Contract address not found in .env file. Please make sure VOMEUS_RECEIVER_ADDRESS is set.");
        return;
    }

    console.log(`Using contract address from .env: ${contractAddress}`);

    const [signer] = await ethers.getSigners();

    // Connect to the VomeusReceiver contract
    const receiverContract = await ethers.getContractAt("VomeusReceiver", contractAddress);

    // Call the pay function to purchase 1 NFT
    const buyTimes = 1; // Buying 1 time

    console.log(`Paying for ${buyTimes} NFT...`);
    const tx = await receiverContract.pay(buyTimes);
    console.log(`Transaction sent. TX hash: ${tx.hash}`);
    await tx.wait();
    console.log(`Payment completed successfully.`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
