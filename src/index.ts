import { BridgeRelayer } from './relayer';

async function main() {
  const relayer = new BridgeRelayer();
  await relayer.start();
}

main().catch((error: Error) => {
  console.error('Failed to start relayer:', error);
  process.exit(1);
});