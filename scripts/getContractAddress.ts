import * as dotenv from "dotenv";
import hre from "hardhat";

dotenv.config();

async function main() {
    const contractAddress = process.env.VOMEUS_RECEIVER_ADDRESS;

    if (!contractAddress) {
        console.error("Contract address not found in .env file. Please make sure VOMEUS_RECEIVER_ADDRESS is set.");
        return;
    }

    console.log(`Contract Address: ${contractAddress}`);

    // Also get some blockchain info for verification
    const network = await hre.network.name;
    console.log(`Current network: ${network}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 