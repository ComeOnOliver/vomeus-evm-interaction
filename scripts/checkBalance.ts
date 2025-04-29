import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.ETH_MAINNET_RPC);

    const address = process.env.PRIVATE_KEY
        ? new ethers.Wallet(process.env.PRIVATE_KEY).address
        : "";

    if (!address) {
        console.error("No address found. Check your PRIVATE_KEY in .env");
        return;
    }

    const balance = await provider.getBalance(address);
    console.log(`Address: ${address}`);
    console.log(`Balance: ${ethers.formatEther(balance)} ETH`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
