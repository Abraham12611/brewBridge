"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const relayer_1 = require("./relayer");
async function main() {
    const relayer = new relayer_1.BridgeRelayer();
    await relayer.start();
}
main().catch((error) => {
    console.error('Failed to start relayer:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map