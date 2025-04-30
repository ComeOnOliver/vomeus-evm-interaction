import * as dotenv from "dotenv";
import hre from "hardhat";

dotenv.config();

async function main() {
    const contractAddress = process.env.VOMEUS_RECEIVER_ADDRESS;

    if (!contractAddress) {
        console.error("Contract address not found in .env file. Please make sure VOMEUS_RECEIVER_ADDRESS is set.");
        return;
    }

    // Get signer and set recipient to signer's address if not provided in args
    const [signer] = await hre.ethers.getSigners();
    const args = process.argv.slice(2);
    const toAddress = args[0] || await signer.getAddress();

    // Fixed amount: 5 USDC (with 6 decimals)
    const amount = 5_000000;

    console.log(`Using contract address: ${contractAddress}`);
    console.log(`Withdrawing ${amount / 1_000000} USDC to ${toAddress}`);

    // Connect to contract and execute withdrawal
    const receiverContract = await hre.ethers.getContractAt("VomeusReceiver", contractAddress);
    const tx = await receiverContract.withdraw(toAddress, amount);
    console.log(`Transaction sent: ${tx.hash}`);

    await tx.wait();
    console.log(`Withdrawal completed successfully`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
