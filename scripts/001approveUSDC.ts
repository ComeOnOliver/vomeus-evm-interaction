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
    const usdc = await ethers.getContractAt("IERC20", USDC_ADDRESS, signer);

    const amountToApprove = ethers.parseUnits("5", 6) // 2 USDC (USDC has 6 decimals)

    const tx = await usdc.approve(contractAddress, amountToApprove);
    console.log(`Approving... TX: ${tx.hash}`);
    await tx.wait();
    console.log(`Approval done.`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
