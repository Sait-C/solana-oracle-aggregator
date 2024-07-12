import { AccountInfo, PublicKey } from "@solana/web3.js";
import { useConnection } from "@/composables/useSolanaConnection";
import { Buffer } from "buffer";
export async function pullPriceFeed(address: string) {
  // Connect to solana network
  const connection = await useConnection();

  // Chainlink Feed account address on Solana devnet
  // Fetch the account data
  const priceFeedAddress = new PublicKey(address);

  try {
    const accountInfo: AccountInfo<Buffer> | null | undefined =
      await connection?.getAccountInfo(priceFeedAddress);
    if (accountInfo === null || accountInfo?.data.length === 0) {
      console.error(
        "Failed to fetch account info. Please check your price feed address"
      );
      return null;
    }

    console.log(accountInfo?.data);

    const price: number | null | undefined =
      accountInfo?.data.readUInt32LE(0) ?? null;

    return price !== null ? price / 100000000 : price; // Assuming 8 decimal places, adjust if different
  } catch (error) {
    console.error("Error fetching price:", error);
  }
}
