import { createThirdwebClient } from "thirdweb";
import { upload } from "thirdweb/storage";
import dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

async function main() {
    const IPFSSecret = process.env.IPFSSecret || "";

    if (!IPFSSecret) {
        console.error("Error: IPFSClient not found in .env file");
        process.exit(1);
    }

    console.log("Connecting to IPFS...");
    const client = createThirdwebClient({
        secretKey: IPFSSecret,
    });

    // Path to Weixin image
    const imagePath = path.join(__dirname, "VomeusMysteriousBox.png");

    try {
        // Read the image file
        const imageData = fs.readFileSync(imagePath);
        console.log(`Image loaded: ${imagePath} (${imageData.length} bytes)`);

        // Create a File object
        const imageFile = new File([imageData], "VomeusMysteriousBox.png", { type: "image/png" });

        console.log("Uploading to IPFS...");
        const uris = await upload({
            client,
            files: [imageFile],
        });

        console.log("Upload successful!");
        console.log("IPFS URI:", uris);

        // Save the URI to a file for reference
        fs.writeFileSync(
            path.join(__dirname, "ipfs_uri.txt"),
            JSON.stringify(uris, null, 2)
        );
        console.log("URI saved to ipfs_uri.txt");

    } catch (error) {
        console.error("Error uploading to IPFS:", error);
        process.exit(1);
    }
}

main();

