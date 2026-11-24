// Real-Life Patch Notes: The Comedy Changelog — v2
//
// Emits the entry's single patch-note line to <output dir>/entry.txt.
// The line is a fixed constant, so every run produces identical bytes:
// no clock, no randomness, no network, no input is read.
import { chmodSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "v2.4.6: fixed a bug where the mouth said 'I'm not hungry' and then ate half the fries off your plate.";

function resolveOutputDir(): string {
  const configured = process.env.MAKEFUN_OUTPUT_DIR;
  return configured !== undefined && configured.length > 0
    ? configured
    : "/output";
}

function checkEntry(line: string): void {
  if (line.trim().length === 0) {
    throw new Error("entry must not be blank");
  }
  if (line.length < 1 || line.length > 160) {
    throw new Error(`entry must be 1-160 characters, got ${line.length}`);
  }
  const encoded = Buffer.from(line, "utf8");
  if (encoded.toString("utf8") !== line) {
    throw new Error("entry is not valid UTF-8 text");
  }
}

function writeEntry(dir: string, line: string): string {
  mkdirSync(dir, { recursive: true });
  const target = join(dir, "entry.txt");
  const staging = join(dir, ".entry.txt.tmp");
  writeFileSync(staging, line, { encoding: "utf8" });
  renameSync(staging, target);
  chmodSync(target, 0o644);
  return target;
}

function confirmWritten(target: string, expected: string): void {
  const onDisk = readFileSync(target, "utf8");
  if (onDisk !== expected) {
    throw new Error("read-back mismatch: entry.txt does not match the entry");
  }
}

function main(): void {
  checkEntry(ENTRY);
  const dir = resolveOutputDir();
  const target = writeEntry(dir, ENTRY);
  confirmWritten(target, ENTRY);
}

main();
