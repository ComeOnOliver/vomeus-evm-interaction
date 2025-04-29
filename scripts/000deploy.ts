import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import hre from "hardhat";

dotenv.config();

async function main() {
    const VomeusReceiver = await hre.ethers.getContractFactory("VomeusReceiver");
    const vomeusReceiver = await VomeusReceiver.deploy();

    await vomeusReceiver.waitForDeployment();

    const contractAddress = await vomeusReceiver.getAddress();
    console.log(`VomeusReceiver deployed to: ${contractAddress}`);

    // Save the contract address to .env file
    const envPath = path.resolve(__dirname, "../.env");
    let envContent = '';

    try {
        if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf8');
        }

        // Check if VOMEUS_RECEIVER_ADDRESS already exists in .env
        if (envContent.includes('VOMEUS_RECEIVER_ADDRESS=')) {
            // Replace existing value
            envContent = envContent.replace(
                /VOMEUS_RECEIVER_ADDRESS=.*/,
                `VOMEUS_RECEIVER_ADDRESS=${contractAddress}`
            );
        } else {
            // Add new entry
            envContent += `\nVOMEUS_RECEIVER_ADDRESS=${contractAddress}`;
        }

        // Write back to .env file
        fs.writeFileSync(envPath, envContent);
        console.log(`Contract address saved to .env file as VOMEUS_RECEIVER_ADDRESS`);
    } catch (error) {
        console.error("Error saving contract address to .env file:", error);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
