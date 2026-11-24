// Real-Life Patch Notes: The Comedy Changelog — v1
//
// Writes the entry's single patch-note line to /output/entry.txt.
// Deterministic: the same constant line on every run — no clock,
// no randomness, no network, no input read.
import { chmodSync, mkdirSync, writeFileSync } from "node:fs";

const ENTRY =
  "v2.4.6: fixed a bug where the mouth said 'I'm not hungry' and then ate half the fries off your plate.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = `${outDir}/entry.txt`;
writeFileSync(outPath, ENTRY, "utf8");
chmodSync(outPath, 0o644);
