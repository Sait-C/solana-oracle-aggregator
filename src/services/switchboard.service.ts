import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  SwitchboardProgram,
  AggregatorAccount,
} from "@switchboard-xyz/solana.js";
import Big from "big.js";
import bs58 from "bs58";

export async function loadProgramAndFetch() {
  const connection = new Connection(clusterApiUrl("devnet"));
  const secretKey = bs58.decode(
    "4m4jxtRgsxm9C4ogNj2qjZxpdESjTEJPxsDmFg1fL9i7VaefMfXqJzQPBWFFeVTuDoH2mFouEzf1WwMeF4hzo8je"
  );
  const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));

  const program = await SwitchboardProgram.load(
    connection,
    payer,
    new PublicKey("SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f")
  );

  const aggregatorPubkey = new PublicKey(
    "8SXvChNYFhRq4EZuZvnhjrB3jJRQCv4k3P4W6hesH3Ee"
  );

  const aggregatorAccount = new AggregatorAccount(program, aggregatorPubkey);

  const result: Big | null = await aggregatorAccount.fetchLatestValue();
  if (result === null) {
    throw new Error("Aggregator holds no value");
  }
  console.log(result.toString());
}
